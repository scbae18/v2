'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  mockClasses,
  mockStudentDetails,
  mockLessonRecords,
  mockTemplates,
} from '@/mocks/_db'
import { colors } from '@/styles/tokens/colors'
import Text from '@/components/common/Text'

const c = colors

// ─── 데이터 계산 헬퍼 ────────────────────────────────────────────────────────
function getItemIds(templateId: number) {
  const tpl = mockTemplates.find((t) => t.id === templateId)
  if (!tpl) return { attId: null, scoreId: null, hwId: null }
  return {
    attId: tpl.items.find((i) => i.item_type === 'ATTENDANCE')?.id ?? null,
    scoreId: tpl.items.find((i) => i.item_type === 'NUMBER')?.id ?? null,
    hwId: tpl.items.find((i) => i.item_type === 'COMPLETE')?.id ?? null,
  }
}

function aggregateLessons(lessons: typeof mockLessonRecords, studentIds?: number[]) {
  let attTotal = 0,
    attPresent = 0,
    scoreTotal = 0,
    scoreCount = 0,
    hwTotal = 0,
    hwDone = 0

  lessons.forEach((lesson) => {
    const { attId, scoreId, hwId } = getItemIds(lesson.template_id)
    lesson.student_data.forEach((sd) => {
      if (studentIds && !studentIds.includes(sd.student_id)) return

      if (attId !== null) {
        const v = sd.items.find((i) => i.template_item_id === attId)?.value
        if (v) {
          attTotal++
          if (v === '출석' || v === '지각') attPresent++
        }
      }
      if (scoreId !== null) {
        const v = sd.items.find((i) => i.template_item_id === scoreId)?.value
        if (v) {
          const n = Number(v)
          if (n > 0) {
            scoreTotal += n
            scoreCount++
          }
        }
      }
      if (hwId !== null) {
        const item = sd.items.find((i) => i.template_item_id === hwId)
        if (item) {
          hwTotal++
          if (item.is_completed) hwDone++
        }
      }
    })
  })

  return {
    attRate: attTotal > 0 ? Math.round((attPresent / attTotal) * 100) : null,
    avgScore: scoreCount > 0 ? Math.round(scoreTotal / scoreCount) : null,
    hwRate: hwTotal > 0 ? Math.round((hwDone / hwTotal) * 100) : null,
    attTotal,
    scoreCount,
  }
}

// ─── 전처리 (컴포넌트 외부에서 1회만 계산) ─────────────────────────────────
const activeClasses = mockClasses.filter((cls) => !cls.ended_at)

const classStats = activeClasses.map((cls) => {
  const savedLessons = mockLessonRecords.filter(
    (l) => l.class_id === cls.id && l.status === 'SAVED',
  )
  const studentIds = cls.students.map((s) => s.id)
  const agg = aggregateLessons(savedLessons, studentIds)
  const classStudentDetails = mockStudentDetails.filter((s) =>
    studentIds.includes(s.id),
  )
  const avgCompletionRate =
    classStudentDetails.length > 0
      ? Math.round(
          (classStudentDetails.reduce((acc, s) => acc + s.stats.completion_rate, 0) /
            classStudentDetails.length) *
            100,
        )
      : 0

  return {
    classId: cls.id,
    className: cls.name,
    studentCount: cls.student_count,
    lessonCount: savedLessons.length,
    ...agg,
    completionRate: avgCompletionRate,
  }
})

// 주간 데이터 (실제 레코드 기반)
const WEEK_RANGES = [
  { label: '3/9주', start: '2026-03-09', end: '2026-03-15' },
  { label: '3/16주', start: '2026-03-16', end: '2026-03-22' },
  { label: '3/23주', start: '2026-03-23', end: '2026-03-29' },
  { label: '3/30주', start: '2026-03-30', end: '2026-04-05' },
]

