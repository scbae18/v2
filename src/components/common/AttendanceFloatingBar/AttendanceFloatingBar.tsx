'use client'

import { useState, useEffect } from 'react'
import { colors } from '@/styles/tokens/colors'
import { getRemainingTimeStr, endSession as mockEndSession } from '@/mock/attendance.mock'
import { useAttendanceStore } from '@/stores/attendanceStore'
import AttendanceDetailModal from '@/app/(main)/attendance/_components/AttendanceDetailModal'
import AttendanceResultModal from '@/app/(main)/attendance/_components/AttendanceResultModal'

const c = colors

const SIDEBAR_WIDTH = 240

export default function AttendanceFloatingBar() {
  const { session, showDetail, showResult, setShowDetail, endSession } = useAttendanceStore()
  const [remaining, setRemaining] = useState('')
  const [showEndConfirm, setShowEndConfirm] = useState(false)

  useEffect(() => {
    if (!session) return
    setRemaining(getRemainingTimeStr(session.expiresAt))
    const tick = setInterval(() => {
      const r = getRemainingTimeStr(session.expiresAt)
      setRemaining(r)
      // 시간 만료 자동 종료
      if (r === '00:00') {
        handleEnd()
        clearInterval(tick)
      }
    }, 1000)
    return () => clearInterval(tick)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.sessionId])

  if (!session) return null

  const presentCount = session.students.filter((s) => s.status === '출석').length
  const lateCount = session.students.filter((s) => s.status === '지각').length
  const absentCount = session.students.filter(
    (s) => s.status === '결석' || s.status === '미확인',
  ).length

  const isExpiringSoon = remaining !== '' && remaining < '01:00'

  const handleEnd = () => {
    mockEndSession(session.sessionId)
    endSession({
      present: session.students.filter((s) => s.status === '출석').length,
      late: session.students.filter((s) => s.status === '지각').length,
      absent: session.students.filter((s) => s.status === '결석' || s.status === '미확인').length,
    })
    setShowEndConfirm(false)
  }

  return (
    <>
      {/* 플로팅 바 */}
      <div
        style={{
          position: 'fixed',
          left: SIDEBAR_WIDTH,
          right: 0,
          bottom: 0,
          height: 72,
          background: c.primary500,
          display: 'flex',
          alignItems: 'center',
          paddingInline: 32,
          gap: 0,
          zIndex: 150,
        }}
      >
        {/* 왼쪽: 아이콘 + 수업명 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 220 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="13" r="8" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
            <path d="M12 9v4l2.5 2.5" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" />
            <path d="M9 2h6M12 2v3" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 15, fontWeight: 700, color: c.white, letterSpacing: '-0.45px' }}>
            {session.className} 출석체크
          </span>
        </div>

        {/* 중앙: 출석/지각/결석 통계 */}
        <div style={{ display: 'flex', gap: 0, flex: 1, justifyContent: 'center' }}>
          {[
            { label: '출석', value: presentCount },
            { label: '지각', value: lateCount },
            { label: '결석', value: absentCount },
          ].map(({ label, value }, i) => (
            <div
              key={label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                paddingInline: 28,
                borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.2)' : 'none',
              }}
            >
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', letterSpacing: '-0.33px' }}>{label}</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: c.white, letterSpacing: '-0.6px', lineHeight: 1 }}>{value}</span>
            </div>
          ))}
        </div>

        {/* 오른쪽: 남은 시간 + 버튼들 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 280, justifyContent: 'flex-end' }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: isExpiringSoon ? '#FFB3B3' : 'rgba(255,255,255,0.8)',
              letterSpacing: '-0.42px',
            }}
          >
            남은 시간 {remaining}
          </span>
          <button
            onClick={() => setShowDetail(true)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1.5px solid rgba(255,255,255,0.35)',
              background: 'transparent',
              color: c.white,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '-0.39px',
            }}
          >
            상세 보기
          </button>
          <button
            onClick={() => setShowEndConfirm(true)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: 'rgba(255,255,255,0.18)',
              color: c.white,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '-0.39px',
            }}
          >
            출결 종료
          </button>
        </div>
      </div>

      {/* 종료 컨펌 팝오버 */}
      {showEndConfirm && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 210 }}
          onClick={() => setShowEndConfirm(false)}
        >
          <div
            style={{ background: c.white, borderRadius: 16, padding: '28px 32px', width: 360, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ fontSize: 18, fontWeight: 700, color: c.gray900, marginBottom: 8, letterSpacing: '-0.54px' }}>출결을 종료할까요?</p>
            <p style={{ fontSize: 13, color: c.gray500, marginBottom: 24, letterSpacing: '-0.39px' }}>
              미확인 학생은 자동으로 결석 처리돼요.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowEndConfirm(false)}
                style={{ flex: 1, padding: '13px', borderRadius: 10, border: `1.5px solid ${c.gray100}`, background: c.white, color: c.gray600, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
              >
                취소
              </button>
              <button
                onClick={handleEnd}
                style={{ flex: 1, padding: '13px', borderRadius: 10, border: 'none', background: c.primary500, color: c.white, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
              >
                종료하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 상세 모달 */}
      {showDetail && (
        <AttendanceDetailModal
          session={session}
          onClose={() => setShowDetail(false)}
          onEnd={() => { setShowDetail(false); setShowEndConfirm(true) }}
        />
      )}

      {/* 완료 모달 */}
      {showResult && <AttendanceResultModal />}
    </>
  )
}
