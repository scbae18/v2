import {
  DEFAULT_MESSAGE_TEMPLATE,
  LESSON_MESSAGE_TEMPLATE,
  ATTENDANCE_MESSAGE_TEMPLATE,
  buildMessagePreview,
} from '@/mock/message.mock'
import { mockStudentDetails, mockLessonRecords, mockTemplates, mockClasses } from '@/mocks/_db'

export interface AlimtalkStudentRow {
  studentId: number
  studentName: string
  fullContent: string
  isExpired: boolean
}

export interface AlimtalkHistoryBatch {
  id: number
  sentAtIso: string
  sentAtLabel: string
  type: 'lesson' | 'attendance'
  className: string
  templateName: string | null
  recipientCount: number
  successCount: number
  failCount: number
  students: AlimtalkStudentRow[]
}

const INTRO = DEFAULT_MESSAGE_TEMPLATE.intro
const OUTRO = DEFAULT_MESSAGE_TEMPLATE.outro

function formatSentLabel(isoLike: string): string {
  const normalized = isoLike.includes('T') ? isoLike : isoLike.replace(' ', 'T')
  const d = new Date(normalized)
  if (Number.isNaN(d.getTime())) return isoLike
  const w = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
  const m = d.getMonth() + 1
  const day = d.getDate()
  let h = d.getHours()
  const isPm = h >= 12
  const h12 = h % 12 || 12
  const min = d.getMinutes().toString().padStart(2, '0')
  return `${m}월 ${day}일 (${w}) ${isPm ? '오후' : '오전'} ${h12}:${min}`
}

function buildLessonMsg(
  studentId: number,
  studentName: string,
  lesson: (typeof mockLessonRecords)[number],
): string {
  const tpl = mockTemplates.find((t) => t.id === lesson.template_id)
  const sd = lesson.student_data.find((s) => s.student_id === studentId)

  const attId = tpl?.items.find((i) => i.item_type === 'ATTENDANCE')?.id
  const scoreId = tpl?.items.find((i) => i.item_type === 'NUMBER')?.id
  const hwId = tpl?.items.find((i) => i.item_type === 'COMPLETE')?.id
  const topicItem = tpl?.items.find(
    (i) => i.item_type === 'TEXT' && i.is_common && i.sort_order <= 3,
  )
  const nextItem = tpl?.items.find(
    (i) => i.item_type === 'TEXT' && i.is_common && i.sort_order === 4,
  )
  const getVal = (id?: number) =>
    id !== undefined && sd ? sd.items.find((i) => i.template_item_id === id) : undefined

  const att = getVal(attId)?.value
  const scoreRaw = getVal(scoreId)?.value
  const hwItem = getVal(hwId)
  const topic = topicItem
    ? lesson.common_data.find((d) => d.template_item_id === topicItem.id)?.value
    : null
  const next = nextItem
    ? lesson.common_data.find((d) => d.template_item_id === nextItem.id)?.value
    : null

  return buildMessagePreview(LESSON_MESSAGE_TEMPLATE, {
    intro: INTRO.replaceAll('{studentName}', studentName),
    studentName,
    className: lesson.class_name,
    lessonDate: lesson.lesson_date,
    attendance: att ?? '미입력',
    testScore: scoreRaw ?? '미입력',
    lessonContent: topic ?? '-',
    nextRange: next ?? '-',
    homework: hwItem
      ? hwItem.is_completed
        ? '완료 ✓'
        : '미완료 ✗'
      : '미입력',
    dashboardLink: `http://localhost:3001/parent/${studentId}`,
    outro: OUTRO.replaceAll('{studentName}', studentName),
  })
}

function buildAttMsg(studentName: string, className: string): string {
  return buildMessagePreview(ATTENDANCE_MESSAGE_TEMPLATE, {
    intro: INTRO.replaceAll('{studentName}', studentName),
    className,
    attendanceLink: 'http://localhost:3001/check/lesson-1',
    endTime: '16:20',
    outro: OUTRO.replaceAll('{studentName}', studentName),
  })
}

/** 데모용: 피그마와 유사하게 일부 배치에만 실패 건수 부여 */
function pickFailCount(seedId: number, studentCount: number): number {
  if (seedId === 4) return Math.min(10, Math.max(1, studentCount))
  if (seedId === 6) return Math.min(2, studentCount)
  return 0
}

export const ALIMTALK_HISTORY_BATCHES: AlimtalkHistoryBatch[] = (() => {
  const result: AlimtalkHistoryBatch[] = []
  const cls1 = mockClasses.find((cls) => cls.id === 1)

  if (cls1) {
    const students: AlimtalkStudentRow[] = cls1.students.map((s) => ({
      studentId: s.id,
      studentName: s.name,
      fullContent: buildAttMsg(s.name, cls1.name),
      isExpired: true,
    }))
    const n = students.length
    const failCount = pickFailCount(100, n)
    result.push({
      id: 100,
      sentAtIso: '2026-04-01T22:30:00',
      sentAtLabel: formatSentLabel('2026-04-01T22:30:00'),
      type: 'attendance',
      className: cls1.name,
      templateName: null,
      recipientCount: n,
      successCount: Math.max(0, n - failCount),
      failCount,
      students,
    })
  }

  const sentHour: Record<number, string> = { 1: '16:30', 2: '17:00', 3: '17:30' }
  mockLessonRecords
    .filter((l) => l.status === 'SAVED')
    .sort((a, b) => b.lesson_date.localeCompare(a.lesson_date))
    .forEach((lesson) => {
      const students: AlimtalkStudentRow[] = lesson.student_data
        .map((sd) => {
          const info = mockStudentDetails.find((s) => s.id === sd.student_id)
          if (!info || sd.items.length === 0) return null
          return {
            studentId: sd.student_id,
            studentName: info.name,
            fullContent: buildLessonMsg(sd.student_id, info.name, lesson),
            isExpired: lesson.lesson_date < '2026-03-24',
          }
        })
        .filter((s): s is AlimtalkStudentRow => s !== null)

      if (students.length === 0) return

      const hour = sentHour[lesson.class_id] ?? '17:00'
      const sentAtIso = `${lesson.lesson_date}T${hour}:00`
      const failCount = pickFailCount(lesson.id, students.length)
      const sends = students.length * 2
      result.push({
        id: lesson.id,
        sentAtIso,
        sentAtLabel: formatSentLabel(sentAtIso),
        type: 'lesson',
        className: lesson.class_name,
        templateName: lesson.template_name,
        recipientCount: students.length,
        successCount: sends - failCount,
        failCount,
        students,
      })
    })

  return result.sort((a, b) => b.sentAtIso.localeCompare(a.sentAtIso))
})()

export type HistoryFilter = 'all' | 'complete' | 'failed' | 'lesson' | 'attendance'

export function filterHistory(
  rows: AlimtalkHistoryBatch[],
  f: HistoryFilter,
): AlimtalkHistoryBatch[] {
  if (f === 'all') return rows
  if (f === 'complete') return rows.filter((r) => r.failCount === 0)
  if (f === 'failed') return rows.filter((r) => r.failCount > 0)
  if (f === 'lesson') return rows.filter((r) => r.type === 'lesson')
  return rows.filter((r) => r.type === 'attendance')
}

export function historyChipCounts(rows: AlimtalkHistoryBatch[]) {
  return {
    all: rows.length,
    complete: rows.filter((r) => r.failCount === 0).length,
    failed: rows.filter((r) => r.failCount > 0).length,
    lesson: rows.filter((r) => r.type === 'lesson').length,
    attendance: rows.filter((r) => r.type === 'attendance').length,
  }
}
