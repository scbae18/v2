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
import Toggle from '@/components/common/Toggle'

const c = colors

// ── 타입 ────────────────────────────────────────────────────────────────────

type LessonEntry = {
  lessonId: number
  date: string
  className: string
  templateName: string
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
    templateName: mockTemplates.find((t) => t.id === lesson.template_id)?.name ?? '-',
    status: lesson.status,
    attendance,
    scores,
    completeCount,
    incompleteCount,
  }
}

// ── 서브 컴포넌트 ────────────────────────────────────────────────────────────

function SectionCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: c.white,
      border: `1px solid ${c.gray50}`,
      borderRadius: 20,
      padding: '24px 28px',
      ...style,
    }}>
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 20,
      fontWeight: 600,
      color: c.gray900,
      letterSpacing: '-0.6px',
      lineHeight: 1.4,
      margin: 0,
      marginBottom: 20,
    }}>
      {children}
    </p>
  )
}

function AttChip({ status }: { status: '출석' | '지각' | '결석' | null }) {
  if (!status) return <span style={{ fontSize: 12, color: c.gray300 }}>미입력</span>
  const map = {
    출석: { color: c.success500, bg: c.success50 },
    지각: { color: c.warning500, bg: c.warning50 },
    결석: { color: c.error500, bg: c.error50 },
  }
  const { color, bg } = map[status]
  return (
    <span style={{
      background: bg, color,
      borderRadius: 6, padding: '2px 8px',
      fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  )
}

// ── 좌측: 프로필 ─────────────────────────────────────────────────────────────

function ProfileSection({ student, incompleteCount }: {
  student: (typeof mockStudentDetails)[number]
  incompleteCount: number
}) {
  return (
    <SectionCard>
      {/* 아바타 + 이름 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: `linear-gradient(135deg, ${c.primary400}, ${c.primary600})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: c.white }}>{student.name[0]}</span>
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: c.gray900, letterSpacing: '-0.66px' }}>
            {student.name}
          </div>
          <div style={{ fontSize: 13, color: c.gray500, marginTop: 2 }}>
            {student.school_name ?? '-'}
          </div>
        </div>
      </div>

      {/* 완료율 배지 */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {incompleteCount > 0 ? (
          <span style={{
            background: c.warning50, color: c.warning500,
            borderRadius: 8, padding: '4px 10px',
            fontSize: 12, fontWeight: 600,
          }}>
            ⚠ 미완료 {incompleteCount}건
          </span>
        ) : (
          <span style={{
            background: c.success50, color: c.success500,
            borderRadius: 8, padding: '4px 10px',
            fontSize: 12, fontWeight: 600,
          }}>
            ✓ 모두 완료
          </span>
        )}
        <span style={{
          background: c.primary50, color: c.primary500,
          borderRadius: 8, padding: '4px 10px',
          fontSize: 12, fontWeight: 600,
        }}>
          완료율 {Math.round(student.stats.completion_rate * 100)}%
        </span>
      </div>

      {/* 기본 정보 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { label: '소속 반', value: student.classes.map((c) => c.name).join(', ') || '-' },
          { label: '학생 연락처', value: student.phone },
          { label: '학부모 연락처', value: student.parent_phone },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
            <span style={{ fontSize: 13, color: c.gray500, fontWeight: 500, minWidth: 90, flexShrink: 0 }}>
              {label}
            </span>
            <span style={{ fontSize: 13, color: c.gray700, fontWeight: 500 }}>{value}</span>
          </div>
        ))}
      </div>

      {/* 학부모 대시보드 링크 */}
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <a
          href={`/parent/${student.id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '10px', background: c.primary50, color: c.primary500,
            borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none',
            border: `1px solid ${c.primary200}`,
          }}
        >
          학부모 대시보드 열기 →
        </a>
      </div>
    </SectionCard>
  )
}

// ── 좌측: 지표 카드 3개 ──────────────────────────────────────────────────────

function MetricCards({ stats }: {
  stats: { monthlyCompletion: number | null; recentScore: number | null; monthlyAttendance: number | null }
}) {
  const cards = [
    { label: '이번 달 완료율', value: stats.monthlyCompletion !== null ? `${Math.round(stats.monthlyCompletion * 100)}%` : '-', primary: true },
    { label: '최근 점수', value: stats.recentScore !== null ? `${stats.recentScore}점` : '-', primary: false },
    { label: '이번 달 출석률', value: stats.monthlyAttendance !== null ? `${Math.round(stats.monthlyAttendance * 100)}%` : '-', primary: false },
  ]
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {cards.map(({ label, value, primary }) => (
        <div
          key={label}
          style={{
            flex: 1,
            background: primary ? c.primary50 : c.gray50,
            borderRadius: 14,
            padding: '16px 14px',
            border: `1px solid ${primary ? c.primary100 : 'transparent'}`,
          }}
        >
          <div style={{ fontSize: 12, color: primary ? c.primary400 : c.gray500, fontWeight: 500, marginBottom: 6 }}>
            {label}
          </div>
          <div style={{
            fontSize: 22, fontWeight: 700, letterSpacing: '-0.66px',
            color: primary ? c.primary600 : c.gray900,
          }}>
            {value}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── 좌측: 미완료 항목 ────────────────────────────────────────────────────────

function IncompleteItemList({ items, onComplete, onCompleteAll }: {
  items: { lesson_student_data_id: number; item_name: string; lesson_date: string; class_name: string; template_name: string }[]
  onComplete: (id: number) => void
  onCompleteAll: () => void
}) {
  if (items.length === 0) {
    return (
      <SectionCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: c.success500 }}>
          <span style={{ fontSize: 22 }}>✓</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>모든 항목이 완료됐어요!</div>
            <div style={{ fontSize: 13, color: c.gray500, marginTop: 2 }}>계속 잘 따라오고 있어요.</div>
          </div>
        </div>
      </SectionCard>
    )
  }

  return (
    <SectionCard style={{ background: '#FFFBF0', border: `1px solid ${c.warning200}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: c.gray900 }}>미완료 항목</span>
          <span style={{
            background: c.warning500, color: c.white,
            borderRadius: 20, padding: '2px 9px',
            fontSize: 12, fontWeight: 700,
          }}>
            {items.length}건
          </span>
        </div>
        <button
          onClick={onCompleteAll}
          style={{
            fontSize: 12, color: c.gray500, background: 'none',
            border: 'none', cursor: 'pointer', padding: '4px 8px',
            borderRadius: 6,
          }}
        >
          모두 완료 처리
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item) => (
          <div
            key={item.lesson_student_data_id}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: c.white, borderRadius: 12, padding: '12px 14px',
              border: `1px solid ${c.warning200}`,
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: c.gray900 }}>{item.item_name}</div>
              <div style={{ fontSize: 12, color: c.gray500, marginTop: 3 }}>
                {item.lesson_date} · {item.class_name}
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onComplete(item.lesson_student_data_id)}
              style={{ flexShrink: 0 }}
            >
              완료 처리
            </Button>
          </div>
        ))}
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
type PeriodKey = typeof PERIOD_OPTIONS[number]['key']

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
      const cutoff = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString().slice(0, 10)
      return sorted.filter((l) => l.date >= cutoff)
    }
    if (period === '3month') {
      const cutoff = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()).toISOString().slice(0, 10)
      return sorted.filter((l) => l.date >= cutoff)
    }
    return sorted
  }, [savedLessons, period])

  // 점수 항목 이름 수집
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
      {/* 기간 선택 */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {PERIOD_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            style={{
              padding: '4px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: period === key ? c.primary100 : c.gray50,
              color: period === key ? c.primary500 : c.gray500,
              fontSize: 13, fontWeight: 600,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 차트 */}
      {chartData.length < 2 ? (
        <div style={{ color: c.gray300, fontSize: 14, textAlign: 'center', padding: '48px 0' }}>
          점수 데이터가 충분하지 않아요
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.gray75} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: c.gray500 }} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: c.gray500 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 10, border: `1px solid ${c.gray75}` }}
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
                dot={{ r: 4, strokeWidth: 0 }}
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

