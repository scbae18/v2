'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Button from '@/components/common/Button'
import { mockClasses, mockStudentDetails } from '@/mocks/_db'
import { createAttendanceSession } from '@/mock/attendance.mock'
import { useAttendanceStore } from '@/stores/attendanceStore'
import { colors } from '@/styles/tokens/colors'
import AttendanceStartModal from '@/app/(main)/attendance/_components/AttendanceStartModal'
import { formatClassWeekdayPattern, getTodayActiveClasses, HOME_REFERENCE_DATE } from '../homeModel'
import * as styles from '../home.css'

const c = colors

type Props = {
  dateLabel: string
}

export default function HomeAttendanceSection({ dateLabel }: Props) {
  const [startingClassId, setStartingClassId] = useState<number | null>(null)
  const { session, startSession } = useAttendanceStore()

  const todayClasses = useMemo(() => getTodayActiveClasses(HOME_REFERENCE_DATE), [])
  const todayIds = useMemo(() => new Set(todayClasses.map((cls) => cls.id)), [todayClasses])

  const startingClass = todayClasses.find((cls) => cls.id === startingClassId)

  const sessionNotInTodayList = session && !todayIds.has(session.classId)

  const handleAttendanceStart = (classId: number, durationMinutes: number) => {
    const cls = mockClasses.find((x) => x.id === classId)
    if (!cls) return
    const students = mockStudentDetails
      .filter((s) => s.classes.some((cl) => cl.id === classId))
      .map((s) => ({ id: s.id, name: s.name }))
    const newSession = createAttendanceSession(
      classId,
      classId,
      cls.name,
      new Date().toISOString().slice(0, 10),
      durationMinutes,
      students,
    )
    startSession(newSession)
    setStartingClassId(null)
  }

  return (
    <section aria-labelledby="home-today-attendance-title" style={{ paddingBottom: 8 }}>
      <div className={styles.sectionHeaderStyle} style={{ marginTop: 0 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="4" width="18" height="18" rx="3" stroke={c.gray900} strokeWidth="2" />
          <path d="M16 2v4M8 2v4M3 10h18" stroke={c.gray900} strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span id="home-today-attendance-title" className={styles.sectionTitleStyle}>
          오늘 수업 · 출결
        </span>
        {session ? (
          <>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: c.primary500,
                background: c.primary50,
                borderRadius: 20,
                padding: '3px 10px',
              }}
            >
              {session.className} 진행 중
            </span>
            <Link
              href="/attendance"
              style={{
                marginLeft: 'auto',
                fontSize: 13,
                fontWeight: 700,
                color: c.primary500,
                textDecoration: 'none',
              }}
            >
              출결 화면 →
            </Link>
          </>
        ) : null}
      </div>

      <p className={styles.attendanceHintStyle}>
        {dateLabel} · 오늘 요일에 등록된 반만 보입니다. 수업 기록·반 설정·출결을 여기서 이어가면 됩니다.
      </p>

      {sessionNotInTodayList ? (
        <div className={styles.attendanceSessionForeignStyle}>
          <span>진행 중인 출결이 다른 반이에요. 화면에서 이어서 진행해 주세요.</span>
          <Link
            href="/attendance"
            style={{ fontSize: 13, fontWeight: 700, color: c.primary500, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            출결 화면 열기
          </Link>
        </div>
      ) : null}

      {todayClasses.length === 0 ? (
        <div className={styles.attendanceEmptyStyle}>오늘 요일에 예정된 반이 없습니다.</div>
      ) : (
        <div className={styles.attendanceGridRichStyle}>
          {todayClasses.map((cls) => {
            const isActive = session?.classId === cls.id
            const studentCount = mockStudentDetails.filter((s) => s.classes.some((sc) => sc.id === cls.id)).length
            const scheduleLabel = formatClassWeekdayPattern(cls.schedules)
            const templateName = cls.templates[0]?.name

            const cardClass = `${styles.attendanceCardRichStyle}${isActive ? ` ${styles.attendanceCardRichActiveStyle}` : ''}`

            return (
              <div key={cls.id} className={cardClass}>
                <div className={styles.attendanceCardHeadStyle}>
                  <div className={styles.attendanceCardNameStyle}>{cls.name}</div>
                  <span className={styles.attendanceTodayBadgeStyle}>오늘 수업일</span>
                </div>
                <div className={styles.attendanceCardMetaBlockStyle}>
                  <div className={styles.attendanceCardMetaLineStyle}>
                    {cls.academy_name} · 학생 {studentCount}명
                  </div>
                  {templateName ? (
                    <div className={styles.attendanceCardMetaLineStyle}>템플릿 · {templateName}</div>
                  ) : null}
                  <div className={styles.attendanceCardSchedulePillStyle}>정기 요일 · {scheduleLabel}</div>
                </div>
                <div className={styles.attendanceCardFooterStyle}>
                  <div className={styles.attendanceCardLessonActionsStyle}>
                    <Link href="/lesson">
                      <Button variant="secondary" size="sm" type="button">
                        수업 기록
                      </Button>
                    </Link>
                    <Link href={`/management/${cls.id}`}>
                      <Button variant="ghost" size="sm" type="button">
                        반 설정
                      </Button>
                    </Link>
                  </div>
                  {isActive ? (
                    <Link
                      href="/attendance"
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: c.white,
                        background: c.primary500,
                        borderRadius: 10,
                        padding: '8px 16px',
                        textDecoration: 'none',
                        display: 'inline-block',
                      }}
                    >
                      출결 화면
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setStartingClassId(cls.id)}
                      disabled={!!session}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 10,
                        border: 'none',
                        background: session ? c.gray50 : c.primary500,
                        color: session ? c.gray300 : c.white,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: session ? 'not-allowed' : 'pointer',
                        letterSpacing: '-0.39px',
                      }}
                    >
                      출결 시작
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {startingClass ? (
        <AttendanceStartModal
          className={startingClass.name}
          studentCount={mockStudentDetails.filter((s) => s.classes.some((sc) => sc.id === startingClass.id)).length}
          onStart={(duration) => handleAttendanceStart(startingClass.id, duration)}
          onCancel={() => setStartingClassId(null)}
        />
      ) : null}
    </section>
  )
}
