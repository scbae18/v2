/**
 * 전체 관리 대시보드 — mock 기반 집계 (표시 전용)
 */

import {
  mockClasses,
  mockStudentDetails,
  mockLessonRecords,
  mockTemplates,
} from '@/mocks/_db'

export type PulseTone = 'ok' | 'warn' | 'risk' | 'neutral'

export interface TodayAction {
  id: string
  title: string
  sub: string
  href: string
  /** 강조 카드(Primary 계열) */
  emphasis: boolean
  badge?: string
}

export interface HealthMetric {
  id: string
  label: string
  value: string
  hint: string
  tone: PulseTone
}

export interface AttentionStudent {
  id: number
  name: string
  reasonLabel: string
  reasonTone: 'warn' | 'risk'
  classesLine: string
  completionPct: number
}

export interface ClassOverviewRow {
  classId: number
  className: string
  studentCount: number
  savedLessonCount: number
  avgScoreDisplay: string
  attendanceDisplay: string
  completionPct: number
  pulse: PulseTone
}

export interface WeeklyDatum {
  week: string
  inputCount: number
  attendanceRate: number
  avgScore: number
  hwRate: number
}

export interface ClassCompareDatum {
  name: string
  avgScore: number
  attendance: number
  completion: number
}

export interface DashboardModel {
  actions: TodayAction[]
  health: HealthMetric[]
  attention: AttentionStudent[]
  classes: ClassOverviewRow[]
  weekly: WeeklyDatum[]
  classCompare: ClassCompareDatum[]
  meta: {
    /** UI 기준일(목업) */
    referenceDateLabel: string
    draftLessonCount: number
    todayClassCount: number
    totalStudents: number
  }
}

function getItemIds(templateId: number) {
  const tpl = mockTemplates.find((t) => t.id === templateId)
  if (!tpl) return { attId: null as number | null, scoreId: null as number | null, hwId: null as number | null }
  return {
    attId: tpl.items.find((i) => i.item_type === 'ATTENDANCE')?.id ?? null,
    scoreId: tpl.items.find((i) => i.item_type === 'NUMBER')?.id ?? null,
    hwId: tpl.items.find((i) => i.item_type === 'COMPLETE')?.id ?? null,
  }
}

function aggregateLessons(
  lessons: typeof mockLessonRecords,
  studentIds?: number[],
) {
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
    attRate: attTotal > 0 ? Math.round((attPresent / attTotal) * 100) : null as number | null,
    avgScore: scoreCount > 0 ? Math.round(scoreTotal / scoreCount) : null as number | null,
    hwRate: hwTotal > 0 ? Math.round((hwDone / hwTotal) * 100) : null as number | null,
  }
}

function toneFromInputRate(pct: number): PulseTone {
  if (pct >= 80) return 'ok'
  if (pct >= 55) return 'warn'
  return 'risk'
}

function toneFromCompletionAvg(pct: number): PulseTone {
  if (pct >= 80) return 'ok'
  if (pct >= 60) return 'warn'
  return 'risk'
}

function toneFromIncompleteCount(count: number, total: number): PulseTone {
  if (count === 0) return 'ok'
  if (count <= Math.max(2, Math.floor(total * 0.15))) return 'warn'
  return 'risk'
}

function classPulse(
  avgScore: number | null,
  attRate: number | null,
  completion: number,
): PulseTone {
  const scoreOk = avgScore === null || avgScore >= 75
  const attOk = attRate === null || attRate >= 85
  const compOk = completion >= 70
  if (scoreOk && attOk && compOk) return 'ok'
  if (!compOk || (avgScore !== null && avgScore < 65) || (attRate !== null && attRate < 75))
    return 'risk'
  return 'warn'
}

const WEEK_RANGES = [
  { label: '3/9주', start: '2026-03-09', end: '2026-03-15' },
  { label: '3/16주', start: '2026-03-16', end: '2026-03-22' },
  { label: '3/23주', start: '2026-03-23', end: '2026-03-29' },
  { label: '3/30주', start: '2026-03-30', end: '2026-04-05' },
]

/** 목업 앱 기준 오늘(홈 등과 동일) */
const REFERENCE_DATE = new Date('2026-03-30')

