'use client'

import { use, useState, useMemo } from 'react'
import { mockStudentDetails, mockLessonRecords, mockTemplates } from '@/mocks/_db'
import { colors } from '@/styles/tokens/colors'

const c = colors

// ─── 헬퍼 ───────────────────────────────────────────────────────────────────
function extractLessonStats(studentId: number, lessonId: number) {
  const lesson = mockLessonRecords.find((l) => l.id === lessonId)
  if (!lesson) return null

  const tpl = mockTemplates.find((t) => t.id === lesson.template_id)
  if (!tpl) return null

  const sd = lesson.student_data.find((s) => s.student_id === studentId)
  if (!sd || sd.items.length === 0) return null

  const attId = tpl.items.find((i) => i.item_type === 'ATTENDANCE')?.id
  const scoreId = tpl.items.find((i) => i.item_type === 'NUMBER')?.id
  const hwId = tpl.items.find((i) => i.item_type === 'COMPLETE')?.id

  const getVal = (id?: number) =>
    id !== undefined ? sd.items.find((i) => i.template_item_id === id) : undefined

  const attRaw = getVal(attId)?.value
  const scoreRaw = getVal(scoreId)?.value
  const hwItem = getVal(hwId)

  // 공통 학습 내용 (TEXT, common)
  const topicItem = tpl.items.find(
    (i) => i.item_type === 'TEXT' && i.is_common && i.sort_order <= 4,
  )
  const topic = topicItem
    ? lesson.common_data.find((d) => d.template_item_id === topicItem.id)?.value ?? null
    : null

  return {
    lessonId: lesson.id,
    date: lesson.lesson_date,
    className: lesson.class_name,
    attendance:
      attRaw === '출석' || attRaw === '지각' || attRaw === '결석'
        ? (attRaw as '출석' | '지각' | '결석')
        : null,
    score: scoreRaw ? Number(scoreRaw) || null : null,
    homeworkDone: hwItem ? (hwItem.is_completed ?? null) : null,
    topic,
  }
}

function generateFeedback(
  student: (typeof mockStudentDetails)[number],
  lessonList: ReturnType<typeof extractLessonStats>[],
): string {
  const name = student.name
  const rate = student.stats.completion_rate
  const incomplete = student.stats.total_incomplete_items
  const validLessons = lessonList.filter(Boolean) as NonNullable<
    ReturnType<typeof extractLessonStats>
  >[]
  const scores = validLessons.filter((l) => l.score !== null).map((l) => l.score!)
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
  const trend =
    scores.length >= 2 ? scores[0] - scores[scores.length - 1] : 0

  if (rate >= 0.9 && (avgScore === null || avgScore >= 80)) {
    return `${name} 학생이 매우 성실하게 수업에 임하고 있어요. 과제와 학습 태도가 훌륭합니다.${avgScore !== null ? ` 최근 평균 점수도 ${avgScore}점으로 꾸준히 좋은 성취를 보이고 있습니다.` : ''} 앞으로도 함께 응원 부탁드립니다!`
  }
  if (incomplete >= 3) {
    return `${name} 학생의 미완료 과제가 ${incomplete}건 있어요. 가정에서 학습 독려를 함께 해주시면 큰 도움이 됩니다. 어렵거나 막히는 부분이 있다면 선생님께 편하게 연락 주세요.`
  }
  if (trend > 5) {
    return `${name} 학생의 점수가 최근 ${trend}점 향상됐어요! 꾸준한 노력이 결실을 맺고 있습니다. 이 흐름을 이어나갈 수 있도록 함께 응원해 주세요.`
  }
  if (trend < -5) {
    return `최근 ${name} 학생의 점수가 다소 떨어지는 추세예요. 어려움을 겪고 있는 부분이 없는지 확인해 보겠습니다. 가정에서도 학습 환경을 살펴봐 주시면 감사합니다.`
  }
  return `${name} 학생이 꾸준히 수업에 참여하고 있어요.${avgScore !== null ? ` 최근 평균 점수는 ${avgScore}점입니다.` : ''} 앞으로도 잘 부탁드립니다!`
}

