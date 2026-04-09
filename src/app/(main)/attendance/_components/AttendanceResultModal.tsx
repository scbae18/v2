'use client'

import { colors } from '@/styles/tokens/colors'

const c = colors

// 체크 아이콘 (피그마 — primary500 원 + 흰색 체크)
function CheckIcon() {
  return (
    <div style={{ width: 60, height: 60, marginBottom: 20 }}>
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <circle cx="30" cy="30" r="30" fill={c.primary500} />
        <path d="M18 30l9 9 15-18" stroke={c.white} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

// 화살표 아이콘
function ArrowRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke={c.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface Props {
  summary: { present: number; late: number; absent: number }
  onClose: () => void
  onGoLesson?: () => void
}

export default function AttendanceResultModal({ summary, onClose, onGoLesson }: Props) {
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
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <CheckIcon />

        {/* 타이틀 */}
        <h2 style={{ fontSize: 24, fontWeight: 600, color: c.gray900, letterSpacing: '-0.72px', marginBottom: 32, lineHeight: 1.4 }}>
          출결이 종료됐어요
        </h2>

        {/* 통계 박스 3개 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
          {[
            { label: '출석', value: summary.present, color: c.primary500 },
            { label: '지각', value: summary.late, color: c.gray700 },
            { label: '결석', value: summary.absent, color: c.gray700 },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                flex: 1,
                background: c.gray50,
                borderRadius: 12,
                paddingTop: 16,
                paddingBottom: 24,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 500, color, letterSpacing: '-0.42px' }}>{label}</span>
                <span style={{ fontSize: 28, fontWeight: 600, color, letterSpacing: '-0.84px', lineHeight: 1 }}>{value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 수업 입력하기 버튼 */}
        <button
          onClick={onGoLesson ?? onClose}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          수업 입력하기
          <ArrowRight />
        </button>
      </div>
    </div>
  )
}
