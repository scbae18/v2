/**
 * 출결 mock 데이터
 * 코드 기반 자동 출결 흐름
 */

export type AttendanceStatus = '출석' | '지각' | '결석' | '미확인'

export interface AttendanceStudentRecord {
  studentId: number
  name: string
  status: AttendanceStatus
  checkedAt: string | null
  isManual: boolean
}

export interface AttendanceSession {
  sessionId: string
  classId: number
  className: string
  lessonDate: string
  code: string
  durationMinutes: number
  startedAt: number   // Date.now() ms
  expiresAt: number   // Date.now() ms
  isActive: boolean
  students: AttendanceStudentRecord[]
}

// 진행 중인 세션 (demo) — 초기값
const DEMO_STARTED = Date.now() - 2 * 60 * 1000  // 2분 전 시작
export const MOCK_ATTENDANCE_SESSION: AttendanceSession = {
  sessionId: 'sess-abc-001',
  classId: 1,
  className: '미적분 A반',
  lessonDate: '2026-04-09',
  code: '7284',
  durationMinutes: 15,
  startedAt: DEMO_STARTED,
  expiresAt: DEMO_STARTED + 15 * 60 * 1000,
  isActive: true,
  students: [
    { studentId: 1, name: '김민준', status: '출석', checkedAt: '16:02', isManual: false },
    { studentId: 2, name: '이서연', status: '출석', checkedAt: '16:01', isManual: false },
    { studentId: 3, name: '박지호', status: '미확인', checkedAt: null, isManual: false },
    { studentId: 6, name: '강나영', status: '미확인', checkedAt: null, isManual: false },
    { studentId: 9, name: '신태양', status: '미확인', checkedAt: null, isManual: false },
  ],
}

// 동적 세션 맵 — 수업 입력 화면에서 생성한 세션 저장
const activeSessions = new Map<string, AttendanceSession>()

/** 출결 세션 생성 */
export const createAttendanceSession = (
  lessonId: number,
  classId: number,
  className: string,
  lessonDate: string,
  durationMinutes: number,
  students: { id: number; name: string }[]
): AttendanceSession => {
  const sessionId = `lesson-${lessonId}-${Date.now()}`
  const code = String(Math.floor(1000 + Math.random() * 9000))
  const now = Date.now()
  const session: AttendanceSession = {
    sessionId,
    classId,
    className,
    lessonDate,
    code,
    durationMinutes,
    startedAt: now,
    expiresAt: now + durationMinutes * 60 * 1000,
    isActive: true,
    students: students.map((s) => ({
      studentId: s.id,
      name: s.name,
      status: '미확인',
      checkedAt: null,
      isManual: false,
    })),
  }
  activeSessions.set(sessionId, session)
  return session
}

/** 세션 조회 */
export const getSession = (sessionId: string): AttendanceSession | null => {
  return activeSessions.get(sessionId) ??
    (sessionId === MOCK_ATTENDANCE_SESSION.sessionId ? MOCK_ATTENDANCE_SESSION : null)
}

/** 세션 종료 */
export const endSession = (sessionId: string): void => {
  const session = activeSessions.get(sessionId) ??
    (sessionId === MOCK_ATTENDANCE_SESSION.sessionId ? MOCK_ATTENDANCE_SESSION : null)
  if (session) {
    session.isActive = false
    // 미확인 학생은 결석으로 처리
    session.students.forEach((s) => {
      if (s.status === '미확인') s.status = '결석'
    })
  }
}

/** 코드 입력으로 출결 처리 (mock) */
export const submitAttendanceCode = (
  sessionId: string,
  studentId: number,
  code: string
): { success: boolean; status?: AttendanceStatus; message: string } => {
  const session = getSession(sessionId) ?? MOCK_ATTENDANCE_SESSION
  if (!session.isActive || Date.now() > session.expiresAt) {
    return { success: false, message: '출결이 마감됐어요.' }
  }
  const student = session.students.find((s) => s.studentId === studentId)
  if (student && (student.status === '출석' || student.status === '지각')) {
    return { success: false, message: '이미 출결 처리된 학생이에요.' }
  }
  if (code === session.code) {
    if (student) {
      const elapsed = (Date.now() - session.startedAt) / 1000 / 60
      const isLate = session.durationMinutes > 5 && elapsed > 10
      student.status = isLate ? '지각' : '출석'
      student.checkedAt = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }
    const finalStatus = student?.status ?? '출석'
    return { success: true, status: finalStatus, message: finalStatus === '지각' ? '지각 처리됐어요.' : '출석 처리됐어요.' }
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
    student.isManual = true
    if ((status === '출석' || status === '지각') && !student.checkedAt) {
      student.checkedAt = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    }
  }
}

/** 남은 시간 문자열 계산 (MM:SS) */
export const getRemainingTimeStr = (expiresAt: number): string => {
  const remaining = Math.max(0, expiresAt - Date.now())
  const totalSec = Math.floor(remaining / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
