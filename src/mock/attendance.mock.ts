/**
 * 출결 mock 데이터
 * 코드 기반 자동 출결 흐름
 */

export type AttendanceStatus = '출석' | '지각' | '미확인'

export interface AttendanceStudentRecord {
  studentId: number
  name: string
  status: AttendanceStatus
  checkedAt: string | null
}

export interface AttendanceSession {
  sessionId: string
  classId: number
  className: string
  lessonDate: string
  code: string
  studentLink: string
  startTime: string
  endTime: string | null
  isActive: boolean
  students: AttendanceStudentRecord[]
}

// 진행 중인 세션 (demo) — 초기값
export const MOCK_ATTENDANCE_SESSION: AttendanceSession = {
  sessionId: 'sess-abc-001',
  classId: 1,
  className: '미적분 A반',
  lessonDate: '2026-03-30',
  code: '7284',
  studentLink: 'http://localhost:3001/check/sess-abc-001',
  startTime: '16:00',
  endTime: null,
  isActive: true,
  students: [
    { studentId: 1, name: '김민준', status: '출석', checkedAt: '16:02' },
    { studentId: 2, name: '이서연', status: '출석', checkedAt: '16:01' },
    { studentId: 3, name: '박지호', status: '미확인', checkedAt: null },
    { studentId: 6, name: '강나영', status: '미확인', checkedAt: null },
    { studentId: 9, name: '신태양', status: '미확인', checkedAt: null },
  ],
}

// 동적 세션 맵 — 수업 입력 화면에서 생성한 세션 저장
const activeSessions = new Map<string, AttendanceSession>()

/** 수업에서 출결 세션 생성 */
export const createAttendanceSession = (
  lessonId: number,
  classId: number,
  className: string,
  lessonDate: string,
  students: { id: number; name: string }[]
): AttendanceSession => {
  const sessionId = `lesson-${lessonId}`
  const code = String(Math.floor(1000 + Math.random() * 9000))
  const session: AttendanceSession = {
    sessionId,
    classId,
    className,
    lessonDate,
    code,
    studentLink: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'}/check/${sessionId}`,
    startTime: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    endTime: null,
    isActive: true,
    students: students.map((s) => ({ studentId: s.id, name: s.name, status: '미확인', checkedAt: null })),
  }
  activeSessions.set(sessionId, session)
  return session
}

/** 세션 조회 (없으면 기본 데모 세션 반환) */
export const getSession = (sessionId: string): AttendanceSession | null => {
  return activeSessions.get(sessionId) ?? (sessionId === MOCK_ATTENDANCE_SESSION.sessionId ? MOCK_ATTENDANCE_SESSION : null)
}

// 과거 출결 세션 이력
export const MOCK_PAST_ATTENDANCE_SESSIONS: Pick<
  AttendanceSession,
  'sessionId' | 'classId' | 'className' | 'lessonDate' | 'isActive'
>[] = [
  { sessionId: 'sess-prev-001', classId: 1, className: '미적분 A반', lessonDate: '2026-03-23', isActive: false },
  { sessionId: 'sess-prev-002', classId: 2, className: '미적분 B반', lessonDate: '2026-03-24', isActive: false },
  { sessionId: 'sess-prev-003', classId: 1, className: '미적분 A반', lessonDate: '2026-03-25', isActive: false },
]

/** 코드 입력으로 출결 처리 (mock) */
export const submitAttendanceCode = (
  sessionId: string,
  studentId: number,
  code: string
): { success: boolean; message: string } => {
  const session = getSession(sessionId) ?? MOCK_ATTENDANCE_SESSION
  if (code === session.code) {
    const student = session.students.find((s) => s.studentId === studentId)
    if (student) {
      student.status = '출석'
      student.checkedAt = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }
    return { success: true, message: '출석 처리됐어요.' }
  }
  return { success: false, message: '코드가 올바르지 않아요.' }
}

/** 수기 출결 상태 변경 (mock) */
export const updateAttendanceStatus = (
  sessionId: string,
  studentId: number,
  status: AttendanceStatus
): void => {
  const session = getSession(sessionId) ?? MOCK_ATTENDANCE_SESSION
  const student = session.students.find((s) => s.studentId === studentId)
  if (student) {
    student.status = status
    if (status !== '미확인' && !student.checkedAt) {
      student.checkedAt = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }
  }
}
