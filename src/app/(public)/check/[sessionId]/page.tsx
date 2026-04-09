'use client'

import { use, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { colors } from '@/styles/tokens/colors'
import {
  getSession,
  getRemainingTimeStr,
  submitAttendanceCode,
  type AttendanceSession,
} from '@/mock/attendance.mock'

const c = colors

type PageState = 'loading' | 'input' | 'success' | 'expired' | 'already'

export default function CheckPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params)
  const searchParams = useSearchParams()
  const studentId = Number(searchParams.get('studentId') ?? 0)

  // 서버/클라이언트 hydration 불일치 방지 — 마운트 후 localStorage에서 읽음
  const [session, setSession] = useState<AttendanceSession | null>(null)
  const [pageState, setPageState] = useState<PageState>('loading')
  const [digits, setDigits] = useState<string[]>(['', '', '', ''])
  const [error, setError] = useState(false)
  const [remaining, setRemaining] = useState('--:--')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null])

  // 마운트 후 세션 초기화
  useEffect(() => {
    const s = getSession(sessionId)
    setSession(s)

    if (!s || !s.isActive || Date.now() > s.expiresAt) {
      setPageState('expired')
      return
    }

    const student = s.students.find((st) => st.studentId === studentId)
    if (student && student.status !== '미확인') {
      setPageState('already')
    } else {
      setPageState('input')
      setRemaining(getRemainingTimeStr(s.expiresAt))
    }
  }, [sessionId, studentId])

  // 카운트다운 타이머
  useEffect(() => {
    if (pageState !== 'input' || !session) return
    const tick = setInterval(() => {
      const r = getRemainingTimeStr(session.expiresAt)
      setRemaining(r)
      if (r === '00:00') {
        setPageState('expired')
        clearInterval(tick)
      }
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
      // 세션 다시 읽어서 student 상태 반영
      setSession(getSession(sessionId))
      setPageState('success')
    } else {
      setError(true)
      setDigits(['', '', '', ''])
      inputRefs.current[0]?.focus()
    }
  }

  // ── 로딩 ──────────────────────────────────────────────────────────
  if (pageState === 'loading') {
    return (
      <FullScreenLayout>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: `3px solid ${c.primary200}`, borderTopColor: c.primary500, animation: 'spin 0.8s linear infinite' }} />
        </div>
      </FullScreenLayout>
    )
  }

  // ── 종료됨 ─────────────────────────────────────────────────────────
  if (pageState === 'expired') {
    return (
      <FullScreenLayout>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: c.gray100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke={c.gray500} strokeWidth="2"/>
              <path d="M12 8v4M12 16h.01" stroke={c.gray500} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p style={{ fontSize: 22, fontWeight: 600, color: c.gray900, letterSpacing: '-0.66px', textAlign: 'center' }}>
            출결 시간이 종료됐어요
          </p>
          <p style={{ fontSize: 14, fontWeight: 500, color: c.gray500, letterSpacing: '-0.42px', textAlign: 'center', lineHeight: 1.6 }}>
            선생님께 문의해주세요
          </p>
        </div>
      </FullScreenLayout>
    )
  }

  // ── 이미 처리됨 ────────────────────────────────────────────────────
  if (pageState === 'already') {
    const student = session?.students.find((s) => s.studentId === studentId)
    const statusStyle =
      student?.status === '출석' ? { bg: c.success50, text: c.success500, label: '출석' }
      : student?.status === '지각' ? { bg: c.warning50, text: c.warning500, label: '지각' }
      : { bg: c.error50, text: c.error500, label: '결석' }
    return (
      <FullScreenLayout>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: statusStyle.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke={statusStyle.text} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p style={{ fontSize: 22, fontWeight: 600, color: c.gray900, letterSpacing: '-0.66px', textAlign: 'center' }}>
            이미 출결 처리됐어요
          </p>
          <span style={{ background: statusStyle.bg, color: statusStyle.text, borderRadius: 8, padding: '6px 16px', fontSize: 14, fontWeight: 600 }}>
            {statusStyle.label}
          </span>
        </div>
      </FullScreenLayout>
    )
  }

  // ── 성공 ───────────────────────────────────────────────────────────
  if (pageState === 'success') {
    const student = session?.students.find((s) => s.studentId === studentId)
    const isLate = student?.status === '지각'
    return (
      <FullScreenLayout>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: isLate ? c.warning50 : c.success50, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke={isLate ? c.warning500 : c.success500} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p style={{ fontSize: 24, fontWeight: 600, color: c.gray900, letterSpacing: '-0.72px', textAlign: 'center' }}>
            {isLate ? '지각 처리됐어요' : '출석 완료!'}
          </p>
          <p style={{ fontSize: 14, fontWeight: 500, color: c.gray500, letterSpacing: '-0.42px', textAlign: 'center', lineHeight: 1.6 }}>
            {student?.name}님의 출결이 확인됐어요
          </p>
        </div>
      </FullScreenLayout>
    )
  }

  // ── 코드 입력 화면 ─────────────────────────────────────────────────
  const filledCount = digits.filter(Boolean).length

  return (
    <FullScreenLayout>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: 0 }}>

        {/* 반 배지 */}
        {session && (
          <div style={{ background: c.primary100, borderRadius: 4, padding: '4px 8px', marginBottom: 24 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: c.primary400, letterSpacing: '-0.36px' }}>
              {session.className}
            </span>
          </div>
        )}

        {/* 타이틀 */}
        <h1 style={{ fontSize: 24, fontWeight: 600, color: c.gray900, letterSpacing: '-0.72px', textAlign: 'center', lineHeight: 1.4, marginBottom: 16 }}>
          출결 코드를 입력해주세요
        </h1>

        {/* 부제목 */}
        <p style={{ fontSize: 14, fontWeight: 500, color: c.gray500, letterSpacing: '-0.42px', textAlign: 'center', lineHeight: 1.6, marginBottom: 40 }}>
          선생님께 받은<br />4자리 코드를 입력해주세요
        </p>

        {/* 남은 시간 */}
        <p style={{ fontSize: 14, fontWeight: 500, color: c.gray500, letterSpacing: '-0.42px', marginBottom: 24 }}>
          남은 시간{' '}
          <span style={{ color: c.primary500, fontWeight: 600 }}>{remaining}</span>
        </p>

        {/* 4자리 입력 박스 */}
        <div style={{ display: 'flex', gap: 8 }}>
          {digits.map((d, i) => {
            const isFilled = d !== ''
            const isActive = i === filledCount && filledCount < 4
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
                  border: `${isFilled || isActive ? '1.5px' : '1px'} solid ${
                    error ? c.error200 : isFilled || isActive ? c.primary500 : c.gray100
                  }`,
                  background: c.white,
                  outline: 'none',
                  caretColor: 'transparent',
                  cursor: 'text',
                }}
                autoFocus={i === 0}
              />
            )
          })}
        </div>

        {error && (
          <p style={{ fontSize: 13, color: c.error500, marginTop: 12, letterSpacing: '-0.39px' }}>
            코드가 올바르지 않아요. 다시 확인해주세요.
          </p>
        )}
      </div>

      {/* 확인 버튼 */}
      <div style={{ padding: '0 24px 32px' }}>
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
    </FullScreenLayout>
  )
}

function FullScreenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100dvh', background: '#FAFAFA', display: 'flex', flexDirection: 'column', maxWidth: 390, margin: '0 auto' }}>
      {children}
    </div>
  )
}