const weeklyData = WEEK_RANGES.map(({ label, start, end }) => {
  const lessons = mockLessonRecords.filter(
    (l) => l.lesson_date >= start && l.lesson_date <= end && l.status === 'SAVED',
  )
  const agg = aggregateLessons(lessons)
  return {
    week: label,
    inputCount: lessons.length,
    attendanceRate: agg.attRate ?? 0,
    avgScore: agg.avgScore ?? 0,
    hwRate: agg.hwRate ?? 0,
  }
})

// 반별 비교 (점수·출석·완료율)
const classCompare = classStats.map((cs) => ({
  name: cs.className.replace('반', ''),
  평균점수: cs.avgScore ?? 0,
  출석률: cs.attRate ?? 0,
  완료율: cs.completionRate,
}))

// ─── 서브 컴포넌트 ──────────────────────────────────────────────────────────
function SummaryCard({
  label,
  value,
  sub,
  valueColor = c.gray900,
}: {
  label: string
  value: string | number
  sub?: string
  valueColor?: string
}) {
  return (
    <div
      style={{
        flex: 1,
        background: c.white,
        borderRadius: 14,
        padding: '20px 22px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        minWidth: 110,
      }}
    >
      <div style={{ fontSize: 12, color: c.gray500, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: valueColor, lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: c.gray300, marginTop: 6, lineHeight: 1.4 }}>
          {sub}
        </div>
      )}
    </div>
  )
}

function ClassCard({
  cs,
  onClick,
}: {
  cs: (typeof classStats)[number]
  onClick: () => void
}) {
  const scoreColor =
    cs.avgScore === null ? c.gray300 : cs.avgScore >= 80 ? c.success500 : c.warning500
  const attColor =
    cs.attRate === null ? c.gray300 : cs.attRate >= 90 ? c.success500 : c.warning500
  const rateColor =
    cs.completionRate >= 80
      ? c.success500
      : cs.completionRate >= 60
        ? c.warning500
        : c.error500

  return (
    <button
      onClick={onClick}
      style={{
        background: c.white,
        borderRadius: 14,
        padding: '18px 20px',
        border: `1px solid ${c.gray75}`,
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.borderColor = c.primary200)
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.borderColor = c.gray75)
      }
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: c.gray900 }}>
            {cs.className}
          </div>
          <div style={{ fontSize: 12, color: c.gray500, marginTop: 3 }}>
            {cs.studentCount}명 · 수업 {cs.lessonCount}회 입력
          </div>
        </div>
        <span style={{ fontSize: 11, color: c.primary500, paddingTop: 2 }}>보기 →</span>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        {[
          {
            label: '평균 점수',
            value: cs.avgScore !== null ? `${cs.avgScore}점` : '-',
            color: scoreColor,
          },
          {
            label: '출석률',
            value: cs.attRate !== null ? `${cs.attRate}%` : '-',
            color: attColor,
          },
          { label: '완료율', value: `${cs.completionRate}%`, color: rateColor },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              flex: 1,
              background: c.gray50,
              borderRadius: 8,
              padding: '8px 0',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 10, color: c.gray300, marginBottom: 4 }}>
              {label}
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>
    </button>
  )
}

type ChartTab = 'score' | 'attendance' | 'homework' | 'input'

