'use client'

import { use, useState, useEffect } from 'react'
import { getSession, submitAttendanceCode, type AttendanceSession } from '@/mock/attendance.mock'
import { colors } from '@/styles/tokens/colors'

const c = colors

export default function StudentCheckPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params)
  const [session, setSession] = useState<AttendanceSession | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)
  const [code, setCode] = useState('')
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    // 세션 로드 (동적 세션 or 기본 데모 세션)
    const s = getSession(sessionId)
    setSession(s)
    // 2초마다 세션 상태 갱신 (선생님이 수기 수정하면 반영)
    const timer = setInterval(() => {
      const updated = getSession(sessionId)
      if (updated) setSession({ ...updated, students: [...updated.students] })
    }, 2000)
    return () => clearInterval(timer)
  }, [sessionId])

  if (!session) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.background }}>
        <div style={{ textAlign: 'center', color: c.gray500 }}>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>세션을 찾을 수 없어요</div>
          <div style={{ fontSize: 13 }}>선생님에게 올바른 링크를 요청해주세요.</div>
        </div>
      </div>
    )
  }

  const handleSubmit = () => {
    if (!selectedStudentId) return
    const res = submitAttendanceCode(sessionId, selectedStudentId, code)
    setResult(res)
    if (res.success) {
      setCode('')
      // 즉시 화면 갱신
      const updated = getSession(sessionId)
      if (updated) setSession({ ...updated, students: [...updated.students] })
    }
  }

  return (
    <div style={{ background: c.background, minHeight: '100vh', maxWidth: 480, margin: '0 auto', padding: '0 0 32px' }}>
      <div style={{ background: c.primary500, padding: '32px 20px 24px', color: c.white, textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{session.className}</div>
        <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>{session.lessonDate} 출결 확인</div>
      </div>

      <div style={{ padding: '24px 16px' }}>
        {/* 학생 선택 */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: c.gray900, marginBottom: 12 }}>내 이름 선택</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {session.students.map((s) => {
              const isChecked = s.status === '출석'
              const isSelected = selectedStudentId === s.studentId
              return (
                <button
                  key={s.studentId}
                  onClick={() => !isChecked && setSelectedStudentId(s.studentId)}
                  disabled={isChecked}
                  style={{
                    padding: '14px', borderRadius: 12, border: `2px solid ${isSelected ? c.primary500 : isChecked ? c.success500 : c.gray100}`,
                    background: isChecked ? c.success50 : isSelected ? c.primary50 : c.white,
                    color: isChecked ? c.success500 : isSelected ? c.primary500 : c.gray700,
                    fontSize: 15, fontWeight: 600, cursor: isChecked ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  {isChecked && <span>✓</span>}
                  {s.name}
                  {isChecked && <span style={{ fontSize: 11, fontWeight: 400 }}>출석 완료</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* 코드 입력 */}
        {selectedStudentId && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: c.gray900, marginBottom: 12 }}>
              출결 코드 {session.code.length}자리 입력
            </div>
            <input
              type="number"
              value={code}
              onChange={(e) => { setCode(e.target.value.slice(0, session.code.length)); setResult(null) }}
              placeholder={session.code.replace(/./g, '○')}
              style={{
                width: '100%', padding: '16px', fontSize: 28, letterSpacing: 8, textAlign: 'center',
                border: `2px solid ${result ? (result.success ? c.success500 : c.error500) : c.gray200}`,
                borderRadius: 12, outline: 'none', boxSizing: 'border-box',
                background: result?.success ? c.success50 : result ? c.error50 : c.white,
              }}
            />

            {result && (
              <div style={{
                marginTop: 12, padding: '12px 16px', borderRadius: 10,
                background: result.success ? c.success50 : c.error50,
                color: result.success ? c.success500 : c.error500,
                fontSize: 14, fontWeight: 600, textAlign: 'center',
              }}>
                {result.success ? '✓ ' : '✕ '}{result.message}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={code.length < session.code.length || !!result?.success}
              style={{
                marginTop: 16, width: '100%', padding: '16px', borderRadius: 12,
                background: code.length < session.code.length || result?.success ? c.gray100 : c.primary500,
                color: code.length < session.code.length || result?.success ? c.gray300 : c.white,
                fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer',
              }}
            >
              {result?.success ? '출석 완료!' : '코드 확인'}
            </button>
          </div>
        )}

        {!selectedStudentId && (
          <p style={{ textAlign: 'center', color: c.gray300, fontSize: 13, marginTop: 12 }}>
            위에서 내 이름을 먼저 선택해주세요.
          </p>
        )}
      </div>
    </div>
  )
}