// ─── 서브 컴포넌트 ──────────────────────────────────────────────────────────
function StatBox({
  label,
  value,
  color,
  bg,
}: {
  label: string
  value: string
  color: string
  bg: string
}) {
  return (
    <div
      style={{
        flex: 1,
        background: bg,
        borderRadius: 12,
        padding: '14px 8px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 10, color: c.gray300, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color }}>{value}</div>
    </div>
  )
}

function SectionCard({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        background: c.white,
        borderRadius: 16,
        padding: '18px 18px',
        marginBottom: 10,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: c.gray300,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  )
}

// ─── 메인 페이지 ─────────────────────────────────────────────────────────────
export default function ParentDashboardPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = use(params)
  const studentId = /^\d+$/.test(token) ? Number(token) : null
  const student = studentId ? mockStudentDetails.find((s) => s.id === studentId) : null

  // 수업 이력 계산
  const lessonEntries = useMemo(() => {
    if (!student) return []
    const classIds = student.classes.map((cls) => cls.id)
    return mockLessonRecords
      .filter((l) => classIds.includes(l.class_id))
      .sort((a, b) => b.lesson_date.localeCompare(a.lesson_date))
      .map((l) => extractLessonStats(student.id, l.id))
      .filter(
        (l): l is NonNullable<ReturnType<typeof extractLessonStats>> => l !== null,
      )
  }, [student])

  const latestLesson = lessonEntries[0] ?? null
  const recentHistory = lessonEntries.slice(1, 6)

  const aiFeedback = useMemo(
    () => (student ? generateFeedback(student, lessonEntries) : ''),
    [student, lessonEntries],
  )

  // 미완료 항목 (해야 할 것)
  const [doneIds, setDoneIds] = useState<Set<number>>(new Set())
  const todoItems = student?.incomplete_items ?? []
  const activeTodos = todoItems.filter(
    (item) => !doneIds.has(item.lesson_student_data_id),
  )

  // 학생 없음
  if (!student) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F8F9FC',
        }}
      >
        <div style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: c.gray700 }}>
            대시보드를 찾을 수 없어요
          </div>
          <div style={{ fontSize: 13, color: c.gray300, marginTop: 8 }}>
            선생님께 전달받은 링크를 다시 확인해 주세요
          </div>
        </div>
      </div>
    )
  }

  const attColor = (att: string | null) => {
    if (att === '출석') return c.success500
    if (att === '지각') return c.warning500
    if (att === '결석') return c.error500
    return c.gray300
  }
  const attBg = (att: string | null) => {
    if (att === '출석') return c.success50
    if (att === '지각') return c.warning50
    if (att === '결석') return c.error50
    return c.gray50
  }

  return (
    <div style={{ background: '#F4F5F9', minHeight: '100vh' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', paddingBottom: 48 }}>
        {/* ─ 상단 헤더 ─ */}
        <div
          style={{
            background: `linear-gradient(160deg, ${c.primary600} 0%, ${c.primary400} 100%)`,
            padding: '36px 20px 28px',
            color: c.white,
          }}
        >
          {/* 로고 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 20,
              opacity: 0.85,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                background: 'rgba(255,255,255,0.25)',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 800 }}>C</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              {student.classes[0]?.academy_name ?? 'CLAT'} 학부모 포털
            </span>
          </div>

          {/* 학생 정보 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 22, fontWeight: 700 }}>{student.name[0]}</span>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>
                {student.name}{' '}
                <span style={{ fontSize: 14, fontWeight: 400, opacity: 0.8 }}>학생</span>
              </div>
              <div style={{ fontSize: 13, opacity: 0.75, marginTop: 4 }}>
                {student.classes.map((cls) => cls.name).join(' · ')}
              </div>
            </div>
          </div>
        </div>

        {/* ─ 콘텐츠 ─ */}
        <div style={{ padding: '16px 14px 0' }}>
          {/* 최근 수업 요약 */}
          {latestLesson ? (
            <SectionCard
              label={`최근 수업 · ${latestLesson.date} ${latestLesson.className}`}
            >
              <div style={{ display: 'flex', gap: 8, marginBottom: latestLesson.topic ? 12 : 0 }}>
                <StatBox
                  label="출결"
                  value={latestLesson.attendance ?? '-'}
                  color={attColor(latestLesson.attendance)}
                  bg={attBg(latestLesson.attendance)}
                />
                <StatBox
                  label="점수"
                  value={latestLesson.score !== null ? `${latestLesson.score}점` : '-'}
                  color={
                    latestLesson.score !== null && latestLesson.score >= 80
                      ? c.primary500
                      : latestLesson.score !== null
                        ? c.warning500
                        : c.gray300
                  }
                  bg={c.primary50}
                />
                <StatBox
                  label="과제"
                  value={
                    latestLesson.homeworkDone === true
                      ? '완료 ✓'
                      : latestLesson.homeworkDone === false
                        ? '미완료'
                        : '-'
                  }
                  color={
                    latestLesson.homeworkDone === true
                      ? c.success500
                      : latestLesson.homeworkDone === false
                        ? c.warning500
                        : c.gray300
                  }
                  bg={
                    latestLesson.homeworkDone === true
                      ? c.success50
                      : latestLesson.homeworkDone === false
                        ? c.warning50
                        : c.gray50
                  }
                />
              </div>
              {latestLesson.topic && (
                <div
                  style={{
                    background: c.gray50,
                    borderRadius: 10,
                    padding: '10px 13px',
                    fontSize: 13,
                    color: c.gray700,
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ fontSize: 10, color: c.gray300, marginRight: 6 }}>
                    오늘 학습
                  </span>
                  {latestLesson.topic}
                </div>
              )}
            </SectionCard>
          ) : (
            <SectionCard label="최근 수업">
              <p style={{ color: c.gray300, fontSize: 13, textAlign: 'center', padding: '12px 0' }}>
                아직 수업 데이터가 없어요
              </p>
            </SectionCard>
          )}

          {/* 선생님 피드백 */}
          <SectionCard label="선생님 피드백 · AI 생성">
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: c.primary50,
                  border: `1.5px solid ${c.primary100}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 18,
                }}
              >
                👩‍🏫
              </div>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: c.gray700,
                  margin: 0,
                  paddingTop: 2,
                }}
              >
                {aiFeedback}
              </p>
            </div>
          </SectionCard>

          {/* 해야 할 것 */}
          {activeTodos.length > 0 && (
            <SectionCard label={`해야 할 것 · ${activeTodos.length}건`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {activeTodos.map((todo) => (
                  <div
                    key={todo.lesson_student_data_id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 11,
                      padding: '11px 13px',
                      background: c.gray50,
                      borderRadius: 10,
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      setDoneIds((prev) =>
                        new Set([...prev, todo.lesson_student_data_id]),
                      )
                    }
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        border: `2px solid ${c.gray200}`,
                        background: c.white,
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: c.gray900 }}>
                        {todo.item_name}
                      </div>
                      <div style={{ fontSize: 11, color: c.gray300, marginTop: 2 }}>
                        {todo.lesson_date} · {todo.class_name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {todoItems.length > 0 && activeTodos.length === 0 && (
            <SectionCard label="해야 할 것">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: c.success500,
                  fontSize: 13,
                  padding: '4px 0',
                }}
              >
                <span>✓</span>
                <span>모든 항목을 완료했어요!</span>
              </div>
            </SectionCard>
          )}

          {/* 최근 수업 이력 */}
          {recentHistory.length > 0 && (
            <SectionCard label="최근 수업 이력">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {recentHistory.map((lesson, i) => (
                  <div
                    key={lesson.lessonId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom:
                        i < recentHistory.length - 1
                          ? `1px solid ${c.gray50}`
                          : 'none',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: c.gray900,
                        }}
                      >
                        {lesson.date}
                      </span>
                      <span
                        style={{ fontSize: 12, color: c.gray500, marginLeft: 8 }}
                      >
                        {lesson.className}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      {lesson.attendance && (
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: attColor(lesson.attendance),
                            background: attBg(lesson.attendance),
                            borderRadius: 5,
                            padding: '2px 8px',
                          }}
                        >
                          {lesson.attendance}
                        </span>
                      )}
                      {lesson.score !== null && (
                        <span style={{ fontSize: 13, fontWeight: 600, color: c.gray700 }}>
                          {lesson.score}점
                        </span>
                      )}
                      {lesson.homeworkDone !== null && (
                        <span
                          style={{
                            fontSize: 12,
                            color: lesson.homeworkDone ? c.success500 : c.warning500,
                          }}
                        >
                          과제 {lesson.homeworkDone ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* 완료율 요약 */}
          <div
            style={{
              background: c.white,
              borderRadius: 16,
              padding: '16px 18px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 13, color: c.gray600 }}>전체 과제 완료율</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* 진행 바 */}
              <div
                style={{
                  width: 80,
                  height: 6,
                  background: c.gray75,
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${Math.round(student.stats.completion_rate * 100)}%`,
                    height: '100%',
                    background:
                      student.stats.completion_rate >= 0.8
                        ? c.success500
                        : c.warning500,
                    borderRadius: 3,
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color:
                    student.stats.completion_rate >= 0.8 ? c.success500 : c.warning500,
                }}
              >
                {Math.round(student.stats.completion_rate * 100)}%
              </span>
            </div>
          </div>

          <p
            style={{
              textAlign: 'center',
              fontSize: 11,
              color: c.gray300,
              marginTop: 20,
              padding: '0 16px',
              lineHeight: 1.6,
            }}
          >
            이 페이지는 학부모님께만 공유된 비공개 링크입니다.
            <br />
            문의 사항은 담당 선생님께 연락해 주세요.
          </p>
        </div>
      </div>
    </div>
  )
}
