'use client'

import { use, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  getSession,
  submitAttendanceCode,
  getRemainingTimeStr,
  type AttendanceSession,
  type AttendanceStatus,
} from '@/mock/attendance.mock'
import { colors } from '@/styles/tokens/colors'

const c = colors

type PageState = 'input' | 'success' | 'expired' | 'already'

export default function StudentCheckPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params)
  const searchParams = useSearchParams()
  const studentIdParam = searchParams.get('studentId')
  const studentId = studentIdParam ? Number(studentIdParam) : null

  const [session, setSession] = useState<AttendanceSession | null>(null)
  const [digits, setDigits] = useState<string[]>(['', '', '', ''])
  const [pageState, setPageState] = useState<PageState>('input')
  const [errorMsg, setErrorMsg] = useState('')
  const [finalStatus, setFinalStatus] = useState<AttendanceStatus | null>(null)
  const [remaining, setRemaining] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // 세션 로드
  useEffect(() => {
    const s = getSession(sessionId)
    if (!s) { setPageState('expired'); return }
    setSession(s)
    setRemaining(getRemainingTimeStr(s.expiresAt))

    // studentId가 있으면 이미 출결 여부 확인
    if (studentId) {
      const student = s.students.find((st) => st.studentId === studentId)
      if (student && (student.status === '출석' || student.status === '지각')) {
        setFinalStatus(student.status)
        setPageState('already')
      }
    }

    if (!s.isActive || Date.now() > s.expiresAt) setPageState('expired')
  }, [sessionId, studentId])

  // 타이머
  useEffect(() => {
    if (!session) return
    const tick = setInterval(() => {
      const r = getRemainingTimeStr(session.expiresAt)
      setRemaining(r)
      if (r === '00:00') {
        setPageState('expired')
        clearInterval(tick)
      }
    }, 1000)
    return () => clearInterval(tick)
  }, [session])

  const code = digits.join('')

  const handleDigit = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    setErrorMsg('')
    const next = [...digits]
    next[index] = value.slice(-1)
    setDigits(next)
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = () => {
    if (!session || code.length < 4) return
    const targetId = studentId ?? 1  // fallback for demo without studentId

    const res = submitAttendanceCode(sessionId, targetId, code)
    if (res.success) {
      setFinalStatus(res.status ?? '출석')
      setPageState('success')
    } else {
      setErrorMsg(res.message)
      setDigits(['', '', '', ''])
      inputRefs.current[0]?.focus()
    }
  }

  // ── 만료 화면
  if (pageState === 'expired') {
    return (
      <div style={{ minHeight: '100vh', background: c.background, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: c.gray50, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke={c.gray300} strokeWidth="2" />
            <path d="M12 7v5l3 3" stroke={c.gray300} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <p style={{ fontSize: 20, fontWeight: 700, color: c.gray700, letterSpacing: '-0.6px', marginBottom: 8 }}>출결이 마감됐어요</p>
        <p style={{ fontSize: 14, color: c.gray400, textAlign: 'center', lineHeight: 1.5 }}>선생님께 문의해 주세요.</p>
      </div>
    )
  }

  // ── 이미 출결 처리됨
  if (pageState === 'already') {
    return (
      <div style={{ minHeight: '100vh', background: c.background, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: c.warning50, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke={c.warning500} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p style={{ fontSize: 20, fontWeight: 700, color: c.gray700, letterSpacing: '-0.6px', marginBottom: 8 }}>이미 출결 처리된 학생이에요</p>
        <p style={{ fontSize: 14, color: c.gray400 }}>상태: {finalStatus}</p>
      </div>
    )
  }

  // ── 출결 완료 화면
  if (pageState === 'success') {
    const isLate = finalStatus === '지각'
    return (
      <div style={{ minHeight: '100vh', background: c.background, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: isLate ? c.warning50 : c.success50, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke={isLate ? c.warning500 : c.success500} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p style={{ fontSize: 22, fontWeight: 700, color: c.gray900, letterSpacing: '-0.66px', marginBottom: 10 }}>
          {isLate ? '지각 처리됐어요' : '출석 처리됐어요!'}
        </p>
        {session && (
          <p style={{ fontSize: 14, color: c.gray500, textAlign: 'center', lineHeight: 1.5 }}>
            {session.className} · {session.lessonDate}
          </p>
        )}
      </div>
    )
  }

  // ── 코드 입력 화면
  if (!session) return null

  const student = studentId ? session.students.find((s) => s.studentId === studentId) : null
  const isComplete = code.length === 4

  return (
    <div style={{ minHeight: '100vh', background: c.background, position: 'relative', maxWidth: 390, margin: '0 auto' }}>
      {/* 상단 여백 + 클래스 배지 + 타이틀 */}
      <div style={{ padding: '80px 28px 0', textAlign: 'center' }}>
        {/* 반 배지 */}
        <div style={{ display: 'inline-flex', background: c.primary400, borderRadius: 4, padding: '4px 12px', marginBottom: 24 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: c.white, letterSpacing: '-0.36px' }}>
            {session.className}
          </span>
        </div>

        {/* 타이틀 */}
        <h1 style={{ fontSize: 26, fontWeight: 700, color: c.gray900, letterSpacing: '-0.78px', lineHeight: 1.3, marginBottom: 12 }}>
          출결 코드를 입력해주세요
        </h1>

        {student && (
          <p style={{ fontSize: 15, fontWeight: 600, color: c.primary500, marginBottom: 4 }}>
            {student.name}님
          </p>
        )}

        <p style={{ fontSize: 13, color: c.gray400, lineHeight: 1.5, marginBottom: 16, letterSpacing: '-0.39px' }}>
          선생님께 받은<br />4자리 코드를 입력해주세요
        </p>

        {/* 남은 시간 */}
        <p style={{ fontSize: 14, fontWeight: 600, color: c.primary400, letterSpacing: '-0.42px', marginBottom: 40 }}>
          남은 시간 {remaining}
        </p>

        {/* 4자리 입력 박스 */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
          {digits.map((d, i) => (
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
                width: 64,
                height: 72,
                borderRadius: 14,
                border: `2px solid ${errorMsg ? c.error500 : d ? c.primary400 : c.gray100}`,
                background: c.white,
                fontSize: 28,
                fontWeight: 700,
                textAlign: 'center',
                color: c.gray900,
                outline: 'none',
                boxShadow: d ? `0 0 0 3px ${c.primary50}` : 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
            />
          ))}
        </div>

        {/* 에러 메시지 */}
        {errorMsg && (
          <p style={{ fontSize: 13, color: c.error500, fontWeight: 600, letterSpacing: '-0.39px' }}>
            {errorMsg}
          </p>
        )}
      </div>

      {/* 확인 버튼 (하단 고정) */}
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 390, padding: '16px 28px 32px', background: c.background }}>
        <button
          onClick={handleSubmit}
          disabled={!isComplete}
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: 14,
            border: 'none',
            background: isComplete ? c.primary500 : c.gray100,
            color: isComplete ? c.white : c.gray300,
            fontSize: 17,
            fontWeight: 700,
            cursor: isComplete ? 'pointer' : 'not-allowed',
            letterSpacing: '-0.51px',
            transition: 'background 0.15s',
          }}
        >
          확인
        </button>
      </div>
    </div>
  )
}
