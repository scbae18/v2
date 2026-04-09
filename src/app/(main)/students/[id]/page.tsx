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
  Legend,
} from 'recharts'
import { mockStudentDetails, mockLessonRecords, mockTemplates } from '@/mocks/_db'
import { colors } from '@/styles/tokens/colors'
import Button from '@/components/common/Button'

const c = colors

// ── 타입 ────────────────────────────────────────────────────────────────────

type LessonEntry = {
  lessonId: number
  date: string
  className: string
  status: 'DRAFT' | 'SAVED'
  attendance: '출석' | '지각' | '결석' | null
  scores: { name: string; value: number }[]
  completeCount: number
  incompleteCount: number
}

// ── 헬퍼 ────────────────────────────────────────────────────────────────────

function getTemplateItems(templateId: number) {
  const tpl = mockTemplates.find((t) => t.id === templateId)
  if (!tpl) return { attId: null, scoreItems: [], hwItems: [] }
  return {
    attId: tpl.items.find((i) => i.item_type === 'ATTENDANCE')?.id ?? null,
    scoreItems: tpl.items.filter((i) => i.item_type === 'NUMBER'),
    hwItems: tpl.items.filter((i) => i.item_type === 'COMPLETE'),
  }
}

function buildLessonEntry(
  lesson: (typeof mockLessonRecords)[number],
  studentId: number,
): LessonEntry | null {
  const { attId, scoreItems, hwItems } = getTemplateItems(lesson.template_id)
  const sd = lesson.student_data.find((s) => s.student_id === studentId)
  if (!sd || sd.items.length === 0) return null

  const getVal = (id: number | null) =>
    id !== null ? sd.items.find((i) => i.template_item_id === id) : undefined

  const attRaw = getVal(attId)?.value
  const attendance =
    attRaw === '출석' || attRaw === '지각' || attRaw === '결석'
      ? (attRaw as '출석' | '지각' | '결석')
      : null

  const scores = scoreItems
    .map((item) => {
      const v = getVal(item.id)?.value
      return v ? { name: item.name, value: Number(v) } : null
    })
    .filter((s): s is { name: string; value: number } => s !== null)

  const hwData = hwItems.map((item) => getVal(item.id))
  const completeCount = hwData.filter((d) => d?.is_completed === true).length
  const incompleteCount = hwData.filter((d) => d?.is_completed === false).length

  return {
    lessonId: lesson.id,
    date: lesson.lesson_date,
    className: lesson.class_name,
    status: lesson.status,
    attendance,
    scores,
    completeCount,
    incompleteCount,
  }
}

function getDaysAgo(dateStr: string): number {
  const target = new Date(dateStr)
  const today = new Date()
  return Math.floor((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))
}

// ── 공통 카드 ────────────────────────────────────────────────────────────────

