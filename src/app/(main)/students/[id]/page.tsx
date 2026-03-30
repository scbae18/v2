'use client'

import { use, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { mockStudentDetails, mockLessonRecords, mockTemplates } from '@/mocks/_db'
import { colors } from '@/styles/tokens/colors'
import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
import ArrowLeftIcon from '@/assets/icons/icon-arrow-left.svg'

const c = colors

// ─── 등록일 (DB에 없어서 별도 정의) ────────────────────────────────────────
const ENROLLED_AT: Record<number, string> = {
  1: '2026.01.05', 2: '2026.01.05', 3: '2026.01.10',
  4: '2026.01.15', 5: '2026.02.01', 6: '2026.01.05',
  7: '2026.01.15', 8: '2026.02.01', 9: '2026.02.10',
  10: '2026.01.20',
}

// ─── 헬퍼 ───────────────────────────────────────────────────────────────────
function getTemplateItemIds(templateId: number) {
  const tpl = mockTemplates.find((t) => t.id === templateId)
  if (!tpl) return { attId: null, scoreId: null, hwId: null, scoreName: '점수' }
  return {
    attId: tpl.items.find((i) => i.item_type === 'ATTENDANCE')?.id ?? null,
    scoreId: tpl.items.find((i) => i.item_type === 'NUMBER')?.id ?? null,
    hwId: tpl.items.find((i) => i.item_type === 'COMPLETE')?.id ?? null,
    scoreName: tpl.items.find((i) => i.item_type === 'NUMBER')?.name ?? '점수',
  }
}

type LessonEntry = {
  lessonId: number
  date: string
  className: string
  status: 'DRAFT' | 'SAVED'
  attendance: '출석' | '지각' | '결석' | null
  score: number | null
  homeworkDone: boolean | null
}

function buildLessonEntry(
  lesson: (typeof mockLessonRecords)[number],
  studentId: number,
): LessonEntry | null {
  const { attId, scoreId, hwId } = getTemplateItemIds(lesson.template_id)
  const sd = lesson.student_data.find((s) => s.student_id === studentId)
  if (!sd || sd.items.length === 0) return null

  const getVal = (id: number | null) =>
    id !== null ? sd.items.find((i) => i.template_item_id === id) : undefined

  const attRaw = getVal(attId)?.value
  const scoreRaw = getVal(scoreId)?.value
  const hwItem = getVal(hwId)

  const attendance =
    attRaw === '출석' || attRaw === '지각' || attRaw === '결석'
      ? (attRaw as '출석' | '지각' | '결석')
      : null

  return {
    lessonId: lesson.id,
    date: lesson.lesson_date,
    className: lesson.class_name,
    status: lesson.status,
    attendance,
    score: scoreRaw ? Number(scoreRaw) || null : null,
    homeworkDone: hwItem ? (hwItem.is_completed ?? null) : null,
  }
}

// ─── 서브 컴포넌트 ──────────────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
  return (
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${c.primary400}, ${c.primary600})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: `0 2px 8px ${c.primary200}`,
      }}
    >
      <span style={{ fontSize: 20, fontWeight: 700, color: c.white }}>{name[0]}</span>
    </div>
  )
}

