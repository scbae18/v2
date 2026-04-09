'use client'

import { useState } from 'react'
import { colors } from '@/styles/tokens/colors'

const c = colors

const DURATION_PRESETS = [5, 10, 15, 20] as const

function TimerIcon() {
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: c.primary50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="13" r="8" stroke={c.primary400} strokeWidth="2" />
        <path d="M12 9v4l2.5 2.5" stroke={c.primary400} strokeWidth="2" strokeLinecap="round" />
        <path d="M9 2h6M12 2v3" stroke={c.primary400} strokeWidth="2" strokeLinecap="round" />
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
          borderRadius: 20,
          padding: '40px 40px 32px',
          width: 540,
          maxWidth: '90vw',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <TimerIcon />

        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: c.gray900,
            letterSpacing: '-0.66px',
            marginBottom: 8,
          }}
        >
          출결을 시작할게요
        </h2>
        <p style={{ fontSize: 14, color: c.gray500, marginBottom: 32, letterSpacing: '-0.42px' }}>
          {className} {studentCount}명에게 알림톡이 발송되고 출결이 시작돼요.
        </p>

        {/* 제한 시간 선택 */}
        <div style={{ marginBottom: 20 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: c.gray700,
              letterSpacing: '-0.39px',
              marginBottom: 12,
            }}
          >
            제한 시간
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {DURATION_PRESETS.map((min) => (
              <button
                key={min}
                onClick={() => { setSelected(min); setIsCustom(false) }}
                style={{
                  padding: '8px 20px',
                  borderRadius: 8,
                  border: `1.5px solid ${!isCustom && selected === min ? c.primary500 : c.gray100}`,
                  background: !isCustom && selected === min ? c.primary50 : c.white,
                  color: !isCustom && selected === min ? c.primary500 : c.gray600,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '-0.42px',
                }}
              >
                {min}분
              </button>
            ))}
            <button
              onClick={() => setIsCustom(true)}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                border: `1.5px solid ${isCustom ? c.primary500 : c.gray100}`,
                background: isCustom ? c.primary50 : c.white,
                color: isCustom ? c.primary500 : c.gray600,
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
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="number"
                min={1}
                max={60}
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="분 입력"
                autoFocus
                style={{
                  width: 100,
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: `1.5px solid ${c.primary300}`,
                  fontSize: 14,
                  outline: 'none',
                  color: c.gray900,
                }}
              />
              <span style={{ fontSize: 13, color: c.gray500 }}>분</span>
            </div>
          )}
        </div>

        {/* 안내 박스 */}
        <div
          style={{
            background: c.gray50,
            borderRadius: 10,
            padding: '14px 16px',
            marginBottom: 32,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {[
            '시간 초과 시 미확인 학생은 자동으로 결석 처리돼요.',
            '출결 후 수업 입력 화면에서 직접 수정할 수 있어요.',
          ].map((text) => (
            <div
              key={text}
              style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}
            >
              <span style={{ fontSize: 12, color: c.gray400, lineHeight: 1.5, flexShrink: 0 }}>•</span>
              <span style={{ fontSize: 12, color: c.gray600, lineHeight: 1.5, letterSpacing: '-0.36px' }}>{text}</span>
            </div>
          ))}
        </div>

        {/* 하단 버튼 */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: 12,
              border: `1.5px solid ${c.gray100}`,
              background: c.white,
              color: c.gray600,
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
              flex: 2,
              padding: '16px',
              borderRadius: 12,
              border: 'none',
              background: effectiveDuration > 0 ? c.primary500 : c.gray100,
              color: effectiveDuration > 0 ? c.white : c.gray300,
              fontSize: 16,
              fontWeight: 700,
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
