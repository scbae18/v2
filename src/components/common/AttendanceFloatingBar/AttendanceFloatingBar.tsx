'use client'

import { useState, useEffect } from 'react'
import { colors } from '@/styles/tokens/colors'
import { useAttendanceStore } from '@/stores/attendanceStore'
import { endSession as mockEndSession, getRemainingTimeStr } from '@/mock/attendance.mock'
import dynamic from 'next/dynamic'

const c = colors

const AttendanceDetailModal = dynamic(
  () => import('@/app/(main)/attendance/_components/AttendanceDetailModal'),
  { ssr: false }
)

// 타이머 아이콘 (흰색 버전 — primary400 배경용)
function TimerIconWhite({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="20" r="13" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
      <circle cx="18" cy="20" r="10" fill="none" stroke="white" strokeWidth="2" />
      <path d="M18 14v6l4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 5h10M18 5v4" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// 수직 구분선 (피그마 — 44px height)
function Divider() {
  return (
    <div
      style={{
        width: 1,
        height: 44,
        background: 'rgba(255,255,255,0.3)',
        flexShrink: 0,
      }}
    />
  )
}

export default function AttendanceFloatingBar() {
  const { session, setShowDetail, showDetail, endSession: storeEnd } = useAttendanceStore()
  const [remaining, setRemaining] = useState('')
  const [showEndConfirm, setShowEndConfirm] = useState(false)

  useEffect(() => {
    if (!session) return
    setRemaining(getRemainingTimeStr(session.expiresAt))
    const tick = setInterval(() => {
      const r = getRemainingTimeStr(session.expiresAt)
      setRemaining(r)
      if (r === '00:00') {
        // 시간 종료 — 자동 종료
        mockEndSession(session.sessionId)
        const present = session.students.filter((s) => s.status === '출석').length
        const late = session.students.filter((s) => s.status === '지각').length
        const absent = session.students.filter((s) => s.status === '결석' || s.status === '미확인').length
        storeEnd({ present, late, absent })
        clearInterval(tick)
      }
    }, 1000)
    return () => clearInterval(tick)
  }, [session, storeEnd])

  if (!session) return null

  const present = session.students.filter((s) => s.status === '출석').length
  const late = session.students.filter((s) => s.status === '지각').length
  const absent = session.students.filter((s) => s.status === '결석' || s.status === '미확인').length

  const isExpiringSoon = remaining < '01:00' && remaining !== ''

  const handleEnd = () => {
    const p = session.students.filter((s) => s.status === '출석').length
    const l = session.students.filter((s) => s.status === '지각').length
    mockEndSession(session.sessionId)
    const a = session.students.filter((s) => s.status === '결석').length
    storeEnd({ present: p, late: l, absent: a })
    setShowEndConfirm(false)
  }

  return (
    <>
      {/* 플로팅 바 — 피그마: primary400 bg, px-32 py-24, rounded-20, shadow */}
      <div
        style={{
          position: 'fixed',
          bottom: 32,
          left: 'calc(240px + 32px)', // 사이드바 너비 + 여백
          right: 32,
          background: c.primary400,
          borderRadius: 20,
          boxShadow: '0 0 30px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 32px',
          zIndex: 100,
        }}
      >
        {/* 왼쪽: 타이머 아이콘 + 반 이름 + 출석/지각/결석 통계 */}
        <div style={{ display: 'flex', gap: 60, alignItems: 'center' }}>
          {/* 타이머 + 반 이름 + 코드 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <TimerIconWhite size={36} />
            <span style={{ fontSize: 20, fontWeight: 600, color: c.white, letterSpacing: '-0.6px', whiteSpace: 'nowrap' }}>
              {session.className} 출석체크
            </span>
            {/* 출결 코드 배지 */}
            <div style={{
              background: 'rgba(255,255,255,0.18)',
              borderRadius: 8,
              padding: '4px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.75)', letterSpacing: '-0.33px' }}>코드</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: c.white, letterSpacing: 4 }}>{session.code}</span>
            </div>
          </div>

          {/* 통계: 출석 | 지각 | 결석 */}
          <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
            <StatItem label="출석" value={present} />
            <Divider />
            <StatItem label="지각" value={late} />
            <Divider />
            <StatItem label="결석" value={absent} />
          </div>
        </div>

        {/* 오른쪽: 남은 시간 + 버튼들 */}
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: isExpiringSoon ? '#FFD6D6' : c.white,
              letterSpacing: '-0.42px',
              whiteSpace: 'nowrap',
            }}
          >
            남은 시간 {remaining}
          </span>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* 상세 보기 — primary200 bg, primary500 text */}
            <button
              onClick={() => setShowDetail(true)}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: 'none',
                background: c.primary200,
                color: c.primary500,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '-0.42px',
                whiteSpace: 'nowrap',
              }}
            >
              상세 보기
            </button>

            {/* 출결 종료 — primary500 bg, white text */}
            <button
              onClick={() => setShowEndConfirm(true)}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: 'none',
                background: c.primary500,
                color: c.white,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '-0.42px',
                whiteSpace: 'nowrap',
              }}
            >
              출결 종료
            </button>
          </div>
        </div>
      </div>

      {/* 종료 확인 팝오버 */}
      {showEndConfirm && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}
          onClick={() => setShowEndConfirm(false)}
        >
          <div
            style={{
              background: c.white,
              borderRadius: 20,
              padding: '36px 40px',
              width: 400,
              boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ fontSize: 18, fontWeight: 600, color: c.gray900, letterSpacing: '-0.54px', marginBottom: 10 }}>
              출결을 종료할까요?
            </p>
            <p style={{ fontSize: 14, fontWeight: 500, color: c.gray500, letterSpacing: '-0.42px', marginBottom: 28 }}>
              미확인 학생은 자동으로 결석 처리돼요.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowEndConfirm(false)}
                style={{
                  flex: 1, padding: '14px', borderRadius: 12, border: 'none',
                  background: c.gray50, color: c.gray600, fontSize: 15, fontWeight: 600, cursor: 'pointer',
                }}
              >
                취소
              </button>
              <button
                onClick={handleEnd}
                style={{
                  flex: 1, padding: '14px', borderRadius: 12, border: 'none',
                  background: c.primary500, color: c.white, fontSize: 15, fontWeight: 600, cursor: 'pointer',
                }}
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
          onEnd={() => {
            setShowDetail(false)
            setShowEndConfirm(true)
          }}
        />
      )}
    </>
  )
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', width: 30 }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: c.white, letterSpacing: '-0.42px' }}>{label}</span>
      <span style={{ fontSize: 28, fontWeight: 600, color: c.white, letterSpacing: '-0.84px', lineHeight: 1 }}>{value}</span>
    </div>
  )
}