function LessonHistoryTab({ lessons, onGoLesson }: {
  lessons: LessonEntry[]
  onGoLesson: (id: number) => void
}) {
  const saved = useMemo(() => lessons.filter((l) => l.status === 'SAVED'), [lessons])

  if (saved.length === 0) {
    return <div style={{ color: c.gray300, fontSize: 14, textAlign: 'center', padding: '48px 0' }}>수업 데이터가 없어요</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 420, overflowY: 'auto' }}>
      {saved.map((lesson) => (
        <div
          key={lesson.lessonId}
          onClick={() => onGoLesson(lesson.lessonId)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderRadius: 12,
            background: c.gray50, cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = c.primary50)}
          onMouseLeave={(e) => (e.currentTarget.style.background = c.gray50)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: c.gray900 }}>{lesson.date}</span>
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
            <path d="M9 18L15 12L9 6" stroke={c.gray300} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
          type: '수업',
          message: `[${l.className}] 출결: ${l.attendance ?? '미입력'} / 점수: ${l.scores.map((s) => `${s.name} ${s.value}점`).join(', ') || '미입력'} / 완료 항목: ${l.completeCount}건`,
          status: '성공',
          expired: new Date(l.date) < new Date('2026-03-24'),
        })),
    [lessons],
  )

  if (notifications.length === 0) {
    return <div style={{ color: c.gray300, fontSize: 14, textAlign: 'center', padding: '48px 0' }}>발송 내역이 없어요</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 420, overflowY: 'auto' }}>
      {notifications.map((n) => {
        const isOpen = expanded.has(n.id)
        return (
          <div
            key={n.id}
            style={{
              background: c.gray50, borderRadius: 12, padding: '14px 16px',
              border: `1px solid ${c.gray75}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: c.gray500 }}>{n.sentAt}</span>
                  <span style={{
                    background: n.expired ? c.gray75 : c.success50,
                    color: n.expired ? c.gray500 : c.success500,
                    borderRadius: 6, padding: '1px 7px',
                    fontSize: 11, fontWeight: 600,
                  }}>
                    {n.expired ? '만료' : n.status}
                  </span>
                </div>
                {isOpen && (
                  <div style={{ fontSize: 13, color: c.gray700, lineHeight: 1.6, marginTop: 4 }}>
                    {n.message}
                  </div>
                )}
              </div>
              <button
                onClick={() => setExpanded((prev) => {
                  const next = new Set(prev)
                  isOpen ? next.delete(n.id) : next.add(n.id)
                  return next
                })}
                style={{
                  fontSize: 12, color: c.primary500, background: 'none',
                  border: 'none', cursor: 'pointer', flexShrink: 0, padding: '2px 6px',
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

function AiAnalysisSection({ studentName, stats }: {
  studentName: string
  stats: { monthlyCompletion: number | null; recentScore: number | null; monthlyAttendance: number | null }
}) {
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [generatedAt, setGeneratedAt] = useState<string | null>(null)
  const [useEmoji, setUseEmoji] = useState(true)

  const runAnalysis = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1800))
    const completionPct = stats.monthlyCompletion !== null ? Math.round(stats.monthlyCompletion * 100) : null
    const attendancePct = stats.monthlyAttendance !== null ? Math.round(stats.monthlyAttendance * 100) : null
    setAnalysis(
      `${studentName} 학생은 이번 달 출석률 ${attendancePct ?? '-'}%, 완료율 ${completionPct ?? '-'}%로 전반적으로 성실하게 참여하고 있어요${useEmoji ? ' 😊' : ''}. 최근 점수는 ${stats.recentScore !== null ? stats.recentScore + '점' : '미입력'}으로, 꾸준히 실력을 쌓아가는 중이에요. 남은 미완료 항목을 조기에 처리해 다음 수업 준비를 단단히 해두면 좋겠어요${useEmoji ? ' 💪' : '!'}`,
    )
    setGeneratedAt(new Date().toLocaleString('ko-KR'))
    setLoading(false)
  }

  return (
    <div style={{
      background: `linear-gradient(135deg, ${c.primary50}, #f0f4ff)`,
      border: `1px solid ${c.primary100}`,
      borderRadius: 16,
      padding: '20px 24px',
      marginTop: 16,
    }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.09 8.26L19 6L15.45 11L22 12L15.45 13L19 18L13.09 15.74L12 22L10.91 15.74L5 18L8.55 13L2 12L8.55 11L5 6L10.91 8.26L12 2Z" fill={c.primary500} />
          </svg>
          <span style={{ fontSize: 14, fontWeight: 600, color: c.primary600 }}>AI 분석</span>
          <span style={{ fontSize: 12, color: c.primary400 }}>· 자동 생성</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: c.gray500 }}>이모지</span>
          <Toggle checked={useEmoji} onChange={setUseEmoji} />
          {analysis && (
            <button
              onClick={runAnalysis}
              disabled={loading}
              style={{
                fontSize: 12, color: c.primary500, background: c.white,
                border: `1px solid ${c.primary200}`, borderRadius: 8,
                padding: '4px 10px', cursor: 'pointer',
              }}
            >
              다시 분석하기
            </button>
          )}
        </div>
      </div>

      {/* 내용 */}
      {!analysis && !loading && (
        <button
          onClick={runAnalysis}
          style={{
            width: '100%', padding: '12px', borderRadius: 12,
            border: 'none', cursor: 'pointer',
            background: c.primary500, color: c.white,
            fontSize: 14, fontWeight: 600, letterSpacing: '-0.42px',
          }}
        >
          AI 분석 시작하기
        </button>
      )}

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: c.primary500, padding: '8px 0' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
            <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          <span style={{ fontSize: 14, fontWeight: 500 }}>AI가 분석하고 있어요 ...</span>
        </div>
      )}

      {analysis && (
        <div>
          <p style={{ fontSize: 14, color: c.gray700, lineHeight: 1.7, margin: 0 }}>{analysis}</p>
          {generatedAt && (
            <p style={{ fontSize: 11, color: c.gray300, margin: '8px 0 0' }}>생성: {generatedAt}</p>
          )}
        </div>
      )}
    </div>
  )
}

