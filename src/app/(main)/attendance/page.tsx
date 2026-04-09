'use client'

import { useState } from 'react'
import { mockClasses, mockStudentDetails } from '@/mocks/_db'
import { createAttendanceSession } from '@/mock/attendance.mock'
import { useAttendanceStore } from '@/stores/attendanceStore'
import { colors } from '@/styles/tokens/colors'
import AttendanceStartModal from './_components/AttendanceStartModal'

const c = colors

export default function AttendancePage() {
  const { session, startSession } = useAttendanceStore()
  const [startingClassId, setStartingClassId] = useState<number | null>(null)

  const activeClasses = mockClasses.filter((cls) => !cls.ended_at)

  const handleStart = (classId: number, durationMinutes: number) => {
    const cls = mockClasses.find((c) => c.id === classId)
    if (!cls) return

    const students = mockStudentDetails
      .filter((s) => s.classes.some((c) => c.id === classId))
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

  const startingClass = activeClasses.find((cls) => cls.id === startingClassId)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* 헤더 */}
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: c.gray900, letterSpacing: '-0.84px', lineHeight: 1.4, marginBottom: 6 }}>
          출결
        </h1>
        <p style={{ fontSize: 14, color: c.gray500, letterSpacing: '-0.42px' }}>
          반을 선택하고 출결을 시작하세요. 학생들에게 링크가 발송되고 실시간으로 현황을 확인할 수 있어요.
        </p>
      </div>

      {/* 진행 중인 세션 배너 */}
      {session && (
        <div
          style={{
            background: c.primary50,
            border: `1.5px solid ${c.primary200}`,
            borderRadius: 14,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.primary500, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: c.primary600, letterSpacing: '-0.45px' }}>
              {session.className} 출결 진행 중
            </p>
            <p style={{ fontSize: 13, color: c.primary400, letterSpacing: '-0.39px', marginTop: 2 }}>
              코드 {session.code} · 화면 하단 바에서 현황을 확인하세요
            </p>
          </div>
          <span
            style={{
              background: c.primary500,
              color: c.white,
              fontSize: 12,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 20,
            }}
          >
            진행 중
          </span>
        </div>
      )}

      {/* 반 목록 */}
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: c.gray700, letterSpacing: '-0.48px', marginBottom: 14 }}>
          반 선택
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, maxWidth: 860 }}>
          {activeClasses.map((cls) => {
            const isActive = session?.classId === cls.id
            const studentCount = mockStudentDetails.filter((s) => s.classes.some((c) => c.id === cls.id)).length

            return (
              <div
                key={cls.id}
                style={{
                  background: c.white,
                  border: `1.5px solid ${isActive ? c.primary300 : c.gray75}`,
                  borderRadius: 16,
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: c.gray900, letterSpacing: '-0.48px', marginBottom: 4 }}>
                    {cls.name}
                  </p>
                  <p style={{ fontSize: 13, color: c.gray500, letterSpacing: '-0.39px' }}>
                    학생 {studentCount}명
                  </p>
                </div>

                {isActive ? (
                  <div
                    style={{
                      padding: '10px',
                      borderRadius: 10,
                      background: c.primary50,
                      textAlign: 'center',
                      fontSize: 13,
                      fontWeight: 600,
                      color: c.primary500,
                      letterSpacing: '-0.39px',
                    }}
                  >
                    출결 진행 중 · {session!.code}
                  </div>
                ) : (
                  <button
                    onClick={() => setStartingClassId(cls.id)}
                    disabled={!!session}
                    style={{
                      padding: '10px',
                      borderRadius: 10,
                      border: 'none',
                      background: session ? c.gray50 : c.primary500,
                      color: session ? c.gray300 : c.white,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: session ? 'not-allowed' : 'pointer',
                      letterSpacing: '-0.42px',
                    }}
                  >
                    출결 시작하기
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 출결 시작 모달 */}
      {startingClass && startingClassId !== null && (
        <AttendanceStartModal
          className={startingClass.name}
          studentCount={
            mockStudentDetails.filter((s) => s.classes.some((c) => c.id === startingClassId)).length
          }
          onStart={(duration) => handleStart(startingClassId, duration)}
          onCancel={() => setStartingClassId(null)}
        />
      )}
    </div>
  )
}
