/**
 * 홈 화면용 스냅샷 (목업 기준일과 mock DB 정합)
 */

import { mockClasses, mockLessonRecords, mockStudentDetails, type MockClassRecord } from '@/mocks/_db'

/** 앱 목업 기준 오늘 — 수업 캘린더·통계와 동일 */
export const HOME_REFERENCE_DATE = new Date('2026-03-30T12:00:00')

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const

/** 반 스케줄을 "월·수" 형태로 */
export function formatClassWeekdayPattern(schedules: { day_of_week: number }[]): string {
  const ordered = [...schedules].sort((a, b) => a.day_of_week - b.day_of_week)
  return ordered.map((s) => WEEKDAY_LABELS[s.day_of_week]).join('·')
}

/** 출결·홈 공통: 기준일 요일에 잡힌 진행 중 반만 */
export function getTodayActiveClasses(referenceDate: Date = HOME_REFERENCE_DATE): MockClassRecord[] {
  const dow = referenceDate.getDay()
  return mockClasses.filter((cls) => !cls.ended_at && cls.schedules.some((s) => s.day_of_week === dow))
}

function formatDateLabel(d: Date): string {
  const w = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${w})`
}

export interface TodayClassInfo {
  id: number
  name: string
  studentCount: number
  academyName: string
}

export interface AttentionPreview {
  id: number
  name: string
  reason: string
}

export interface HomeSnapshot {
  dateLabel: string
  weekdayLine: string
  todayClasses: TodayClassInfo[]
  draftLessonCount: number
  attentionTotal: number
  attentionPreview: AttentionPreview[]
}

export function buildHomeSnapshot(): HomeSnapshot {
  const d = HOME_REFERENCE_DATE
  const todayClasses: TodayClassInfo[] = getTodayActiveClasses(d).map((cls) => ({
    id: cls.id,
    name: cls.name,
    academyName: cls.academy_name,
    studentCount: mockStudentDetails.filter((s) => s.classes.some((c) => c.id === cls.id)).length,
  }))

  const draftLessonCount = mockLessonRecords.filter((l) => l.status === 'DRAFT').length

  const attentionPool = [...mockStudentDetails]
    .filter(
      (s) =>
        s.stats.total_incomplete_items > 0 || s.stats.completion_rate < 0.75,
    )
    .sort((a, b) => {
      const diff = b.stats.total_incomplete_items - a.stats.total_incomplete_items
      if (diff !== 0) return diff
      return a.stats.completion_rate - b.stats.completion_rate
    })

  const attentionPreview: AttentionPreview[] = attentionPool.slice(0, 4).map((s) => ({
    id: s.id,
    name: s.name,
    reason:
      s.stats.total_incomplete_items >= 3
        ? `미완료 ${s.stats.total_incomplete_items}건`
        : s.stats.completion_rate < 0.6
          ? '완료율 낮음'
          : `미완료 ${s.stats.total_incomplete_items}건`,
  }))

  return {
    dateLabel: formatDateLabel(d),
    weekdayLine: formatDateLabel(d),
    todayClasses,
    draftLessonCount,
    attentionTotal: attentionPool.length,
    attentionPreview,
  }
}