// ── 메인 페이지 ──────────────────────────────────────────────────────────────

type RightTab = '점수 추이' | '수업 이력' | '알림톡'
const RIGHT_TABS: RightTab[] = ['점수 추이', '수업 이력', '알림톡']

const ENROLLED_AT: Record<number, string> = {
  1: '2026.01.05', 2: '2026.01.05', 3: '2026.01.10',
  4: '2026.01.15', 5: '2026.02.01', 6: '2026.01.05',
  7: '2026.01.15', 8: '2026.02.01', 9: '2026.02.10',
  10: '2026.01.20',
}

export default function StudentDashboardPage({ params }: { params: Promise<{ id: string }> }) {
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

  // 이번 달 통계 계산
  const monthlyStats = useMemo(() => {
    const now = new Date()
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
    const thisMonth = lessons.filter((l) => l.status === 'SAVED' && l.date >= monthStart)

    const withAtt = thisMonth.filter((l) => l.attendance !== null)
    const attended = withAtt.filter((l) => l.attendance === '출석' || l.attendance === '지각')
    const monthlyAttendance = withAtt.length > 0 ? attended.length / withAtt.length : null

    const allScores = thisMonth.flatMap((l) => l.scores)
    const recentScore = lessons.find((l) => l.status === 'SAVED' && l.scores.length > 0)?.scores[0]?.value ?? null

    const totalHw = thisMonth.reduce((s, l) => s + l.completeCount + l.incompleteCount, 0)
    const doneHw = thisMonth.reduce((s, l) => s + l.completeCount, 0)
    const monthlyCompletion = totalHw > 0 ? doneHw / totalHw : null

    return { monthlyCompletion, recentScore, monthlyAttendance, allScores }
  }, [lessons])

  // 미완료 항목
  const [doneIds, setDoneIds] = useState<Set<number>>(new Set())
  const allIncomplete = student?.incomplete_items ?? []
  const activeItems = allIncomplete.filter((item) => !doneIds.has(item.lesson_student_data_id))

  const [activeTab, setActiveTab] = useState<RightTab>('점수 추이')

  if (!student) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: c.gray500 }}>
        <p style={{ fontSize: 18, fontWeight: 600, color: c.gray700 }}>학생 정보를 찾을 수 없어요</p>
        <Button variant="ghost" size="sm" onClick={() => router.back()} style={{ marginTop: 16 }}>
          뒤로가기
        </Button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* ── 헤더 ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 6,
            color: c.gray500, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 8,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 style={{
          fontSize: 28, fontWeight: 700, color: c.gray900,
          letterSpacing: '-0.84px', lineHeight: 1.4, margin: 0,
        }}>
          {student.name}
        </h1>
        <span style={{ fontSize: 14, color: c.gray500, fontWeight: 400 }}>학생 대시보드</span>
      </div>

      {/* ── 2컬럼 레이아웃 ── */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* ── 좌측 패널 (35%) ── */}
        <div style={{ width: '35%', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ProfileSection student={student} incompleteCount={activeItems.length} />

          <MetricCards stats={monthlyStats} />

          <IncompleteItemList
            items={activeItems}
            onComplete={(id) => setDoneIds((prev) => new Set([...prev, id]))}
            onCompleteAll={() => setDoneIds(new Set(allIncomplete.map((i) => i.lesson_student_data_id)))}
          />
        </div>

        {/* ── 우측 패널 (65%) ── */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionCard>
            {/* 탭 헤더 */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: `1px solid ${c.gray75}` }}>
              {RIGHT_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '0 4px 14px',
                    marginRight: 28,
                    border: 'none', background: 'none', cursor: 'pointer',
                    fontSize: 16, fontWeight: 600,
                    color: activeTab === tab ? c.gray900 : c.gray500,
                    borderBottom: activeTab === tab ? `2px solid ${c.gray900}` : '2px solid transparent',
                    letterSpacing: '-0.48px', lineHeight: 1.4,
                    transition: 'color 0.15s, border-color 0.15s',
                    marginBottom: -1,
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* 탭 콘텐츠 */}
            {activeTab === '점수 추이' && <ScoreHistoryTab lessons={lessons} />}
            {activeTab === '수업 이력' && (
              <LessonHistoryTab lessons={lessons} onGoLesson={(id) => router.push(`/lesson/${id}`)} />
            )}
            {activeTab === '알림톡' && <AlimtalkTab lessons={lessons} />}

            {/* AI 분석 섹션 (탭과 무관하게 항상 표시) */}
            <AiAnalysisSection
              studentName={student.name}
              stats={monthlyStats}
            />
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
