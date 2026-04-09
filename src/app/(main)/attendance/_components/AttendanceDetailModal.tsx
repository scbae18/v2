'use client'

import { useState, useEffect } from 'react'
import { colors } from '@/styles/tokens/colors'
import { getRemainingTimeStr, updateAttendanceStatus } from '@/mock/attendance.mock'
import { useAttendanceStore } from '@/stores/attendanceStore'
import type { AttendanceStatus, AttendanceSession } from '@/mock/attendance.mock'

const c = colors

type FilterType = '전체' | '출석' | '지각' | '결석' | '미확인'

const STATUS_STYLE: Record<AttendanceStatus, { bg: string; text: string; label: string }> = {
  출석: { bg: c.success50, text: c.success500, label: '출석' },
  지각: { bg: c.warning50, text: c.warning500, label: '지각' },
  결석: { bg: c.error50, text: c.error500, label: '결석' },
  미확인: { bg: c.gray50, text: c.gray500, label: '미확인' },
}

function TimerIcon() {
  return (
    <div style={{ width: 44, height: 44, borderRadius: '50%', background: c.primary50, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="13" r="8" stroke={c.primary400} strokeWidth="2" />
        <path d="M12 9v4l2.5 2.5" stroke={c.primary400} strokeWidth="2" strokeLinecap="round" />
        <path d="M9 2h6M12 2v3" stroke={c.primary400} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

interface Props {
  session: AttendanceSession
  onClose: () => void
  onEnd: () => void
}

export default function AttendanceDetailModal({ session, onClose, onEnd }: Props) {
  const { updateSession } = useAttendanceStore()
  const [remaining, setRemaining] = useState(getRemainingTimeStr(session.expiresAt))
  const [filter, setFilter] = useState<FilterType>('전체')
  const [localStudents, setLocalStudents] = useState(session.students)

  useEffect(() => {
    const tick = setInterval(() => {
      setRemaining(getRemainingTimeStr(session.expiresAt))
      // 2초마다 학생 목록 갱신
      setLocalStudents([...session.students])
    }, 2000)
    return () => clearInterval(tick)
  }, [session])

  const presentCount = localStudents.filter((s) => s.status === '출석').length
  const lateCount = localStudents.filter((s) => s.status === '지각').length
  const absentCount = localStudents.filter((s) => s.status === '결석' || s.status === '미확인').length

  const handleManual = (studentId: number, status: AttendanceStatus) => {
    updateAttendanceStatus(session.sessionId, studentId, status)
    setLocalStudents([...session.students])
    updateSession({ ...session, students: [...session.students] })
  }

  const filtered = localStudents.filter((s) => {
    if (filter === '전체') return true
    if (filter === '결석') return s.status === '결석' || s.status === '미확인'
    return s.status === filter
  })

  const isExpiringSoon = remaining < '01:00'

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}
      onClick={onClose}
    >
      <div
        style={{ background: c.white, borderRadius: 20, padding: '40px 40px 32px', width: 620, maxWidth: '90vw', maxHeight: '88vh', overflow: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <TimerIcon />

        <h2 style={{ fontSize: 20, fontWeight: 700, color: c.gray900, letterSpacing: '-0.6px', marginBottom: 12 }}>
          {session.className} 출결 현황
        </h2>

        {/* 메타 행 */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke={c.gray400} strokeWidth="2" />
              <path d="M9 9h6M9 12h6M9 15h3" stroke={c.gray400} strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: c.gray700, letterSpacing: 2 }}>{session.code}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke={c.gray400} strokeWidth="2" />
              <path d="M12 7v5l3 3" stroke={c.gray400} strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: isExpiringSoon ? c.error500 : c.gray700 }}>{remaining}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={c.gray400} strokeWidth="2" strokeLinecap="round" />
              <circle cx="9" cy="7" r="4" stroke={c.gray400} strokeWidth="2" />
            </svg>
            <span style={{ fontSize: 13, color: c.gray700 }}>{localStudents.length}명</span>
          </div>
        </div>

        {/* 출석/결석 통계 박스 */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, background: c.gray50, borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: c.gray500, marginBottom: 6, letterSpacing: '-0.36px' }}>출석</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: c.primary500, letterSpacing: '-0.84px' }}>{presentCount + lateCount}</p>
          </div>
          <div style={{ flex: 1, background: c.gray50, borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: c.gray500, marginBottom: 6, letterSpacing: '-0.36px' }}>결석</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: c.error500, letterSpacing: '-0.84px' }}>{absentCount}</p>
          </div>
        </div>

        {/* 필터 칩 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['전체', '출석', '지각', '결석'] as FilterType[]).map((f) => {
            const counts: Record<FilterType, number> = {
              전체: localStudents.length,
              출석: presentCount,
              지각: lateCount,
              결석: absentCount,
              미확인: 0,
            }
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: 'none',
                  background: filter === f ? c.primary500 : c.gray50,
                  color: filter === f ? c.white : c.gray600,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '-0.39px',
                }}
              >
                {f} {counts[f]}
              </button>
            )
          })}
        </div>

        {/* 학생 목록 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 28 }}>
          {filtered.map((student) => {
            const st = STATUS_STYLE[student.status]
            return (
              <div
                key={student.studentId}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: c.gray50, borderRadius: 10 }}
              >
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: c.gray900, letterSpacing: '-0.42px' }}>{student.name}</p>
                  {student.checkedAt && (
                    <p style={{ fontSize: 11, color: c.gray400, marginTop: 2 }}>{student.checkedAt}</p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {(['출석', '지각', '결석'] as AttendanceStatus[]).map((s) => {
                    const sStyle = STATUS_STYLE[s]
                    return (
                      <button
                        key={s}
                        onClick={() => handleManual(student.studentId, s)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: 6,
                          border: `1.5px solid ${student.status === s ? sStyle.text : c.gray100}`,
                          background: student.status === s ? sStyle.bg : c.white,
                          color: student.status === s ? sStyle.text : c.gray300,
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* 출결 종료하기 */}
        <button
          onClick={onEnd}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 12,
            border: 'none',
            background: c.primary500,
            color: c.white,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '-0.48px',
          }}
        >
          출결 종료하기
        </button>
      </div>
    </div>
  )
}
