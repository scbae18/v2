'use client'

import { useState } from 'react'
import {
  MOCK_ATTENDANCE_SESSION,
  type AttendanceStatus,
  updateAttendanceStatus,
} from '@/mock/attendance.mock'
import { mockClasses } from '@/mocks/_db'
import { colors } from '@/styles/tokens/colors'
import Text from '@/components/common/Text'
import Button from '@/components/common/Button'

const c = colors

type Step = 'select' | 'setup' | 'active'

const STATUS_OPTIONS: AttendanceStatus[] = ['출석', '지각', '미확인']
const STATUS_COLORS: Record<AttendanceStatus, { bg: string; text: string }> = {
  출석: { bg: c.success50, text: c.success500 },
  지각: { bg: c.warning50, text: c.warning500 },
  미확인: { bg: c.gray50, text: c.gray500 },
}

export default function AttendancePage() {
  const [step, setStep] = useState<Step>('select')
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null)
  const [startTime, setStartTime] = useState('16:00')
  const [endTime, setEndTime] = useState('16:20')
  const [session, setSession] = useState(MOCK_ATTENDANCE_SESSION)
  const [, forceUpdate] = useState(0)

  const activeClasses = mockClasses.filter((c) => !c.ended_at)

  const handleStartSession = () => {
    setStep('active')
  }

  const handleManualChange = (studentId: number, status: AttendanceStatus) => {
    updateAttendanceStatus(session.sessionId, studentId, status)
    setSession({ ...MOCK_ATTENDANCE_SESSION })
    forceUpdate((n) => n + 1)
  }

  const checkedCount = session.students.filter((s) => s.status === '출석' || s.status === '지각').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <Text variant="display" as="h1">출결</Text>

      {/* STEP 1: 수업 선택 */}
      {step === 'select' && (
        <div>
          <div style={{ marginBottom: 16 }}><Text variant="headingMd">수업 선택</Text></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, maxWidth: 640 }}>
            {activeClasses.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                style={{
                  padding: '16px 18px', borderRadius: 12, textAlign: 'left', cursor: 'pointer',
                  border: `2px solid ${selectedClassId === cls.id ? c.primary500 : c.gray100}`,
                  background: selectedClassId === cls.id ? c.primary50 : c.white,
                  transition: '0.15s',
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 700, color: c.gray900 }}>{cls.name}</div>
                <div style={{ fontSize: 12, color: c.gray500, marginTop: 4 }}>학생 {cls.student_count}명</div>
              </button>
            ))}
          </div>
          <Button
            variant="primary" size="md"
            onClick={() => selectedClassId && setStep('setup')}
            disabled={!selectedClassId}
            style={{ marginTop: 20 }}
          >
            다음 →
          </Button>
        </div>
      )}

      {/* STEP 2: 출결 시간 설정 */}
      {step === 'setup' && (
        <div style={{ maxWidth: 440 }}>
          <div style={{ marginBottom: 20 }}><Text variant="headingMd">출결 시간 설정</Text></div>
          <div style={{ background: c.white, borderRadius: 16, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: c.gray700, marginBottom: 8 }}>수업 시작 시간</div>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${c.gray100}`, fontSize: 15, outline: 'none' }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: c.gray700, marginBottom: 8 }}>출결 마감 시간</div>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${c.gray100}`, fontSize: 15, outline: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <Button variant="ghost" size="md" onClick={() => setStep('select')}>이전</Button>
            <Button variant="primary" size="md" onClick={handleStartSession}>출결 시작</Button>
          </div>
        </div>
      )}

      {/* STEP 3: 출결 진행 중 */}
      {step === 'active' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* 코드 + 링크 박스 */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {/* 코드 */}
            <div style={{ background: c.primary500, borderRadius: 16, padding: '24px 28px', color: c.white, flex: '0 0 auto', textAlign: 'center' }}>
              <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>출결 코드</div>
              <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: 8 }}>{session.code}</div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>화면에 보여주세요</div>
            </div>

            {/* 진행 현황 */}
            <div style={{ background: c.white, borderRadius: 16, padding: '20px 24px', flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 13, color: c.gray500, marginBottom: 4 }}>{session.className} · {session.lessonDate}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: c.primary500 }}>
                {checkedCount} <span style={{ fontSize: 16, color: c.gray500, fontWeight: 400 }}>/ {session.students.length}명 확인</span>
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 12, color: c.gray500, marginBottom: 6 }}>학생 링크 (공유용)</div>
                <div style={{ background: c.gray50, borderRadius: 8, padding: '8px 12px', fontSize: 12, color: c.primary500, wordBreak: 'break-all' }}>
                  {session.studentLink}
                </div>
              </div>
            </div>
          </div>

          {/* 학생 출결 현황 + 수기 수정 */}
          <div style={{ background: c.white, borderRadius: 16, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ marginBottom: 16 }}><Text variant="headingMd">출결 현황 (수기 수정 가능)</Text></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {session.students.map((student) => (
                <div key={student.studentId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: c.gray50, borderRadius: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: c.gray900 }}>{student.name}</div>
                    {student.checkedAt && <div style={{ fontSize: 11, color: c.gray500 }}>{student.checkedAt} 확인</div>}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {STATUS_OPTIONS.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleManualChange(student.studentId, status)}
                        style={{
                          padding: '5px 12px', borderRadius: 16, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                          background: student.status === status ? STATUS_COLORS[status].bg : c.white,
                          color: student.status === status ? STATUS_COLORS[status].text : c.gray300,
                          border: `1.5px solid ${student.status === status ? STATUS_COLORS[status].text : c.gray100}`,
                        }}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <Button variant="secondary" size="sm" onClick={() => setStep('select')}>새 출결 시작</Button>
              <Button variant="primary" size="sm" onClick={() => alert('출결 완료 처리됐어요. (mock)')}>출결 종료</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
