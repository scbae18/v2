'use client'

import { useState, useMemo } from 'react'
import {
  DEFAULT_MESSAGE_TEMPLATE,
  LESSON_MESSAGE_TEMPLATE,
  ATTENDANCE_MESSAGE_TEMPLATE,
  buildMessagePreview,
} from '@/mock/message.mock'
import { mockStudentDetails, mockLessonRecords, mockTemplates, mockClasses } from '@/mocks/_db'
import { colors } from '@/styles/tokens/colors'
import Text from '@/components/common/Text'

const c = colors

// ??? types ??????????????????????????????????????????????????????????????????
interface MsgStudent {
  studentId: number
  studentName: string
  fullContent: string
  isExpired: boolean
}

interface MsgBatch {
  id: number
  sentAt: string
  type: 'lesson' | 'attendance'
  className: string
  lessonDate: string
  students: MsgStudent[]
}

// ??? message builders ????????????????????????????????????????????????????????
const INTRO = DEFAULT_MESSAGE_TEMPLATE.intro
const OUTRO = DEFAULT_MESSAGE_TEMPLATE.outro

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
    attendance: att ?? '\ubbf8\uc785\ub825',
    testScore: scoreRaw ?? '\ubbf8\uc785\ub825',
    lessonContent: topic ?? '-',
    nextRange: next ?? '-',
    homework: hwItem
      ? hwItem.is_completed
        ? '\uc644\ub8cc \u2713'
        : '\ubbf8\uc644\ub8cc \u2717'
      : '\ubbf8\uc785\ub825',
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

const SENT_BATCHES: MsgBatch[] = (() => {
  const result: MsgBatch[] = []

  // attendance batch
  const cls1 = mockClasses.find((cls) => cls.id === 1)
  if (cls1) {
    result.push({
      id: 100,
      sentAt: '2026-03-30 15:55',
      type: 'attendance',
      className: cls1.name,
      lessonDate: '2026-03-30',
      students: cls1.students.map((s) => ({
        studentId: s.id,
        studentName: s.name,
        fullContent: buildAttMsg(s.name, cls1.name),
        isExpired: true,
      })),
    })
  }

  const sentHour: Record<number, string> = { 1: '16:30', 2: '17:00', 3: '17:30' }
  mockLessonRecords
    .filter((l) => l.status === 'SAVED')
    .sort((a, b) => b.lesson_date.localeCompare(a.lesson_date))
    .forEach((lesson, i) => {
      const students: MsgStudent[] = lesson.student_data
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
        .filter((s): s is MsgStudent => s !== null)

      if (students.length > 0) {
        result.push({
          id: i + 1,
          sentAt: `${lesson.lesson_date} ${sentHour[lesson.class_id] ?? '17:00'}`,
          type: 'lesson',
          className: lesson.class_name,
          lessonDate: lesson.lesson_date,
          students,
        })
      }
    })

  return result.sort((a, b) => b.sentAt.localeCompare(a.sentAt))
})()

// ??? TypeBadge ??????????????????????????????????????????????????????????????
function TypeBadge({ type }: { type: 'lesson' | 'attendance' }) {
  return (
    <span
      style={{
        background: type === 'lesson' ? c.primary50 : c.success50,
        color: type === 'lesson' ? c.primary500 : c.success500,
        borderRadius: 6,
        padding: '3px 9px',
        fontSize: 11,
        fontWeight: 700,
      }}
    >
      {type === 'lesson' ? '\uc218\uc5c5' : '\ucd9c\uacb0'}
    </span>
  )
}