function Chip({
  label,
  color,
  bg,
}: {
  label: string
  color: string
  bg: string
}) {
  return (
    <span
      style={{
        background: bg,
        color,
        borderRadius: 20,
        padding: '3px 10px',
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

function MetricCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string
  value: string
  sub?: string
  highlight?: boolean
}) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 80,
        background: highlight ? c.primary50 : c.gray50,
        borderRadius: 12,
        padding: '14px 16px',
        border: `1px solid ${highlight ? c.primary100 : 'transparent'}`,
      }}
    >
      <div style={{ fontSize: 11, color: c.gray500, marginBottom: 4 }}>{label}</div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: highlight ? c.primary600 : c.gray900,
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
      {sub && <div style={{ fontSize: 10, color: c.gray300, marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

// ─── 메인 페이지 ─────────────────────────────────────────────────────────────
export default function StudentDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const studentId = Number(id)
  const router = useRouter()

  const student = mockStudentDetails.find((s) => s.id === studentId)

  // 전체 수업 이력 — 모든 학생에 대해 DB에서 직접 계산
  const lessons = useMemo<LessonEntry[]>(() => {
    if (!student) return []
    const classIds = student.classes.map((cls) => cls.id)
    return mockLessonRecords
      .filter((l) => classIds.includes(l.class_id))
      .sort((a, b) => b.lesson_date.localeCompare(a.lesson_date))
      .map((l) => buildLessonEntry(l, studentId))
      .filter((l): l is LessonEntry => l !== null)
  }, [studentId, student])

  // 통계 계산
  const stats = useMemo(() => {
    const withAtt = lessons.filter((l) => l.attendance !== null)
    const attended = withAtt.filter(
      (l) => l.attendance === '출석' || l.attendance === '지각',
    )
    const scores = lessons.filter((l) => l.score !== null).map((l) => l.score!)
    const withHw = lessons.filter((l) => l.homeworkDone !== null)
    const hwDone = withHw.filter((l) => l.homeworkDone === true)
    return {
      attRate:
        withAtt.length > 0 ? Math.round((attended.length / withAtt.length) * 100) : null,
      avgScore:
        scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : null,
      hwRate:
        withHw.length > 0 ? Math.round((hwDone.length / withHw.length) * 100) : null,
      total: lessons.length,
    }
  }, [lessons])

  // 점수 추이 (오래된 순)
  const scoreHistory = useMemo(
    () =>
      lessons
        .filter((l) => l.score !== null)
        .reverse()
        .map((l) => ({
          date: l.date.slice(5),
          score: l.score,
          className: l.className,
        })),
    [lessons],
  )

  // 미완료 항목 — DB의 incomplete_items 사용
  const [doneIds, setDoneIds] = useState<Set<number>>(new Set())
  const incompleteItems = student?.incomplete_items ?? []
  const activeItems = incompleteItems.filter(
    (item) => !doneIds.has(item.lesson_student_data_id),
  )

  // 알림톡 (SAVED 수업 기반 생성)
  const notifications = useMemo(
    () =>
      lessons
        .filter((l) => l.status === 'SAVED')
        .slice(0, 5)
        .map((l, i) => ({
          id: i,
          sentAt: `${l.date} 수업 완료 후 발송`,
          preview: `[${l.className}] 출결: ${l.attendance ?? '미입력'} / 점수: ${l.score !== null ? l.score + '점' : '미입력'} / 과제: ${l.homeworkDone === true ? '완료 ✓' : l.homeworkDone === false ? '미완료' : '미입력'}`,
          isExpired: new Date(l.date) < new Date('2026-03-24'),
        })),
    [lessons],
  )

  if (!student) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: c.gray500 }}>
        <Text variant="headingMd">학생 정보를 찾을 수 없어요</Text>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          style={{ marginTop: 16 }}
        >
          뒤로가기
        </Button>
      </div>
    )
  }

  const completionRate = student.stats.completion_rate
  const enrolledAt = ENROLLED_AT[studentId] ?? '-'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ─ 헤더 ─ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            color: c.gray500,
            display: 'flex',
          }}
        >
          <ArrowLeftIcon width={22} height={22} />
        </button>
        <Text variant="display" as="h1">
          {student.name}
        </Text>
        <span style={{ fontSize: 13, color: c.gray500, fontWeight: 400, marginTop: 2 }}>
          학생 대시보드
        </span>
      </div>

      {/* ─ 프로필 카드 ─ */}
      <div
        style={{
          background: c.white,
          borderRadius: 16,
          padding: '22px 24px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
          display: 'flex',
          gap: 20,
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        <Avatar name={student.name} />

        <div style={{ flex: 1, minWidth: 200 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 10,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 700, color: c.gray900 }}>
              {student.name}
            </span>
            <Chip
              label={
                activeItems.length > 0
                  ? `⚠ 미완료 ${activeItems.length}건`
                  : '✓ 모두 완료'
              }
              color={activeItems.length > 0 ? c.warning500 : c.success500}
              bg={activeItems.length > 0 ? c.warning50 : c.success50}
            />
            <Chip
              label={`완료율 ${Math.round(completionRate * 100)}%`}
              color={completionRate >= 0.8 ? c.success500 : c.primary500}
              bg={completionRate >= 0.8 ? c.success50 : c.primary50}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
              gap: '6px 20px',
            }}
          >
            {[
              { label: '소속 반', value: student.classes.map((cls) => cls.name).join(' · ') || '-' },
              { label: '학교', value: student.school_name ?? '-' },
              { label: '등록일', value: enrolledAt },
              { label: '학생 연락처', value: student.phone },
              { label: '학부모 연락처', value: student.parent_phone },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
                <span
                  style={{ fontSize: 11, color: c.gray300, flexShrink: 0, minWidth: 72 }}
                >
                  {label}
                </span>
                <span style={{ fontSize: 13, color: c.gray700 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          <Button variant="secondary" size="sm" onClick={() => {}}>
            정보 수정
          </Button>
          <a
            href={`/parent/${studentId}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '7px 16px',
              background: c.primary50,
              color: c.primary500,
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              border: `1px solid ${c.primary200}`,
              whiteSpace: 'nowrap',
            }}
          >
            학부모 대시보드 →
          </a>
        </div>
      </div>

      {/* ─ 지표 스트립 ─ */}
      <div style={{ display: 'flex', gap: 10 }}>
        <MetricCard
          label="출석률"
          value={stats.attRate !== null ? `${stats.attRate}%` : '-'}
          sub={`${lessons.length}회 기준`}
          highlight
        />
        <MetricCard
          label="평균 점수"
          value={stats.avgScore !== null ? `${stats.avgScore}점` : '-'}
        />
        <MetricCard
          label="과제 완료율"
          value={stats.hwRate !== null ? `${stats.hwRate}%` : '-'}
        />
        <MetricCard
          label="수업 횟수"
          value={String(lessons.length)}
          sub="데이터 입력 기준"
        />
      </div>

      {/* ─ ★ 미완료 항목 (메인 섹션) ─ */}
      <section
        style={{
          background: activeItems.length > 0 ? '#FFFBF0' : c.white,
          borderRadius: 16,
          padding: '20px 24px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
          border: `1.5px solid ${activeItems.length > 0 ? c.warning200 : c.gray75}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: c.gray900 }}>
              미완료 항목
            </span>
            {activeItems.length > 0 && (
              <span
                style={{
                  background: c.warning500,
                  color: c.white,
                  borderRadius: 20,
                  padding: '2px 10px',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {activeItems.length}건
              </span>
            )}
          </div>
          {activeItems.length > 0 && (
            <button
              onClick={() =>
                setDoneIds(new Set(incompleteItems.map((i) => i.lesson_student_data_id)))
              }
              style={{
                fontSize: 12,
                color: c.gray500,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: 6,
              }}
            >
              모두 완료 처리
            </button>
          )}
        </div>

        {activeItems.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: c.success500 }}>
            <span style={{ fontSize: 18 }}>✓</span>
            <span style={{ fontSize: 14, fontWeight: 500 }}>
              모든 항목이 완료됐어요!
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {activeItems.map((item) => (
              <div
                key={item.lesson_student_data_id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: c.white,
                  borderRadius: 10,
                  padding: '12px 16px',
                  border: `1px solid ${c.warning200}`,
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: c.gray900 }}>
                    {item.item_name}
                  </div>
                  <div style={{ fontSize: 12, color: c.gray500, marginTop: 2 }}>
                    {item.lesson_date} · {item.class_name} · {item.template_name}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setDoneIds((prev) =>
                      new Set([...prev, item.lesson_student_data_id]),
                    )
                  }
                >
                  완료 처리
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─ 점수 추이 + 수업 이력 (2열) ─ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          alignItems: 'start',
        }}
      >
        {/* 점수 추이 차트 */}
        <section
          style={{
            background: c.white,
            borderRadius: 16,
            padding: '20px 24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: c.gray900,
              marginBottom: 14,
            }}
          >
            점수 추이
            {stats.avgScore !== null && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: c.gray500,
                  marginLeft: 8,
                }}
              >
                평균 {stats.avgScore}점
              </span>
            )}
          </div>
          {scoreHistory.length < 2 ? (
            <div
              style={{
                color: c.gray300,
                fontSize: 13,
                textAlign: 'center',
                padding: '36px 0',
              }}
            >
              점수 데이터가 충분하지 않아요
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke={c.gray75} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: c.gray500 }}
                  tickLine={false}
                />
                <YAxis
                  domain={[40, 100]}
                  tick={{ fontSize: 11, fill: c.gray500 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(v) => [`${v}점`, '점수']}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                {stats.avgScore !== null && (
                  <ReferenceLine
                    y={stats.avgScore}
                    stroke={c.primary300}
                    strokeDasharray="4 4"
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="score"
                  name="점수"
                  stroke={c.primary500}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: c.primary500, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </section>

        {/* 수업 이력 타임라인 */}
        <section
          style={{
            background: c.white,
            borderRadius: 16,
            padding: '20px 24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: c.gray900,
              marginBottom: 14,
            }}
          >
            수업 이력
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: c.gray500,
                marginLeft: 8,
              }}
            >
              {lessons.length}회
            </span>
          </div>
          {lessons.length === 0 ? (
            <div
              style={{
                color: c.gray300,
                fontSize: 13,
                textAlign: 'center',
                padding: '36px 0',
              }}
            >
              수업 데이터가 없어요
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                maxHeight: 240,
                overflowY: 'auto',
              }}
            >
              {lessons.map((lesson, i) => {
                const attColor =
                  lesson.attendance === '출석'
                    ? c.success500
                    : lesson.attendance === '지각'
                      ? c.warning500
                      : lesson.attendance === '결석'
                        ? c.error500
                        : c.gray300
                return (
                  <div
                    key={lesson.lessonId}
                    style={{
                      display: 'flex',
                      gap: 12,
                      paddingBottom: i < lessons.length - 1 ? 14 : 0,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: 14,
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: attColor,
                          marginTop: 5,
                          flexShrink: 0,
                        }}
                      />
                      {i < lessons.length - 1 && (
                        <div
                          style={{
                            flex: 1,
                            width: 1.5,
                            background: c.gray100,
                            marginTop: 3,
                          }}
                        />
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: c.gray900,
                            }}
                          >
                            {lesson.date}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              color: c.gray500,
                              marginLeft: 6,
                            }}
                          >
                            {lesson.className}
                          </span>
                          {lesson.status === 'DRAFT' && (
                            <span
                              style={{
                                fontSize: 10,
                                color: c.gray300,
                                marginLeft: 4,
                                border: `1px solid ${c.gray200}`,
                                borderRadius: 4,
                                padding: '1px 4px',
                              }}
                            >
                              미완료
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => router.push(`/lesson/${lesson.lessonId}`)}
                          style={{
                            fontSize: 10,
                            color: c.primary500,
                            background: c.primary50,
                            border: 'none',
                            borderRadius: 4,
                            padding: '2px 7px',
                            cursor: 'pointer',
                            flexShrink: 0,
                            marginLeft: 6,
                          }}
                        >
                          입력 →
                        </button>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: 8,
                          marginTop: 4,
                          fontSize: 11,
                        }}
                      >
                        <span style={{ color: attColor, fontWeight: 500 }}>
                          {lesson.attendance ?? '미입력'}
                        </span>
                        {lesson.score !== null && (
                          <span style={{ color: c.gray600 }}>{lesson.score}점</span>
                        )}
                        {lesson.homeworkDone !== null && (
                          <span
                            style={{
                              color: lesson.homeworkDone ? c.success500 : c.warning500,
                            }}
                          >
                            과제 {lesson.homeworkDone ? '✓' : '✗'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>

      {/* ─ 최근 알림톡 ─ */}
      <section
        style={{
          background: c.white,
          borderRadius: 16,
          padding: '20px 24px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: c.gray900,
            marginBottom: 14,
          }}
        >
          최근 알림톡 발송
        </div>
        {notifications.length === 0 ? (
          <p style={{ color: c.gray300, fontSize: 13 }}>발송 내역이 없어요.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  padding: '11px 14px',
                  background: c.gray50,
                  borderRadius: 10,
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: c.gray300, marginBottom: 3 }}>
                    {n.sentAt}
                  </div>
                  <div style={{ fontSize: 13, color: c.gray700 }}>{n.preview}</div>
                </div>
                {n.isExpired && (
                  <span
                    style={{
                      background: c.gray75,
                      color: c.gray500,
                      borderRadius: 6,
                      padding: '2px 8px',
                      fontSize: 11,
                      flexShrink: 0,
                      marginLeft: 10,
                    }}
                  >
                    만료
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
