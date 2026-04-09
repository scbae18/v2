'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { mockClasses, mockStudentDetails } from '@/mocks/_db'
import { createAttendanceSession } from '@/mock/attendance.mock'
import { useAttendanceStore } from '@/stores/attendanceStore'
import { colors } from '@/styles/tokens/colors'
import AttendanceStartModal from './_components/AttendanceStartModal'

const c = colors

export default function AttendancePage() {
  const router = useRouter()
  const { session, startSession } = useAttendanceStore()
  const [startingClassId, setStartingClassId] = useState<number | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const copyLink = (url: string, studentId: number) => {
    navigator.clipboard.writeText(url).catch(() => {})
    setCopiedId(studentId)
    setTimeout(() => setCopiedId(null), 1500)
  }

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

      {/* 학생 링크 섹션 — 세션 활성 시 */}
      {session && (
        <div
          style={{
            background: c.white,
            border: `1.5px solid ${c.gray75}`,
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          {/* 섹션 헤더 */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${c.gray50}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke={c.primary400} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke={c.primary400} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: 15, fontWeight: 700, color: c.gray900, letterSpacing: '-0.45px' }}>
                학생 출결 링크
              </span>
              <span style={{ fontSize: 12, color: c.gray500, letterSpacing: '-0.36px' }}>
                학생 이름을 클릭하면 바로 출결 화면으로 이동해요
              </span>
            </div>
            {/* 출결 코드 표시 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: c.gray500 }}>출결 코드</span>
              <span
                style={{
                  background: c.primary50,
                  color: c.primary500,
                  border: `1px solid ${c.primary100}`,
                  borderRadius: 8,
                  padding: '4px 12px',
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: 4,
                }}
              >
                {session.code}
              </span>
            </div>
          </div>

          {/* 학생 목록 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 0,
            }}
          >
            {session.students.map((student, idx) => {
              const url = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'}/check/${session.sessionId}?studentId=${student.studentId}`
              const isCopied = copiedId === student.studentId
              const statusStyle = {
                출석: { bg: c.success50, text: c.success500 },
                지각: { bg: c.warning50, text: c.warning500 },
                결석: { bg: c.error50, text: c.error500 },
                미확인: { bg: c.gray50, text: c.gray500 },
              }[student.status]

              return (
                <div
                  key={student.studentId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    borderTop: idx > 0 ? `1px solid ${c.gray50}` : 'none',
                    borderLeft: idx % 2 === 1 ? `1px solid ${c.gray50}` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* 상태 점 */}
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: statusStyle.text,
                        flexShrink: 0,
                      }}
                    />
                    {/* 이름 + 상태 */}
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: c.gray900, letterSpacing: '-0.42px' }}>
                        {student.name}
                      </span>
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: 11,
                          fontWeight: 600,
                          color: statusStyle.text,
                          background: statusStyle.bg,
                          borderRadius: 4,
                          padding: '2px 6px',
                        }}
                      >
                        {student.status}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    {/* 링크 복사 */}
                    <button
                      onClick={() => copyLink(url, student.studentId)}
                      title="링크 복사"
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 7,
                        border: `1px solid ${c.gray75}`,
                        background: isCopied ? c.success50 : c.white,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      {isCopied ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17L4 12" stroke={c.success500} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <rect x="9" y="9" width="13" height="13" rx="2" stroke={c.gray500} strokeWidth="2"/>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke={c.gray500} strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      )}
                    </button>
                    {/* 바로 열기 */}
                    <button
                      onClick={() => router.push(url)}
                      title="학생 화면 열기"
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 7,
                        border: `1px solid ${c.primary100}`,
                        background: c.primary50,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke={c.primary400} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="15 3 21 3 21 9" stroke={c.primary400} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="10" y1="14" x2="21" y2="3" stroke={c.primary400} strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
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
