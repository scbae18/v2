'use client'

import { use, useState, useMemo } from 'react'
import { mockStudentDetails, mockLessonRecords, mockTemplates } from '@/mocks/_db'
import { colors } from '@/styles/tokens/colors'
import BookOpenIcon from '@/assets/icons/icon-book-open.svg'
import CheckIcon from '@/assets/icons/icon-check.svg'
import CalendarIcon from '@/assets/icons/icon-calendar.svg'

const c = colors

// ─── 날짜 포맷 ────────────────────────────────────────────────────────────────
function formatDateKo(dateStr: string) {
  const [, m, d] = dateStr.split('-')
  const date = new Date(dateStr)
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']
  return `${Number(m)}월 ${Number(d)}일 (${dayNames[date.getDay()]})`
}

function formatDateShort(dateStr: string) {
  const [, m, d] = dateStr.split('-')
  return `${Number(m)}월 ${Number(d)}일`
}

function getDaysAgo(dateStr: string): number {
  const target = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.floor((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))
}

// ─── 헬퍼 ────────────────────────────────────────────────────────────────────
function extractLessonStats(studentId: number, lessonId: number) {
  const lesson = mockLessonRecords.find((l) => l.id === lessonId)
  if (!lesson) return null

  const tpl = mockTemplates.find((t) => t.id === lesson.template_id)
  if (!tpl) return null

  const sd = lesson.student_data.find((s) => s.student_id === studentId)
  if (!sd || sd.items.length === 0) return null

  const attId = tpl.items.find((i) => i.item_type === 'ATTENDANCE')?.id
  const scoreId = tpl.items.find((i) => i.item_type === 'NUMBER')?.id

  const getVal = (id?: number) =>
    id !== undefined ? sd.items.find((i) => i.template_item_id === id) : undefined

  const attRaw = getVal(attId)?.value
  const scoreRaw = getVal(scoreId)?.value

  return {
    lessonId: lesson.id,
    date: lesson.lesson_date,
    className: lesson.class_name,
    attendance:
      attRaw === '출석' || attRaw === '지각' || attRaw === '결석'
        ? (attRaw as '출석' | '지각' | '결석')
        : null,
    score: scoreRaw ? Number(scoreRaw) || null : null,
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
  const avgScore =
    scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
  const trend = scores.length >= 2 ? scores[0] - scores[scores.length - 1] : 0

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

// ─── 서브 컴포넌트 ────────────────────────────────────────────────────────────
function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {icon}
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          background: `linear-gradient(to right, ${c.primary400}, ${c.primary600})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.42px',
        }}
      >
        {title}
      </span>
    </div>
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: c.white,
        border: `1px solid ${c.gray50}`,
        borderRadius: 16,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: c.gray700,
          letterSpacing: '-0.36px',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: c.primary500,
          letterSpacing: '-0.36px',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function Tag({
  label,
  bg,
  color,
}: {
  label: string
  bg: string
  color: string
}) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: 6,
        padding: '4px 8px',
        fontSize: 10,
        fontWeight: 600,
        color,
        letterSpacing: '-0.3px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
  )
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────
export default function ParentDashboardPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = use(params)
  const studentId = /^\d+$/.test(token) ? Number(token) : null
  const student = studentId ? mockStudentDetails.find((s) => s.id === studentId) : null

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
  const recentHistory = lessonEntries.slice(1, 3)

  const aiFeedback = useMemo(
    () => (student ? generateFeedback(student, lessonEntries) : ''),
    [student, lessonEntries],
  )

  const [doneIds, setDoneIds] = useState<Set<number>>(new Set())
  const todoItems = student?.incomplete_items ?? []
  const activeTodos = todoItems.filter((item) => !doneIds.has(item.lesson_student_data_id))

  if (!student) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: c.background,
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

  const latestClass = student.classes[0]
  const headingDate = latestLesson ? formatDateShort(latestLesson.date) : null

  return (
    <div style={{ background: c.background, minHeight: '100vh' }}>
      <div style={{ maxWidth: 390, margin: '0 auto', position: 'relative' }}>
        {/* ── 장식 원 ── */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: 66,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(87,116,218,0.18) 0%, rgba(87,116,218,0.06) 55%, transparent 75%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── 헤더 ── */}
        <div
          style={{
            paddingTop: 66,
            paddingBottom: 32,
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: c.gray700,
              letterSpacing: '-0.48px',
              marginBottom: 32,
            }}
          >
            {student.name} 학부모님 안녕하세요
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {latestClass && (
              <div
                style={{
                  display: 'inline-flex',
                  background: c.primary400,
                  borderRadius: 4,
                  padding: '4px 8px',
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: c.white,
                    letterSpacing: '-0.36px',
                  }}
                >
                  {latestClass.name}
                </span>
              </div>
            )}
            <p
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: c.gray900,
                letterSpacing: '-0.72px',
                lineHeight: 1.4,
              }}
            >
              {headingDate ? `${headingDate} 수업 결과` : '수업 결과'}
            </p>
          </div>
        </div>

        {/* ── 카드 영역 ── */}
        <div
          style={{
            padding: '0 24px 48px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* 오늘 수업 요약 */}
          {latestLesson ? (
            <Card>
              <SectionTitle
                icon={
                  <BookOpenIcon
                    width={20}
                    height={20}
                    style={{ color: c.primary400, flexShrink: 0 }}
                  />
                }
                title="오늘 수업 요약"
              />
              <StatRow label="출결" value={latestLesson.attendance ?? '-'} />
              {latestLesson.score !== null && (
                <StatRow label="단원평가" value={`${latestLesson.score}점`} />
              )}
            </Card>
          ) : (
            <Card>
              <SectionTitle
                icon={
                  <BookOpenIcon
                    width={20}
                    height={20}
                    style={{ color: c.primary400, flexShrink: 0 }}
                  />
                }
                title="오늘 수업 요약"
              />
              <p style={{ fontSize: 12, color: c.gray300, textAlign: 'center', padding: '8px 0' }}>
                아직 수업 데이터가 없어요
              </p>
            </Card>
          )}

          {/* 선생님 피드백 */}
          <Card>
            <SectionTitle
              icon={
                <BookOpenIcon
                  width={20}
                  height={20}
                  style={{ color: c.primary400, flexShrink: 0 }}
                />
              }
              title="선생님 피드백"
            />
            <p
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: c.gray900,
                lineHeight: 1.4,
                letterSpacing: '-0.36px',
                margin: 0,
              }}
            >
              {aiFeedback}
            </p>
          </Card>

          {/* 해야 할 것 */}
          {activeTodos.length > 0 && (
            <Card>
              <SectionTitle
                icon={
                  <CheckIcon
                    width={18}
                    height={18}
                    style={{ color: c.primary400, flexShrink: 0 }}
                  />
                }
                title="해야 할 것"
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {activeTodos.map((todo) => {
                  const daysAgo = getDaysAgo(todo.lesson_date)
                  return (
                    <div
                      key={todo.lesson_student_data_id}
                      style={{
                        background: c.gray50,
                        borderRadius: 8,
                        padding: '8px 8px 8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                      onClick={() =>
                        setDoneIds((prev) =>
                          new Set([...prev, todo.lesson_student_data_id]),
                        )
                      }
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: c.gray700,
                          letterSpacing: '-0.36px',
                        }}
                      >
                        {todo.item_name}
                      </span>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        {daysAgo > 0 && (
                          <Tag
                            label={`${daysAgo}일 지남`}
                            bg="#fee5e5"
                            color={c.error500}
                          />
                        )}
                        <Tag
                          label={todo.class_name.length > 4 ? todo.class_name.slice(0, 4) : todo.class_name}
                          bg={c.primary100}
                          color={c.primary400}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          {todoItems.length > 0 && activeTodos.length === 0 && (
            <Card>
              <SectionTitle
                icon={
                  <CheckIcon
                    width={18}
                    height={18}
                    style={{ color: c.primary400, flexShrink: 0 }}
                  />
                }
                title="해야 할 것"
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: c.success500,
                  fontSize: 12,
                }}
              >
                <span>✓</span>
                <span>모든 항목을 완료했어요!</span>
              </div>
            </Card>
          )}

          {/* 최근 수업 이력 */}
          {recentHistory.length > 0 && (
            <Card style={{ position: 'relative', minHeight: 170, overflow: 'hidden' }}>
              <SectionTitle
                icon={
                  <CalendarIcon
                    width={20}
                    height={20}
                    style={{ color: c.primary400, flexShrink: 0 }}
                  />
                }
                title="최근 수업 이력"
              />
              <div style={{ position: 'relative', paddingLeft: 32 }}>
                {/* 세로 타임라인 선 */}
                {recentHistory.length > 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 3,
                      top: 6,
                      width: 0,
                      height: 'calc(100% - 12px)',
                      borderLeft: `1px dashed ${c.gray100}`,
                    }}
                  />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {recentHistory.map((lesson) => (
                    <div key={lesson.lessonId} style={{ position: 'relative' }}>
                      {/* 점 */}
                      <div
                        style={{
                          position: 'absolute',
                          left: -29,
                          top: 4,
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: c.primary400,
                        }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <p
                          style={{
                            fontSize: 10,
                            fontWeight: 500,
                            color: c.primary400,
                            letterSpacing: '-0.3px',
                            lineHeight: 1.4,
                          }}
                        >
                          {formatDateKo(lesson.date)}
                        </p>
                        <div
                          style={{
                            display: 'flex',
                            gap: 8,
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: c.gray700,
                              letterSpacing: '-0.36px',
                            }}
                          >
                            {lesson.className}
                          </span>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {lesson.attendance && (
                              <Tag
                                label={lesson.attendance}
                                bg={attBg(lesson.attendance)}
                                color={attColor(lesson.attendance)}
                              />
                            )}
                            {lesson.score !== null && (
                              <Tag
                                label={`단원평가 ${lesson.score}점`}
                                bg={c.gray50}
                                color={c.gray600}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          <p
            style={{
              textAlign: 'center',
              fontSize: 11,
              color: c.gray300,
              marginTop: 8,
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