function SectionCard({
  children,
  style,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div
      style={{
        background: c.white,
        border: `1px solid ${c.gray50}`,
        borderRadius: 20,
        padding: 27,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ── 출결 칩 ──────────────────────────────────────────────────────────────────

function AttChip({ status }: { status: '출석' | '지각' | '결석' | null }) {
  if (!status) return <span style={{ fontSize: 12, color: c.gray300 }}>미입력</span>
  const map = {
    출석: { color: c.success500, bg: c.success50 },
    지각: { color: c.warning500, bg: c.warning50 },
    결석: { color: c.error500, bg: c.error50 },
  }
  const { color, bg } = map[status]
  return (
    <span
      style={{
        background: bg,
        color,
        borderRadius: 6,
        padding: '2px 8px',
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  )
}

// ── 트렌드 아이콘 ─────────────────────────────────────────────────────────────

function TrendUp({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22 7L13.5 15.5L8.5 10.5L2 17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 7H22V13" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TrendDown({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22 17L13.5 8.5L8.5 13.5L2 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17H22V11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── 좌측: 프로필 ─────────────────────────────────────────────────────────────

function ProfileSection({
  student,
}: {
  student: (typeof mockStudentDetails)[number]
}) {
  const academyName = student.classes[0]?.academy_name ?? '-'
  const classNames = student.classes.map((cls) => cls.name).join(', ') || '-'

  const infoRows = [
    { label: '학원명', value: academyName },
    { label: '소속 반', value: classNames },
    { label: '학교명', value: student.school_name ?? '-' },
    { label: '학생 전화번호', value: student.phone },
    { label: '학부모 전화번호', value: student.parent_phone },
  ]

  return (
    <SectionCard>
      {/* 아바타 + 이름 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: c.gray100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" fill={c.gray300} />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill={c.gray300} />
          </svg>
        </div>
        <p
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: c.gray900,
            letterSpacing: '-0.72px',
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          {student.name}
        </p>
      </div>

      {/* 정보 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {infoRows.map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: c.gray500,
                letterSpacing: '-0.42px',
                minWidth: 110,
                flexShrink: 0,
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: c.gray900,
                letterSpacing: '-0.42px',
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

// ── 좌측: 지표 카드 3개 ──────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  unit,
  trendLabel,
  trendValue,
  trendUp,
}: {
  label: string
  value: number | null
  unit: string
  trendLabel: string
  trendValue: number | null
  trendUp: boolean
}) {
  const trendColor = trendUp ? c.primary400 : c.error500

  return (
    <div
      style={{
        flex: 1,
        background: c.gray50,
        borderRadius: 12,
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 라벨 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: c.gray500,
            letterSpacing: '-0.36px',
          }}
        >
          {label}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke={c.gray300} strokeWidth="2" />
          <path d="M12 8v4M12 16h.01" stroke={c.gray300} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* 값 */}
      <div style={{ marginBottom: 8 }}>
        <span
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: c.gray900,
            letterSpacing: '-0.72px',
            lineHeight: 1.4,
          }}
        >
          {value !== null ? value : '-'}
        </span>
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: c.gray900,
            letterSpacing: '-0.48px',
          }}
        >
          {unit}
        </span>
      </div>

      {/* 트렌드 */}
      {trendValue !== null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: trendColor,
              letterSpacing: '-0.36px',
            }}
          >
            {trendLabel}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {trendUp ? <TrendUp color={trendColor} /> : <TrendDown color={trendColor} />}
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: trendColor,
                letterSpacing: '-0.36px',
              }}
            >
              {trendValue}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCards({
  stats,
}: {
  stats: {
    monthlyCompletion: number | null
    recentScore: number | null
    monthlyAttendance: number | null
  }
}) {
  const completionPct =
    stats.monthlyCompletion !== null ? Math.round(stats.monthlyCompletion * 100) : null
  const attendancePct =
    stats.monthlyAttendance !== null ? Math.round(stats.monthlyAttendance * 100) : null

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <MetricCard
        label="이번 달 완료율"
        value={completionPct}
        unit="%"
        trendLabel="지난 달 대비"
        trendValue={completionPct !== null ? 7 : null}
        trendUp={true}
      />
      <MetricCard
        label="최근 점수"
        value={stats.recentScore}
        unit="점"
        trendLabel="반 평균 대비"
        trendValue={stats.recentScore !== null ? 7 : null}
        trendUp={true}
      />
      <MetricCard
        label="이번 달 출석률"
        value={attendancePct}
        unit="%"
        trendLabel="지난 달 대비"
        trendValue={attendancePct !== null ? 3 : null}
        trendUp={false}
      />
    </div>
  )
}

// ── 좌측: 미완료 항목 ────────────────────────────────────────────────────────

function IncompleteItemList({
  items,
  completedIds,
  onToggle,
}: {
  items: {
    lesson_student_data_id: number
    item_name: string
    lesson_date: string
    class_name: string
  }[]
  completedIds: Set<number>
  onToggle: (id: number) => void
}) {
  if (items.length === 0) return null

  const remainingCount = items.filter((i) => !completedIds.has(i.lesson_student_data_id)).length

  return (
    <SectionCard>
      {/* 헤더 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 16,
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: c.gray900,
            letterSpacing: '-0.48px',
          }}
        >
          미완료 항목
        </span>
        {remainingCount > 0 ? (
          <span
            style={{
              background: c.error500,
              color: c.white,
              borderRadius: 20,
              padding: '1px 8px',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {remainingCount}
          </span>
        ) : (
          <span
            style={{
              background: c.success50,
              color: c.success500,
              borderRadius: 20,
              padding: '1px 10px',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            모두 완료 ✓
          </span>
        )}
      </div>

      {/* 항목 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {items.map((item, idx) => {
          const done = completedIds.has(item.lesson_student_data_id)
          const daysAgo = getDaysAgo(item.lesson_date)
          return (
            <div
              key={item.lesson_student_data_id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '13px 20px',
                borderTop: idx > 0 ? `1px solid ${c.gray50}` : 'none',
                opacity: done ? 0.5 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {/* 왼쪽: 체크 버튼 + 항목명 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={() => onToggle(item.lesson_student_data_id)}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: `2px solid ${done ? c.success500 : c.gray100}`,
                    background: done ? c.success500 : c.white,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17L4 12"
                      stroke={done ? c.white : c.gray200}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: done ? c.gray300 : c.gray700,
                    letterSpacing: '-0.48px',
                    textDecoration: done ? 'line-through' : 'none',
                    transition: 'color 0.2s',
                  }}
                >
                  {item.item_name}
                </span>
              </div>

              {/* 오른쪽: 기간 배지 + 반 배지 */}
              {!done && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {daysAgo > 0 && (
                    <span
                      style={{
                        background: '#fee5e5',
                        color: c.error500,
                        borderRadius: 6,
                        padding: '4px 8px',
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: '-0.36px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {daysAgo}일 지남
                    </span>
                  )}
                  <span
                    style={{
                      background: c.primary100,
                      color: c.primary400,
                      borderRadius: 6,
                      padding: '4px 8px',
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '-0.36px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.class_name}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}

// ── 우측: 점수 추이 탭 ───────────────────────────────────────────────────────

const PERIOD_OPTIONS = [
  { key: 'recent5', label: '최근 5회' },
  { key: 'recent10', label: '최근 10회' },
  { key: '1month', label: '1개월' },
  { key: '3month', label: '3개월' },
  { key: 'all', label: '전체' },
] as const
type PeriodKey = (typeof PERIOD_OPTIONS)[number]['key']

const LINE_COLORS = [c.primary500, c.success500, c.warning500, c.error500]

function ScoreHistoryTab({ lessons }: { lessons: LessonEntry[] }) {
  const [period, setPeriod] = useState<PeriodKey>('recent5')

  const savedLessons = useMemo(
    () => lessons.filter((l) => l.status === 'SAVED').filter((l) => l.scores.length > 0),
    [lessons],
  )

  const filtered = useMemo(() => {
    const sorted = [...savedLessons].sort((a, b) => a.date.localeCompare(b.date))
    const now = new Date()
    if (period === 'recent5') return sorted.slice(-5)
    if (period === 'recent10') return sorted.slice(-10)
    if (period === '1month') {
      const cutoff = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        .toISOString()
        .slice(0, 10)
      return sorted.filter((l) => l.date >= cutoff)
    }
    if (period === '3month') {
      const cutoff = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
        .toISOString()
        .slice(0, 10)
      return sorted.filter((l) => l.date >= cutoff)
    }
    return sorted
  }, [savedLessons, period])

  const scoreItemNames = useMemo(() => {
    const names = new Set<string>()
    filtered.forEach((l) => l.scores.forEach((s) => names.add(s.name)))
    return [...names]
  }, [filtered])

  const chartData = useMemo(
    () =>
      filtered.map((l) => {
        const base: Record<string, string | number | null> = { date: l.date.slice(5) }
        scoreItemNames.forEach((name) => {
          base[name] = l.scores.find((s) => s.name === name)?.value ?? null
        })
        return base
      }),
    [filtered, scoreItemNames],
  )

  return (
    <div>
      {/* 기간 선택 칩 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {PERIOD_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              background: period === key ? c.gray50 : c.white,
              color: period === key ? c.gray700 : c.gray500,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: '-0.48px',
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 차트 */}
      {chartData.length < 2 ? (
        <div
          style={{
            color: c.gray300,
            fontSize: 14,
            textAlign: 'center',
            padding: '80px 0',
          }}
        >
          점수 데이터가 충분하지 않아요
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.gray75} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: c.gray500 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: c.gray500 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 10,
                border: `1px solid ${c.gray75}`,
              }}
              formatter={(v, name) => [v != null ? `${v}점` : '-', String(name)]}
            />
            {scoreItemNames.length > 1 && <Legend />}
            {scoreItemNames.map((name, i) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={LINE_COLORS[i % LINE_COLORS.length]}
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 0, fill: LINE_COLORS[i % LINE_COLORS.length] }}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

// ── 우측: 수업 이력 탭 ───────────────────────────────────────────────────────

function LessonHistoryTab({
  lessons,
  onGoLesson,
}: {
  lessons: LessonEntry[]
  onGoLesson: (id: number) => void
}) {
  const saved = useMemo(() => lessons.filter((l) => l.status === 'SAVED'), [lessons])

  if (saved.length === 0) {
    return (
      <div
        style={{
          color: c.gray300,
          fontSize: 14,
          textAlign: 'center',
          padding: '80px 0',
        }}
      >
        수업 데이터가 없어요
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxHeight: 420,
        overflowY: 'auto',
      }}
    >
      {saved.map((lesson) => (
        <div
          key={lesson.lessonId}
          onClick={() => onGoLesson(lesson.lessonId)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderRadius: 12,
            background: c.gray50,
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = c.primary50)}
          onMouseLeave={(e) => (e.currentTarget.style.background = c.gray50)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: c.gray900 }}>
                {lesson.date}
              </span>
              <span style={{ fontSize: 13, color: c.gray500 }}>{lesson.className}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AttChip status={lesson.attendance} />
              {lesson.scores.map((s) => (
                <span key={s.name} style={{ fontSize: 12, color: c.gray700 }}>
                  {s.name}: {s.value}점
                </span>
              ))}
              {(lesson.completeCount > 0 || lesson.incompleteCount > 0) && (
                <span style={{ fontSize: 12, color: c.gray500 }}>
                  완료 {lesson.completeCount} / 미완료 {lesson.incompleteCount}
                </span>
              )}
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18L15 12L9 6"
              stroke={c.gray300}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ))}
    </div>
  )
}

// ── 우측: 알림톡 탭 ─────────────────────────────────────────────────────────

function AlimtalkTab({ lessons }: { lessons: LessonEntry[] }) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  const notifications = useMemo(
    () =>
      lessons
        .filter((l) => l.status === 'SAVED')
        .slice(0, 10)
        .map((l, i) => ({
          id: i,
          sentAt: `${l.date} 수업 종료 후 발송`,
          message: `[${l.className}] 출결: ${l.attendance ?? '미입력'} / 점수: ${l.scores.map((s) => `${s.name} ${s.value}점`).join(', ') || '미입력'} / 완료 항목: ${l.completeCount}건`,
          expired: new Date(l.date) < new Date('2026-03-24'),
        })),
    [lessons],
  )

  if (notifications.length === 0) {
    return (
      <div
        style={{
          color: c.gray300,
          fontSize: 14,
          textAlign: 'center',
          padding: '80px 0',
        }}
      >
        발송 내역이 없어요
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxHeight: 420,
        overflowY: 'auto',
      }}
    >
      {notifications.map((n) => {
        const isOpen = expanded.has(n.id)
        return (
          <div
            key={n.id}
            style={{
              background: c.gray50,
              borderRadius: 12,
              padding: '14px 16px',
              border: `1px solid ${c.gray75}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 12, color: c.gray500 }}>{n.sentAt}</span>
                  <span
                    style={{
                      background: n.expired ? c.gray75 : c.success50,
                      color: n.expired ? c.gray500 : c.success500,
                      borderRadius: 6,
                      padding: '1px 7px',
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {n.expired ? '만료' : '성공'}
                  </span>
                </div>
                {isOpen && (
                  <div
                    style={{
                      fontSize: 13,
                      color: c.gray700,
                      lineHeight: 1.6,
                      marginTop: 4,
                    }}
                  >
                    {n.message}
                  </div>
                )}
              </div>
              <button
                onClick={() =>
                  setExpanded((prev) => {
                    const next = new Set(prev)
                    isOpen ? next.delete(n.id) : next.add(n.id)
                    return next
                  })
                }
                style={{
                  fontSize: 12,
                  color: c.primary500,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  flexShrink: 0,
                  padding: '2px 6px',
                }}
              >
                {isOpen ? '접기' : '펼치기'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── 우측: AI 분석 섹션 ───────────────────────────────────────────────────────

function AiAnalysisSection({
  studentName,
  stats,
}: {
  studentName: string
  stats: {
    monthlyCompletion: number | null
    recentScore: number | null
    monthlyAttendance: number | null
  }
}) {
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)

  const runAnalysis = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1800))
    const completionPct =
      stats.monthlyCompletion !== null ? Math.round(stats.monthlyCompletion * 100) : null
    const attendancePct =
      stats.monthlyAttendance !== null ? Math.round(stats.monthlyAttendance * 100) : null
    setAnalysis(
      `최근 3회 연속 상승 중이에요. 반 평균 대비 +6점으로 상위권을 유지하고 있으나, 이번 달 수업에서 일시적으로 하락한 패턴이 있어요. 해당 수업 내용을 점검해보는 것을 추천해요. 출석률 ${attendancePct ?? '-'}%, 완료율 ${completionPct ?? '-'}%로 ${studentName} 학생은 전반적으로 성실하게 참여하고 있어요.`,
    )
    setLoading(false)
  }

  return (
    <div
      style={{
        background: c.primary50,
        borderRadius: 12,
        padding: '20px 24px',
        marginTop: 16,
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          marginBottom: analysis ? 8 : 16,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L13.09 8.26L19 6L15.45 11L22 12L15.45 13L19 18L13.09 15.74L12 22L10.91 15.74L5 18L8.55 13L2 12L8.55 11L5 6L10.91 8.26L12 2Z"
            fill={c.primary500}
          />
        </svg>
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: c.primary500,
            letterSpacing: '-0.48px',
            lineHeight: 1.4,
          }}
        >
          AI 분석
        </span>
        {analysis && (
          <button
            onClick={runAnalysis}
            disabled={loading}
            style={{
              marginLeft: 'auto',
              fontSize: 12,
              color: c.primary400,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            다시 분석하기
          </button>
        )}
      </div>

      {/* 내용 */}
      {!analysis && !loading && (
        <button
          onClick={runAnalysis}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: 10,
            border: `1px solid ${c.primary200}`,
            cursor: 'pointer',
            background: 'transparent',
            color: c.primary500,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '-0.42px',
          }}
        >
          AI 분석 시작하기
        </button>
      )}

      {loading && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: c.primary400,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            style={{ animation: 'spin 1s linear infinite' }}
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          <span style={{ fontSize: 14, fontWeight: 500 }}>AI가 분석하고 있어요 ...</span>
        </div>
      )}

      {analysis && (
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: c.gray700,
            letterSpacing: '-0.42px',
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          {analysis}
        </p>
      )}
    </div>
  )
}

// ── 메인 페이지 ──────────────────────────────────────────────────────────────

type RightTab = '점수 추이' | '수업 이력' | '알림톡'
const RIGHT_TABS: RightTab[] = ['점수 추이', '수업 이력', '알림톡']

export default function StudentDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const studentId = Number(id)
  const router = useRouter()

  const student = mockStudentDetails.find((s) => s.id === studentId)

  const lessons = useMemo<LessonEntry[]>(() => {
    if (!student) return []
    const classIds = student.classes.map((cls) => cls.id)
    return mockLessonRecords
      .filter((l) => classIds.includes(l.class_id))
      .sort((a, b) => b.lesson_date.localeCompare(a.lesson_date))
      .map((l) => buildLessonEntry(l, studentId))
      .filter((l): l is LessonEntry => l !== null)
  }, [studentId, student])

  const monthlyStats = useMemo(() => {
    const now = new Date()
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
    const thisMonth = lessons.filter((l) => l.status === 'SAVED' && l.date >= monthStart)

    const withAtt = thisMonth.filter((l) => l.attendance !== null)
    const attended = withAtt.filter(
      (l) => l.attendance === '출석' || l.attendance === '지각',
    )
    const monthlyAttendance = withAtt.length > 0 ? attended.length / withAtt.length : null

    const recentScore =
      lessons.find((l) => l.status === 'SAVED' && l.scores.length > 0)?.scores[0]?.value ??
      null

    const totalHw = thisMonth.reduce((s, l) => s + l.completeCount + l.incompleteCount, 0)
    const doneHw = thisMonth.reduce((s, l) => s + l.completeCount, 0)
    const monthlyCompletion = totalHw > 0 ? doneHw / totalHw : null

    return { monthlyCompletion, recentScore, monthlyAttendance }
  }, [lessons])

  const incompleteItems = student?.incomplete_items ?? []
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set())
  const toggleCompleted = (id: number) =>
    setCompletedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const [activeTab, setActiveTab] = useState<RightTab>('점수 추이')

  if (!student) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: c.gray500 }}>
        <p style={{ fontSize: 18, fontWeight: 600, color: c.gray700 }}>
          학생 정보를 찾을 수 없어요
        </p>
        <Button variant="ghost" size="sm" onClick={() => router.back()} style={{ marginTop: 16 }}>
          뒤로가기
        </Button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* ── 헤더 ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 6,
            color: c.gray500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: c.gray900,
            letterSpacing: '-0.84px',
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          {student.name}
        </h1>
        <span style={{ fontSize: 14, color: c.gray500, fontWeight: 400 }}>학생 대시보드</span>

        {/* 학부모 대시보드 진입 버튼 */}
        <button
          onClick={() => router.push(`/parent/${student.id}`)}
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            borderRadius: 10,
            border: `1.5px solid ${c.primary200}`,
            background: c.primary50,
            color: c.primary500,
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '-0.42px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          학부모 대시보드
        </button>
      </div>

      {/* ── 2컬럼 레이아웃 ── */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* ── 좌측 패널 ── */}
        <div
          style={{
            width: 448,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <ProfileSection student={student} />
          <MetricCards stats={monthlyStats} />
          {incompleteItems.length > 0 && (
            <IncompleteItemList
              items={incompleteItems}
              completedIds={completedIds}
              onToggle={toggleCompleted}
            />
          )}
        </div>

        {/* ── 우측 패널 ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <SectionCard style={{ padding: 0, overflow: 'hidden' }}>
            {/* 탭 헤더 */}
            <div style={{ padding: '28px 28px 0', position: 'relative' }}>
              <div style={{ display: 'flex', gap: 0 }}>
                {RIGHT_TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '0 0 20px',
                      marginRight: 28,
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      fontSize: 20,
                      fontWeight: 600,
                      color: activeTab === tab ? c.gray900 : c.gray500,
                      letterSpacing: '-0.6px',
                      lineHeight: 1.4,
                      position: 'relative',
                    }}
                  >
                    {tab}
                    {activeTab === tab && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: -1,
                          left: 0,
                          right: 0,
                          height: 2,
                          background: c.gray900,
                          borderRadius: 1,
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
              {/* 전체 구분선 */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: c.gray75,
                }}
              />
            </div>

            {/* 탭 콘텐츠 */}
            <div style={{ padding: '24px 28px' }}>
              {activeTab === '점수 추이' && <ScoreHistoryTab lessons={lessons} />}
              {activeTab === '수업 이력' && (
                <LessonHistoryTab
                  lessons={lessons}
                  onGoLesson={(lessonId) => router.push(`/lesson/${lessonId}`)}
                />
              )}
              {activeTab === '알림톡' && <AlimtalkTab lessons={lessons} />}

              {/* AI 분석 섹션 */}
              <AiAnalysisSection studentName={student.name} stats={monthlyStats} />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