// ─── 메인 페이지 ─────────────────────────────────────────────────────────────
export default function StatsPage() {
  const router = useRouter()
  const [chartTab, setChartTab] = useState<ChartTab>('score')

  // 오늘 수업 (요일 기반)
  const todayDow = new Date('2026-03-30').getDay() // 1 = Mon (mock 날짜 기준)
  const todayClasses = mockClasses.filter(
    (cls) =>
      !cls.ended_at && cls.schedules.some((s) => s.day_of_week === todayDow),
  )

  // 요약 지표
  const totalStudents = mockStudentDetails.length
  const incompleteStudents = mockStudentDetails.filter(
    (s) => s.stats.total_incomplete_items > 0,
  )
  const avgCompletion = Math.round(
    (mockStudentDetails.reduce((a, s) => a + s.stats.completion_rate, 0) /
      totalStudents) *
      100,
  )
  const savedCount = mockLessonRecords.filter((l) => l.status === 'SAVED').length
  const totalCount = mockLessonRecords.length
  const overallInputRate = Math.round((savedCount / totalCount) * 100)

  // 집중 관리 학생 (미완료 많은 순)
  const attentionStudents = useMemo(
    () =>
      [...mockStudentDetails]
        .filter(
          (s) =>
            s.stats.total_incomplete_items > 0 || s.stats.completion_rate < 0.75,
        )
        .sort((a, b) => {
          const diff =
            b.stats.total_incomplete_items - a.stats.total_incomplete_items
          if (diff !== 0) return diff
          return a.stats.completion_rate - b.stats.completion_rate
        }),
    [],
  )

  const chartConfig: Record<
    ChartTab,
    { key: string; label: string; color: string }
  > = {
    score: { key: 'avgScore', label: '평균 점수', color: c.primary500 },
    attendance: { key: 'attendanceRate', label: '출석률 (%)', color: c.success500 },
    homework: { key: 'hwRate', label: '과제 완료율 (%)', color: c.warning500 },
    input: { key: 'inputCount', label: '입력 수업 수', color: c.gray600 },
  }

  const cc = chartConfig[chartTab]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* ─ 타이틀 ─ */}
      <div>
        <Text variant="display" as="h1">
          전체 현황
        </Text>
        <p style={{ color: c.gray500, fontSize: 14, marginTop: 4 }}>
          모든 반·학생의 수업 현황을 한눈에 파악하세요
        </p>
      </div>

      {/* ─ 요약 카드 4개 ─ */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <SummaryCard
          label="오늘 수업"
          value={`${todayClasses.length}반`}
          sub={
            todayClasses.length > 0
              ? todayClasses.map((cls) => cls.name).join(', ')
              : '오늘 수업 없음'
          }
          valueColor={todayClasses.length > 0 ? c.primary500 : c.gray500}
        />
        <SummaryCard
          label="미완료 학생"
          value={`${incompleteStudents.length}명`}
          sub={`전체 ${totalStudents}명 중`}
          valueColor={
            incompleteStudents.length > 4
              ? c.error500
              : incompleteStudents.length > 0
                ? c.warning500
                : c.success500
          }
        />
        <SummaryCard
          label="전체 입력률"
          value={`${overallInputRate}%`}
          sub={`${savedCount}/${totalCount} 수업 입력 완료`}
          valueColor={overallInputRate >= 80 ? c.success500 : c.warning500}
        />
        <SummaryCard
          label="전체 완료율 평균"
          value={`${avgCompletion}%`}
          sub="학생 과제 완료 기준"
          valueColor={avgCompletion >= 80 ? c.success500 : c.warning500}
        />
      </div>

      {/* ─ 2열: 집중 관리 학생 + 반별 현황 ─ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          gap: 16,
          alignItems: 'start',
        }}
      >
        {/* 집중 관리 학생 */}
        <section
          style={{
            background: c.white,
            borderRadius: 16,
            padding: '20px 22px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 700, color: c.gray900 }}>
              집중 관리 학생
            </span>
            <span style={{ fontSize: 12, color: c.gray300 }}>
              {attentionStudents.length}명
            </span>
          </div>

          {attentionStudents.length === 0 ? (
            <div
              style={{
                color: c.success500,
                fontSize: 13,
                padding: '24px 0',
                textAlign: 'center',
              }}
            >
              ✓ 모든 학생이 양호해요!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {attentionStudents.map((student) => {
                const isHigh = student.stats.total_incomplete_items >= 3
                const chipColor = isHigh ? c.error500 : c.warning500
                const chipBg = isHigh ? c.error50 : c.warning50
                const reason =
                  student.stats.total_incomplete_items >= 3
                    ? `미완료 ${student.stats.total_incomplete_items}건`
                    : student.stats.completion_rate < 0.6
                      ? '완료율 낮음'
                      : `미완료 ${student.stats.total_incomplete_items}건`

                return (
                  <button
                    key={student.id}
                    onClick={() => router.push(`/students/${student.id}`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '11px 13px',
                      background: c.gray50,
                      borderRadius: 10,
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 7,
                          flexWrap: 'wrap',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: c.gray900,
                          }}
                        >
                          {student.name}
                        </span>
                        <span
                          style={{
                            background: chipBg,
                            color: chipColor,
                            borderRadius: 6,
                            padding: '2px 7px',
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {reason}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: c.gray500,
                          marginTop: 3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {student.classes.map((cls) => cls.name).join(' · ')}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 10 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color:
                            student.stats.completion_rate >= 0.8
                              ? c.success500
                              : c.warning500,
                        }}
                      >
                        {Math.round(student.stats.completion_rate * 100)}%
                      </div>
                      <div style={{ fontSize: 10, color: c.gray300 }}>완료율</div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </section>

        {/* 반별 현황 */}
        <section>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: c.gray900,
              marginBottom: 12,
            }}
          >
            반별 현황
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {classStats.map((cs) => (
              <ClassCard
                key={cs.classId}
                cs={cs}
                onClick={() => router.push(`/management/${cs.classId}`)}
              />
            ))}
          </div>
        </section>
      </div>

      {/* ─ 주간 추이 차트 ─ */}
      <section
        style={{
          background: c.white,
          borderRadius: 16,
          padding: '20px 24px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: c.gray900 }}>
            주간 추이
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {(
              [
                ['score', '평균 점수'],
                ['attendance', '출석률'],
                ['homework', '과제 완료율'],
                ['input', '입력 수'],
              ] as [ChartTab, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setChartTab(key)}
                style={{
                  padding: '5px 11px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: chartTab === key ? c.primary500 : c.gray50,
                  color: chartTab === key ? c.white : c.gray600,
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyData} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.gray75} />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12, fill: c.gray500 }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: c.gray500 }}
              tickLine={false}
              axisLine={false}
              domain={
                chartTab === 'input'
                  ? [0, 8]
                  : chartTab === 'score'
                    ? [50, 100]
                    : [0, 100]
              }
            />
            <Tooltip
              formatter={(v) =>
                chartTab === 'input'
                  ? [`${v}회`, '수업 수']
                  : chartTab === 'score'
                    ? [`${v}점`, '평균 점수']
                    : [`${v}%`, cc.label]
              }
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Bar
              dataKey={cc.key}
              name={cc.label}
              fill={cc.color}
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* ─ 반별 비교 ─ */}
      <section
        style={{
          background: c.white,
          borderRadius: 16,
          padding: '20px 24px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: c.gray900,
            marginBottom: 16,
          }}
        >
          반별 비교
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={classCompare} barGap={4} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke={c.gray75} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: c.gray500 }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: c.gray500 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(v, name) => [
                name === '평균점수' ? `${v}점` : `${v}%`,
                name,
              ]}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar
              dataKey="\ud3c9\uade0\uc810\uc218"
              fill={c.primary500}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="\ucd9c\uc11d\ub960"
              fill={c.success500}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="\uc644\ub8cc\uc728"
              fill={c.warning500}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* ─ 주간 점수 추이 라인차트 ─ */}
      <section
        style={{
          background: c.white,
          borderRadius: 16,
          padding: '20px 24px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: c.gray900,
            marginBottom: 16,
          }}
        >
          지표 복합 추이
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.gray75} />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12, fill: c.gray500 }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: c.gray500 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="attendanceRate"
              name="\ucd9c\uc11d\ub960 (%)"
              stroke={c.success500}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="avgScore"
              name="\ud3c9\uade0 \uc810\uc218"
              stroke={c.primary500}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="hwRate"
              name="\uacfc\uc81c \uc644\ub8cc\uc728 (%)"
              stroke={c.warning500}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </div>
  )
}
