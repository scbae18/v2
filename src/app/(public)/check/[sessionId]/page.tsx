'use client'

import { use, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { colors } from '@/styles/tokens/colors'
import {
  getSession,
  getRemainingTimeStr,
  submitAttendanceCode,
  type AttendanceSession,
  type AttendanceStatus,
} from '@/mock/attendance.mock'

const c = colors

type PageState = 'loading' | 'input' | 'success' | 'expired' | 'already'

// ── 아이콘 ──────────────────────────────────────────────────────────

/** 피그마 - 성공: primary500 원 + 흰 체크 */
function CheckIcon() {
  return (
    <div style={{ width: 80, height: 80 }}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="40" fill={c.primary500} />
        <path d="M24 40l12 12 20-24" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/** 피그마 - 마감: primary100 원 + primary500 느낌표 */
function ExpiredIcon() {
  return (
    <div style={{ width: 80, height: 80 }}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="40" fill={c.primary100} />
        <rect x="37" y="22" width="6" height="26" rx="3" fill={c.primary500} />
        <circle cx="40" cy="57" r="4" fill={c.primary500} />
      </svg>
    </div>
  )
}

// ── 상태 포맷 ────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    const m = d.getMonth() + 1
    const day = d.getDate()
    const week = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
    return `${m}월 ${day}일(${week})`
  } catch {
    return dateStr
  }
}

const STATUS_LABEL: Record<AttendanceStatus, string> = {
  출석: '출석', 지각: '지각', 결석: '결석', 미확인: '미확인',
}
const STATUS_COLOR: Record<AttendanceStatus, string> = {
  출석: c.primary500, 지각: c.warning500, 결석: c.error500, 미확인: c.gray500,
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────────
export default function CheckPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params)
  const searchParams = useSearchParams()
  const studentId = Number(searchParams.get('studentId') ?? 0)

  const [session, setSession] = useState<AttendanceSession | null>(null)
  const [pageState, setPageState] = useState<PageState>('loading')
  const [digits, setDigits] = useState<string[]>(['', '', '', ''])
  const [error, setError] = useState(false)
  const [remaining, setRemaining] = useState('--:--')
  const [finalStatus, setFinalStatus] = useState<AttendanceStatus>('출석')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null])

  // 마운트 후 localStorage 에서 세션 로드
  useEffect(() => {
    const s = getSession(sessionId)
    setSession(s)

    if (!s || !s.isActive || Date.now() > s.expiresAt) {
      setPageState('expired')
      return
    }
    const student = s.students.find((st) => st.studentId === studentId)
    if (student && student.status !== '미확인') {
      setFinalStatus(student.status)
      setPageState('already')
    } else {
      setPageState('input')
      setRemaining(getRemainingTimeStr(s.expiresAt))
    }
  }, [sessionId, studentId])

  // 카운트다운
  useEffect(() => {
    if (pageState !== 'input' || !session) return
    const tick = setInterval(() => {
      const r = getRemainingTimeStr(session.expiresAt)
      setRemaining(r)
      if (r === '00:00') { setPageState('expired'); clearInterval(tick) }
    }, 1000)
    return () => clearInterval(tick)
  }, [pageState, session])

  const handleDigit = (idx: number, val: string) => {
    const v = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[idx] = v
    setDigits(next)
    setError(false)
    if (v && idx < 3) inputRefs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
  }

  const handleSubmit = () => {
    const code = digits.join('')
    if (code.length < 4) { setError(true); return }
    const result = submitAttendanceCode(sessionId, studentId, code)
    if (result.success) {
      const updated = getSession(sessionId)
      setSession(updated)
      const student = updated?.students.find((s) => s.studentId === studentId)
      setFinalStatus(student?.status ?? '출석')
      setPageState('success')
    } else {
      setError(true)
      setDigits(['', '', '', ''])
      setTimeout(() => inputRefs.current[0]?.focus(), 50)
    }
  }

  const filledCount = digits.filter(Boolean).length

  // ── 로딩 ──
  if (pageState === 'loading') {
    return (
      <Shell>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: '50%',
              border: `3px solid ${c.primary100}`,
              borderTopColor: c.primary500,
              animation: 'spin 0.7s linear infinite',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </Shell>
    )
  }

  // ── 마감 — 피그마 iPhone 3 ──
  if (pageState === 'expired') {
    return (
      <Shell>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30, padding: '0 24px' }}>
          <ExpiredIcon />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <p style={{ fontSize: 24, fontWeight: 600, color: c.gray900, letterSpacing: '-0.72px', lineHeight: 1.4, textAlign: 'center' }}>
              출결이 마감됐어요
            </p>
            <p style={{ fontSize: 14, fontWeight: 500, color: c.gray500, letterSpacing: '-0.42px', lineHeight: 1.6, textAlign: 'center' }}>
              출결 가능 시간이 지났어요.<br />선생님께 직접 문의해주세요.
            </p>
          </div>
        </div>
      </Shell>
    )
  }

  // ── 이미 처리됨 (already) → 성공 화면과 동일하게 ──
  if (pageState === 'already') {
    const student = session?.students.find((s) => s.studentId === studentId)
    return (
      <Shell>
        <SuccessContent
          className={session?.className ?? ''}
          lessonDate={session?.lessonDate ?? ''}
          status={finalStatus}
          studentName={student?.name}
        />
      </Shell>
    )
  }

  // ── 성공 — 피그마 iPhone 1 ──
  if (pageState === 'success') {
    const student = session?.students.find((s) => s.studentId === studentId)
    return (
      <Shell>
        <SuccessContent
          className={session?.className ?? ''}
          lessonDate={session?.lessonDate ?? ''}
          status={finalStatus}
          studentName={student?.name}
        />
      </Shell>
    )
  }

  // ── 코드 입력 — 피그마 iPhone 2 / 4 (에러 상태) ──
  return (
    <Shell>
      {/* 본문 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>

        {/* 반 배지 — primary100 bg, primary400 text, rounded-4 */}
        {session && (
          <div style={{ background: c.primary100, borderRadius: 4, padding: '4px 8px', marginBottom: 32 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: c.primary400, letterSpacing: '-0.36px' }}>
              {session.className}
            </span>
          </div>
        )}

        {/* 타이틀 */}
        <h1 style={{ fontSize: 24, fontWeight: 600, color: c.gray900, letterSpacing: '-0.72px', lineHeight: 1.4, textAlign: 'center', marginBottom: 20 }}>
          출결 코드를 입력해주세요
        </h1>

        {/* 부제목 */}
        <p style={{ fontSize: 14, fontWeight: 500, color: c.gray500, letterSpacing: '-0.42px', lineHeight: 1.6, textAlign: 'center', marginBottom: 28 }}>
          선생님께 받은<br />4자리 코드를 입력해주세요
        </p>

        {/* 남은 시간 */}
        <p style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.42px', marginBottom: 28, textAlign: 'center' }}>
          <span style={{ color: c.gray500 }}>남은 시간 </span>
          <span style={{ color: c.primary500, fontWeight: 600 }}>{remaining}</span>
        </p>

        {/* 4자리 입력 박스 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: error ? 12 : 0 }}>
          {digits.map((d, i) => {
            const isFilled = d !== ''
            const isActive = i === filledCount && filledCount < 4
            const borderColor = error
              ? c.error500
              : isFilled || isActive ? c.primary500 : c.gray100
            const borderWidth = (error || isFilled || isActive) ? '1.5px' : '1px'
            return (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={{
                  width: 63,
                  height: 81,
                  textAlign: 'center',
                  fontSize: 28,
                  fontWeight: 700,
                  color: error ? c.error500 : c.gray900,
                  letterSpacing: '-0.84px',
                  borderRadius: 12,
                  border: `${borderWidth} solid ${borderColor}`,
                  background: c.white,
                  outline: 'none',
                  caretColor: 'transparent',
                  cursor: 'text',
                  transition: 'border-color 0.15s',
                }}
                autoFocus={i === 0}
              />
            )
          })}
        </div>

        {/* 에러 메시지 — 피그마 iPhone 4 */}
        {error && (
          <p style={{ fontSize: 14, fontWeight: 500, color: c.error500, letterSpacing: '-0.42px', textAlign: 'center', marginTop: 0 }}>
            코드가 올바르지 않아요
          </p>
        )}
      </div>

      {/* 확인 버튼 — fixed bottom, 342px, rounded-16 */}
      <div style={{ padding: '16px 24px 40px' }}>
        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            maxWidth: 342,
            display: 'block',
            margin: '0 auto',
            padding: '16px 12px',
            borderRadius: 16,
            border: 'none',
            background: filledCount === 4 ? c.primary500 : c.gray100,
            color: filledCount === 4 ? c.white : c.gray500,
            fontSize: 16,
            fontWeight: 600,
            cursor: filledCount === 4 ? 'pointer' : 'default',
            letterSpacing: '-0.48px',
            transition: 'background 0.15s',
          }}
        >
          확인
        </button>
      </div>
    </Shell>
  )
}