// ??? main page ???????????????????????????????????????????????????????????????
export default function MessagesPage() {
  const [typeFilter, setTypeFilter] = useState<'all' | 'lesson' | 'attendance'>('all')
  const [classFilter, setClassFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [resentIds, setResentIds] = useState<Set<number>>(new Set())

  const uniqueClasses = useMemo(
    () => [...new Set(SENT_BATCHES.map((b) => b.className))],
    [],
  )

  const filtered = useMemo(
    () =>
      SENT_BATCHES.filter((b) => {
        if (typeFilter !== 'all' && b.type !== typeFilter) return false
        if (classFilter !== 'all' && b.className !== classFilter) return false
        if (search) {
          const q = search
          if (
            !b.className.includes(q) &&
            !b.students.some((s) => s.studentName.includes(q))
          )
            return false
        }
        return true
      }),
    [typeFilter, classFilter, search],
  )

  const totalSends = SENT_BATCHES.reduce((a, b) => a + b.students.length, 0)
  const thisWeek = SENT_BATCHES.filter((b) => b.sentAt >= '2026-03-24').reduce(
    (a, b) => a + b.students.length,
    0,
  )
  const expired = SENT_BATCHES.flatMap((b) => b.students).filter((s) => s.isExpired).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div>
          <Text variant="display" as="h1">
            {'\uc54c\ub9bc\ud1a1 \ubc1c\uc1a1 \ub0b4\uc5ed'}
          </Text>
          <p style={{ color: c.gray500, fontSize: 13, marginTop: 4 }}>
            {'\uc218\uc5c5 \uc785\ub825 \ud654\uba74\uc5d0\uc11c \uc54c\ub9bc\ud1a1\uc744 \ubc1c\uc1a1\ud558\uba74 \uc5ec\uae30\uc5d0 \uae30\ub85d\ub3fc\uc694'}
          </p>
        </div>
      </div>

      {/* stats */}
      <div style={{ display: 'flex', gap: 10 }}>
        {[
          { label: '\uc218\uc5c5 \ubc1c\uc1a1 \ud69f\uc218', value: SENT_BATCHES.length, color: c.gray900 },
          { label: '\uc218\uc2e0 \ud559\uc0dd \uc218', value: totalSends, color: c.primary500 },
          { label: '\uc774\ubc88 \uc8fc \ubc1c\uc1a1', value: thisWeek, color: c.success500 },
          { label: '\ub9cc\ub8cc\ub41c \uba54\uc2dc\uc9c0', value: expired, color: c.gray300 },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              flex: 1,
              background: c.white,
              borderRadius: 12,
              padding: '14px 16px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, color: s.color, lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: c.gray500, marginTop: 5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* filter bar */}
      <div
        style={{
          background: c.white,
          borderRadius: 14,
          padding: '12px 16px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={'\ud559\uc0dd\uba85 / \ubc18 \uac80\uc0c9'}
          style={{
            padding: '7px 13px',
            borderRadius: 8,
            border: `1.5px solid ${c.gray100}`,
            fontSize: 13,
            outline: 'none',
            width: 180,
            color: c.gray900,
          }}
        />
        <div style={{ display: 'flex', gap: 4 }}>
          {(
            [
              ['all', '\uc804\uccb4'],
              ['lesson', '\uc218\uc5c5'],
              ['attendance', '\ucd9c\uacb0'],
            ] as [string, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTypeFilter(key as typeof typeFilter)}
              style={{
                padding: '6px 13px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                background: typeFilter === key ? c.primary500 : c.gray50,
                color: typeFilter === key ? '#fff' : c.gray600,
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          style={{
            padding: '7px 12px',
            borderRadius: 8,
            border: `1.5px solid ${c.gray100}`,
            fontSize: 13,
            outline: 'none',
            color: c.gray900,
          }}
        >
          <option value="all">{'\uc804\uccb4 \ubc18'}</option>
          {uniqueClasses.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
        <span style={{ fontSize: 12, color: c.gray500, marginLeft: 'auto' }}>
          {filtered.length}
          {'\uac74'}
        </span>
      </div>

      {/* batch list */}
      {filtered.length === 0 ? (
        <div
          style={{
            background: c.white,
            borderRadius: 14,
            padding: '40px',
            textAlign: 'center',
            color: c.gray300,
            fontSize: 13,
          }}
        >
          {'\uc870\uac74\uc5d0 \ub9de\ub294 \ubc1c\uc1a1 \ub0b4\uc5ed\uc774 \uc5c6\uc5b4\uc694.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((batch) => {
            const isExpanded = expandedId === batch.id
            const allExpired = batch.students.every((s) => s.isExpired)

            return (
              <div
                key={batch.id}
                style={{
                  background: c.white,
                  borderRadius: 14,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                  border: `1px solid ${isExpanded ? c.primary200 : 'transparent'}`,
                  transition: 'border-color 0.15s',
                }}
              >
                {/* row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '14px 18px',
                    cursor: 'pointer',
                    background: isExpanded ? c.primary50 : 'transparent',
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : batch.id)}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      background: batch.type === 'lesson' ? c.primary100 : c.success50,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 17,
                      flexShrink: 0,
                    }}
                  >
                    {batch.type === 'lesson' ? '\ud83d\udcdd' : '\u2705'}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 3,
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 600, color: c.gray900 }}>
                        {batch.className}
                      </span>
                      <TypeBadge type={batch.type} />
                      {allExpired && (
                        <span
                          style={{
                            background: c.gray75,
                            color: c.gray500,
                            borderRadius: 5,
                            padding: '2px 7px',
                            fontSize: 11,
                          }}
                        >
                          {'\ub9cc\ub8cc'}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: c.gray500 }}>
                      {batch.sentAt}
                      {'\u00a0\u00b7\u00a0'}
                      <span style={{ color: c.primary500, fontWeight: 600 }}>
                        {batch.students.length}
                        {'\uba85'}
                      </span>
                      {'\uc5d0\uac8c \ubc1c\uc1a1'}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setResentIds((prev) => new Set([...prev, batch.id]))
                      }}
                      disabled={resentIds.has(batch.id)}
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        padding: '5px 12px',
                        borderRadius: 7,
                        border: 'none',
                        cursor: resentIds.has(batch.id) ? 'default' : 'pointer',
                        background: resentIds.has(batch.id) ? c.gray50 : c.gray75,
                        color: resentIds.has(batch.id) ? c.gray300 : c.gray700,
                      }}
                    >
                      {resentIds.has(batch.id)
                        ? '\uc7ac\ubc1c\uc1a1 \uc644\ub8cc'
                        : '\uc7ac\ubc1c\uc1a1'}
                    </button>
                    <span style={{ fontSize: 11, color: c.gray300 }}>
                      {isExpanded ? '\u25b2' : '\u25bc'}
                    </span>
                  </div>
                </div>

                {/* expanded: student messages */}
                {isExpanded && (
                  <div
                    style={{ borderTop: `1px solid ${c.gray75}`, padding: '16px 18px' }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: c.gray300,
                        fontWeight: 700,
                        marginBottom: 12,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {'\uac1c\ubcc4 \ubc1c\uc1a1 \ub0b4\uc6a9'}
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: 10,
                      }}
                    >
                      {batch.students.map((student) => (
                        <div
                          key={student.studentId}
                          style={{
                            background: c.gray50,
                            borderRadius: 10,
                            padding: '12px 14px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: 8,
                            }}
                          >
                            <span
                              style={{ fontSize: 13, fontWeight: 600, color: c.gray900 }}
                            >
                              {student.studentName}
                            </span>
                            {student.isExpired && (
                              <span
                                style={{
                                  background: c.gray100,
                                  color: c.gray500,
                                  borderRadius: 4,
                                  padding: '1px 6px',
                                  fontSize: 10,
                                }}
                              >
                                {'\ub9cc\ub8cc'}
                              </span>
                            )}
                          </div>
                          <pre
                            style={{
                              fontSize: 11.5,
                              color: c.gray700,
                              whiteSpace: 'pre-wrap',
                              lineHeight: 1.7,
                              maxHeight: 200,
                              overflowY: 'auto',
                              background: c.white,
                              borderRadius: 7,
                              padding: '10px 12px',
                              margin: 0,
                              fontFamily: 'inherit',
                            }}
                          >
                            {student.fullContent}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