export function buildDashboardModel(): DashboardModel {
  const activeClasses = mockClasses.filter((cls) => !cls.ended_at)
  const todayDow = REFERENCE_DATE.getDay()
  const todayClasses = mockClasses.filter(
    (cls) =>
      !cls.ended_at && cls.schedules.some((s) => s.day_of_week === todayDow),
  )

  const draftLessons = mockLessonRecords.filter((l) => l.status === 'DRAFT')
  const savedCount = mockLessonRecords.filter((l) => l.status === 'SAVED').length
  const totalLessons = mockLessonRecords.length
  const inputRate = totalLessons > 0 ? Math.round((savedCount / totalLessons) * 100) : 0

  const totalStudents = mockStudentDetails.length
  const incompleteStudents = mockStudentDetails.filter(
    (s) => s.stats.total_incomplete_items > 0,
  )
  const avgCompletion = Math.round(
    (mockStudentDetails.reduce((a, s) => a + s.stats.completion_rate, 0) / totalStudents) * 100,
  )

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

  const weekly: WeeklyDatum[] = WEEK_RANGES.map(({ label, start, end }) => {
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

  const classCompare: ClassCompareDatum[] = classStats.map((cs) => ({
    name: cs.className.replace('반', '').trim() || cs.className,
    avgScore: cs.avgScore ?? 0,
    attendance: cs.attRate ?? 0,
    completion: cs.completionRate,
  }))

  const classes: ClassOverviewRow[] = classStats.map((cs) => ({
    classId: cs.classId,
    className: cs.className,
    studentCount: cs.studentCount,
    savedLessonCount: cs.lessonCount,
    avgScoreDisplay: cs.avgScore !== null ? `${cs.avgScore}점` : '—',
    attendanceDisplay: cs.attRate !== null ? `${cs.attRate}%` : '—',
    completionPct: cs.completionRate,
    pulse: classPulse(cs.avgScore, cs.attRate, cs.completionRate),
  }))

  const attentionSource = [...mockStudentDetails]
    .filter(
      (s) =>
        s.stats.total_incomplete_items > 0 || s.stats.completion_rate < 0.75,
    )
    .sort((a, b) => {
      const diff = b.stats.total_incomplete_items - a.stats.total_incomplete_items
      if (diff !== 0) return diff
      return a.stats.completion_rate - b.stats.completion_rate
    })

  const attention: AttentionStudent[] = attentionSource.map((s) => {
    const isHigh = s.stats.total_incomplete_items >= 3
    return {
      id: s.id,
      name: s.name,
      reasonLabel:
        s.stats.total_incomplete_items >= 3
          ? `미완료 ${s.stats.total_incomplete_items}건`
          : s.stats.completion_rate < 0.6
            ? '완료율 낮음'
            : `미완료 ${s.stats.total_incomplete_items}건`,
      reasonTone: isHigh ? 'risk' : 'warn',
      classesLine: s.classes.map((c) => c.name).join(' · '),
      completionPct: Math.round(s.stats.completion_rate * 100),
    }
  })

  const actions: TodayAction[] = []

  if (draftLessons.length > 0) {
    actions.push({
      id: 'draft',
      title: '저장하지 않은 수업이 있어요',
      sub: '임시 저장된 수업을 마저 입력하거나 저장해 주세요.',
      href: '/lesson',
      emphasis: true,
      badge: `${draftLessons.length}건`,
    })
  }

  if (todayClasses.length > 0) {
    actions.push({
      id: 'today',
      title: '오늘 수업이 있는 날이에요',
      sub: todayClasses.map((c) => c.name).join(', '),
      href: '/lesson',
      emphasis: draftLessons.length === 0,
      badge: `${todayClasses.length}반`,
    })
  }

  if (incompleteStudents.length > 0) {
    actions.push({
      id: 'attention',
      title: '챙길 학생이 있어요',
      sub: '미완료 항목이 있거나 완료율이 낮은 학생을 확인해 보세요.',
      href: '/stats#attention',
      emphasis: false,
      badge: `${incompleteStudents.length}명`,
    })
  }

  if (actions.length === 0) {
    actions.push({
      id: 'all-clear',
      title: '당장 처리할 작업은 없어요',
      sub: '수업 입력·학생 관리 메뉴에서 평소처럼 운영하시면 됩니다.',
      href: '/home',
      emphasis: false,
    })
  }

  const health: HealthMetric[] = [
    {
      id: 'input',
      label: '수업 기록',
      value: `${inputRate}%`,
      hint: `저장 완료 ${savedCount} / 전체 ${totalLessons}건`,
      tone: toneFromInputRate(inputRate),
    },
    {
      id: 'homework',
      label: '과제 완료(평균)',
      value: `${avgCompletion}%`,
      hint: '등록된 전체 학생 기준',
      tone: toneFromCompletionAvg(avgCompletion),
    },
    {
      id: 'students',
      label: '챙길 학생',
      value: `${incompleteStudents.length}명`,
      hint: `미완료 항목 보유 · 전체 ${totalStudents}명 중`,
      tone: toneFromIncompleteCount(incompleteStudents.length, totalStudents),
    },
    {
      id: 'classes',
      label: '진행 중인 반',
      value: `${activeClasses.length}개`,
      hint: '종료 처리되지 않은 반',
      tone: 'neutral',
    },
  ]

  const ref = REFERENCE_DATE
  const refLabel = `${ref.getFullYear()}년 ${ref.getMonth() + 1}월 ${ref.getDate()}일 기준`

  return {
    actions,
    health,
    attention,
    classes,
    weekly,
    classCompare,
    meta: {
      referenceDateLabel: refLabel,
      draftLessonCount: draftLessons.length,
      todayClassCount: todayClasses.length,
      totalStudents,
    },
  }
}
