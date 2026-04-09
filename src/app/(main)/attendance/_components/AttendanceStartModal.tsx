'use client'

import { useState } from 'react'
import { colors } from '@/styles/tokens/colors'

const c = colors

const DURATION_PRESETS = [5, 10, 15, 20] as const

// 스톱워치 SVG (피그마 타이머 아이콘 모사)
function TimerIcon() {
  return (
    <div style={{ width: 60, height: 60, position: 'relative', marginBottom: 24 }}>
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
  className: string
  studentCount: number
  onStart: (durationMinutes: number) => void
  onCancel: () => void
}

export default function AttendanceStartModal({ className, studentCount, onStart, onCancel }: Props) {
  const [selected, setSelected] = useState<number>(15)
  const [customInput, setCustomInput] = useState('')
  const [isCustom, setIsCustom] = useState(false)

  const effectiveDuration = isCustom ? (parseInt(customInput) || 0) : selected

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: c.white,
          borderRadius: 24,
          padding: '48px 48px 48px',
          width: 640,
          maxWidth: '92vw',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <TimerIcon />

        {/* 타이틀 */}
        <h2 style={{ fontSize: 24, fontWeight: 600, color: c.gray900, letterSpacing: '-0.72px', lineHeight: 1.4, marginBottom: 12 }}>
          출결을 시작할게요
        </h2>
        <p style={{ fontSize: 14, fontWeight: 500, color: c.gray500, letterSpacing: '-0.42px', marginBottom: 40 }}>
          {className} {studentCount}명에게 알림톡이 발송되고 출결이 시작돼요.
        </p>

        {/* 제한 시간 */}
        <p style={{ fontSize: 18, fontWeight: 600, color: c.gray900, letterSpacing: '-0.54px', marginBottom: 16 }}>
          제한 시간
        </p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
          {DURATION_PRESETS.map((min) => {
            const isActive = !isCustom && selected === min
            return (
              <button
                key={min}
                onClick={() => { setSelected(min); setIsCustom(false) }}
                style={{
                  width: 64,
                  height: 32,
                  borderRadius: 8,
                  border: 'none',
                  background: isActive ? c.primary50 : c.gray50,
                  color: isActive ? c.primary500 : c.gray500,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '-0.42px',
                }}
              >
                {min}분
              </button>
            )
          })}
          <button
            onClick={() => setIsCustom(true)}
            style={{
              width: 64,
              height: 32,
              borderRadius: 8,
              border: 'none',
              background: isCustom ? c.primary50 : c.gray50,
              color: isCustom ? c.primary500 : c.gray500,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '-0.42px',
            }}
          >
            직접 입력
          </button>
        </div>

        {isCustom && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <input
              type="number"
              min={1}
              max={60}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="분"
              autoFocus
              style={{
                width: 80,
                height: 32,
                padding: '0 12px',
                borderRadius: 8,
                border: `1.5px solid ${c.primary300}`,
                fontSize: 14,
                outline: 'none',
                color: c.gray900,
              }}
            />
            <span style={{ fontSize: 14, color: c.gray500 }}>분</span>
          </div>
        )}

        {/* 안내 박스 — primary50 배경 */}
        <div
          style={{
            background: c.primary50,
            borderRadius: 12,
            padding: '20px 20px',
            marginBottom: 40,
            height: 80,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          {[
            '시간 초과 시 미확인 학생은 자동으로 결석 처리돼요.',
            '출결 후 수업 입력 화면에서 직접 수정할 수 있어요.',
          ].map((text) => (
            <div key={text} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 14, color: c.gray700, lineHeight: 1.4 }}>•</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: c.gray700, lineHeight: 1.4, letterSpacing: '-0.42px' }}>{text}</span>
            </div>
          ))}
        </div>

        {/* 버튼 행 */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '16px 12px',
              borderRadius: 12,
              border: 'none',
              background: c.gray50,
              color: c.gray500,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '-0.48px',
            }}
          >
            취소
          </button>
          <button
            onClick={() => effectiveDuration > 0 && onStart(effectiveDuration)}
            disabled={effectiveDuration <= 0}
            style={{
              flex: 1,
              padding: '16px 12px',
              borderRadius: 12,
              border: 'none',
              background: effectiveDuration > 0 ? c.primary500 : c.gray100,
              color: effectiveDuration > 0 ? c.white : c.gray300,
              fontSize: 16,
              fontWeight: 600,
              cursor: effectiveDuration > 0 ? 'pointer' : 'not-allowed',
              letterSpacing: '-0.48px',
            }}
          >
            출결 시작 · {effectiveDuration > 0 ? `${effectiveDuration}분` : '-'}
          </button>
        </div>
      </div>
    </div>
  )
}