// ── 성공 화면 컴포넌트 — 피그마 iPhone 1 ──────────────────────────
function SuccessContent({
  className,
  lessonDate,
  status,
  studentName,
}: {
  className: string
  lessonDate: string
  status: AttendanceStatus
  studentName?: string
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
      {/* 아이콘 + 텍스트 — gap 30 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, marginBottom: 40 }}>
        <CheckIcon />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <p style={{ fontSize: 24, fontWeight: 600, color: c.gray900, letterSpacing: '-0.72px', lineHeight: 1.4, textAlign: 'center' }}>
            출결이 확인됐어요
          </p>
          <p style={{ fontSize: 14, fontWeight: 500, color: c.gray500, letterSpacing: '-0.42px', lineHeight: 1.6, textAlign: 'center' }}>
            선생님께 출석이<br />자동으로 전달됐어요
          </p>
        </div>
      </div>

      {/* 정보 카드 — gray50 bg, rounded-24, 280px wide, 123px height */}
      <div
        style={{
          width: 280,
          background: c.gray50,
          borderRadius: 24,
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {[
          { label: '반', value: className, color: c.gray900 },
          { label: '날짜', value: formatDate(lessonDate), color: c.gray900 },
          { label: '상태', value: STATUS_LABEL[status], color: STATUS_COLOR[status] },
        ].map(({ label, value, color }, idx) => (
          <div
            key={label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: idx === 0 ? 0 : 14,
              paddingBottom: idx === 2 ? 0 : 14,
              borderBottom: idx < 2 ? `1px solid ${c.gray100}` : 'none',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 500, color: c.gray700, letterSpacing: '-0.36px' }}>
              {label}
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color, letterSpacing: '-0.36px' }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {studentName && (
        <p style={{ marginTop: 20, fontSize: 13, fontWeight: 500, color: c.gray300, letterSpacing: '-0.39px' }}>
          {studentName}님
        </p>
      )}
    </div>
  )
}

// ── 전체 화면 레이아웃 ─────────────────────────────────────────────
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100dvh', background: '#FAFAFA', display: 'flex', flexDirection: 'column', maxWidth: 390, margin: '0 auto' }}>
      {children}
    </div>
  )
}
