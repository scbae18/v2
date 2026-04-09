'use client'

import { useRouter } from 'next/navigation'
import { colors } from '@/styles/tokens/colors'
import { useAttendanceStore } from '@/stores/attendanceStore'

const c = colors

export default function AttendanceResultModal() {
  const router = useRouter()
  const { resultSummary, setShowResult, clearSession } = useAttendanceStore()

  if (!resultSummary) return null

  const { present, late, absent } = resultSummary

  const handleGoLesson = () => {
    setShowResult(false)
    clearSession()
    router.push('/lesson')
  }

  const handleClose = () => {
    setShowResult(false)
    clearSession()
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}
      onClick={handleClose}
    >
      <div
        style={{ background: c.white, borderRadius: 20, padding: '40px 40px 32px', width: 540, maxWidth: '90vw', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 체크 아이콘 */}
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: c.primary500, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: c.gray900, letterSpacing: '-0.66px', marginBottom: 28 }}>
          출결이 종료됐어요
        </h2>

        {/* 통계 박스 3개 */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          {[
            { label: '출석', value: present, color: c.primary500 },
            { label: '지각', value: late, color: c.warning500 },
            { label: '결석', value: absent, color: c.error500 },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{ flex: 1, background: c.gray50, borderRadius: 12, padding: '16px', textAlign: 'center' }}
            >
              <p style={{ fontSize: 12, color: c.gray500, marginBottom: 8, letterSpacing: '-0.36px' }}>{label}</p>
              <p style={{ fontSize: 28, fontWeight: 700, color, letterSpacing: '-0.84px' }}>{value}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleGoLesson}
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
          수업 입력하기 →
        </button>
      </div>
    </div>
  )
}
