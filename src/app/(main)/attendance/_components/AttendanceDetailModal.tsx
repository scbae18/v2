'use client'

import { useState, useEffect } from 'react'
import { colors } from '@/styles/tokens/colors'
import { getRemainingTimeStr, updateAttendanceStatus } from '@/mock/attendance.mock'
import { useAttendanceStore } from '@/stores/attendanceStore'
import type { AttendanceStatus, AttendanceSession } from '@/mock/attendance.mock'

const c = colors

type FilterType = '전체' | '출석' | '결석'

const STATUS_STYLE: Record<AttendanceStatus, { bg: string; text: string }> = {
  출석: { bg: c.success50, text: c.success500 },
  지각: { bg: c.warning50, text: c.warning500 },
  결석: { bg: c.error50, text: c.error500 },
  미확인: { bg: c.gray50, text: c.gray500 },
}

// 스톱워치 아이콘
function TimerIcon() {
  return (
    <div style={{ width: 60, height: 60, marginBottom: 20 }}>
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <circle cx="30" cy="34" r="22" fill={c.primary50} stroke={c.primary200} strokeWidth="2" />
        <circle cx="30" cy="34" r="17" fill="none" stroke={c.primary400} strokeWidth="2.5" />
        <path d="M30 24v10l6 6" stroke={c.primary400} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M24 8h12M30 8v6" stroke={c.primary300} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M44 14l-3 3M16 14l3 3" stroke={c.primary300} strokeWidth="2" strokeLinecap="round" />
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
  const [localStudents, setLocalStudents] = useState([...session.students])
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const getCheckUrl = (studentId: number) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    return `${origin}/check/${session.sessionId}?studentId=${studentId}`
  }

  const copyLink = (studentId: number) => {
    const url = getCheckUrl(studentId)
    navigator.clipboard.writeText(url).catch(() => {})
    setCopiedId(studentId)
    setTimeout(() => setCopiedId(null), 1500)
  }

  useEffect(() => {
    const tick = setInterval(() => {
      setRemaining(getRemainingTimeStr(session.expiresAt))
      setLocalStudents([...session.students])
    }, 2000)
    return () => clearInterval(tick)
  }, [session])

  const presentCount = localStudents.filter((s) => s.status === '출석' || s.status === '지각').length
  const absentCount = localStudents.filter((s) => s.status === '결석' || s.status === '미확인').length
  const lateCount = localStudents.filter((s) => s.status === '지각').length

  // 상태 배지 클릭으로 순환
  const cycleStatus = (studentId: number, current: AttendanceStatus) => {
    const cycle: AttendanceStatus[] = ['출석', '지각', '결석']
    const next = cycle[(cycle.indexOf(current) + 1) % cycle.length]
    updateAttendanceStatus(session.sessionId, studentId, next)
    setLocalStudents([...session.students])
    updateSession({ ...session, students: [...session.students] })
  }

  const filtered = localStudents.filter((s) => {
    if (filter === '전체') return true
    if (filter === '결석') return s.status === '결석' || s.status === '미확인'
    return s.status === '출석' || s.status === '지각'
  })

  const filterCounts: Record<FilterType, number> = {
    전체: localStudents.length,
    출석: presentCount,
    결석: absentCount,
  }

  const isExpiringSoon = remaining < '01:00'

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}
      onClick={onClose}
    >
      <div
        style={{
          background: c.white,
          borderRadius: 24,
          padding: '48px 48px 48px',
          width: 640,
          maxWidth: '92vw',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <TimerIcon />

        {/* 타이틀 */}
        <h2 style={{ fontSize: 24, fontWeight: 600, color: c.gray900, letterSpacing: '-0.72px', marginBottom: 16 }}>
          {session.className} 출결 현황
        </h2>

        {/* 메타 정보 행: 코드, 남은 시간, 인원 */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 32 }}>
          {/* # 코드 */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: c.gray100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M4 9h16M4 15h16M10 3l-2 18M16 3l-2 18" stroke={c.gray700} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 500, color: c.gray700, letterSpacing: '-0.42px' }}>{session.code}</span>
          </div>
          {/* ⏱ 시간 */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke={c.gray500} strokeWidth="1.5" />
              <path d="M12 7v5l3 3" stroke={c.gray500} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 14, fontWeight: 500, color: isExpiringSoon ? c.error500 : c.gray700, letterSpacing: '-0.42px' }}>
              {remaining}
            </span>
          </div>
          {/* 👤 인원 */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={c.gray500} strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="9" cy="7" r="4" stroke={c.gray500} strokeWidth="1.5" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={c.gray500} strokeWidth="1.5" strokeLinecap="round" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={c.gray500} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 14, fontWeight: 500, color: c.gray700, letterSpacing: '-0.42px' }}>{localStudents.length}명</span>
          </div>
        </div>

        {/* 출석/결석 통계 박스 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {/* 출석 박스 */}
          <div style={{ flex: 1, background: c.gray50, borderRadius: 12, paddingTop: 16, paddingBottom: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: c.primary500, letterSpacing: '-0.42px' }}>출석</span>
              <span style={{ fontSize: 28, fontWeight: 600, color: c.primary500, letterSpacing: '-0.84px', lineHeight: 1 }}>{presentCount}</span>
            </div>
          </div>
          {/* 결석 박스 */}
          <div style={{ flex: 1, background: c.gray50, borderRadius: 12, paddingTop: 16, paddingBottom: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: c.gray700, letterSpacing: '-0.42px' }}>결석</span>
              <span style={{ fontSize: 28, fontWeight: 600, color: c.gray700, letterSpacing: '-0.84px', lineHeight: 1 }}>{absentCount}</span>
            </div>
          </div>
        </div>

        {/* 필터 칩 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['전체', '출석', '결석'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                padding: '4px 12px',
                borderRadius: 999,
                border: 'none',
                background: filter === f ? c.primary500 : c.gray50,
                color: filter === f ? c.white : c.gray700,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '-0.42px',
              }}
            >
              <span>{f}</span>
              <span>{filterCounts[f]}</span>
            </button>
          ))}
        </div>

        {/* 학생 목록 — 2열 그리드 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
          {Array.from({ length: Math.ceil(filtered.length / 2) }).map((_, rowIdx) => {
            const left = filtered[rowIdx * 2]
            const right = filtered[rowIdx * 2 + 1]
            return (
              <div key={rowIdx} style={{ display: 'flex', gap: 20 }}>
                {[left, right].map((student, colIdx) => {
                  if (!student) return <div key={colIdx} style={{ flex: 1 }} />
                  const st = STATUS_STYLE[student.status]
                  return (
                    <div
                      key={student.studentId}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                      }}
                    >
                      {/* 이름 + 링크 버튼 */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                        <button
                          onClick={() => window.open(getCheckUrl(student.studentId), '_blank')}
                          title="학생 출결 화면 열기"
                          style={{
                            fontSize: 16,
                            fontWeight: 500,
                            color: c.gray900,
                            letterSpacing: '-0.48px',
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {student.name}
                        </button>
                        {/* 링크 복사 버튼 */}
                        <button
                          onClick={() => copyLink(student.studentId)}
                          title="링크 복사"
                          style={{
                            width: 20,
                            height: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            flexShrink: 0,
                          }}
                        >
                          {copiedId === student.studentId ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M20 6L9 17L4 12" stroke={c.success500} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <rect x="9" y="9" width="13" height="13" rx="2" stroke={c.gray300} strokeWidth="1.5"/>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke={c.gray300} strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          )}
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                        {student.checkedAt && (
                          <span style={{ fontSize: 14, fontWeight: 500, color: c.gray500, letterSpacing: '-0.42px' }}>
                            {student.checkedAt}
                          </span>
                        )}
                        <button
                          onClick={() => cycleStatus(student.studentId, student.status)}
                          title="클릭해서 상태 변경"
                          style={{
                            background: st.bg,
                            color: st.text,
                            border: 'none',
                            borderRadius: 8,
                            padding: '4px 8px',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            letterSpacing: '-0.36px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {student.status === '미확인' ? '미확인' : student.status}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* 출결 종료하기 버튼 */}
        <button
          onClick={onEnd}
          style={{
            width: '100%',
            padding: '16px 12px',
            borderRadius: 12,
            border: 'none',
            background: c.primary500,
            color: c.white,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '-0.48px',
          }}
        >
          출결 종료하기
        </button>

        {lateCount > 0 && (
          <p style={{ textAlign: 'center', fontSize: 12, color: c.gray500, marginTop: 10 }}>
            지각 {lateCount}명 포함 · 상태 배지를 클릭하면 수기 변경돼요
          </p>
        )}
      </div>
    </div>
  )
}
