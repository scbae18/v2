/**
 * 출결 mock 데이터
 * localStorage 기반 — 브라우저 탭 간 공유됨
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

// ── localStorage 유틸 ──────────────────────────────────────────────
const LS_KEY = 'clat_attendance_sessions'

function loadSessions(): Record<string, AttendanceSession> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function saveSessions(map: Record<string, AttendanceSession>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(LS_KEY, JSON.stringify(map))
}

function getSessionMap(): Record<string, AttendanceSession> {
  return loadSessions()
}

function putSession(session: AttendanceSession) {
  const map = loadSessions()
  map[session.sessionId] = session
  saveSessions(map)
}

// ── 세션 생성 ──────────────────────────────────────────────────────
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
  putSession(session)
  return session
}

// ── 세션 조회 ──────────────────────────────────────────────────────
export const getSession = (sessionId: string): AttendanceSession | null => {
  const map = getSessionMap()
  return map[sessionId] ?? null
}

// ── 세션 종료 ──────────────────────────────────────────────────────
export const endSession = (sessionId: string): void => {
  const map = getSessionMap()
  const session = map[sessionId]
  if (!session) return
  session.isActive = false
  session.students.forEach((s) => {
    if (s.status === '미확인') s.status = '결석'
  })
  saveSessions(map)
}

// ── 코드 입력으로 출결 처리 ────────────────────────────────────────
export const submitAttendanceCode = (
  sessionId: string,
  studentId: number,
  code: string
): { success: boolean; status?: AttendanceStatus; message: string } => {
  const map = getSessionMap()
  const session = map[sessionId]

  if (!session) return { success: false, message: '세션을 찾을 수 없어요.' }
  if (!session.isActive || Date.now() > session.expiresAt) {
    return { success: false, message: '출결이 마감됐어요.' }
  }

  const student = session.students.find((s) => s.studentId === studentId)
  if (student && (student.status === '출석' || student.status === '지각')) {
    return { success: false, message: '이미 출결 처리된 학생이에요.' }
  }

  if (code !== session.code) {
    return { success: false, message: '코드가 올바르지 않아요.' }
  }

  if (student) {
    const elapsed = (Date.now() - session.startedAt) / 1000 / 60
    // 제한 시간의 절반 이상 지났으면 지각
    const isLate = elapsed > session.durationMinutes * 0.5
    student.status = isLate ? '지각' : '출석'
    student.checkedAt = new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    })
    saveSessions(map)
  }

  const finalStatus = student?.status ?? '출석'
  return {
    success: true,
    status: finalStatus,
    message: finalStatus === '지각' ? '지각 처리됐어요.' : '출석 처리됐어요.',
  }
}

// ── 수기 상태 변경 ─────────────────────────────────────────────────
export const updateAttendanceStatus = (
  sessionId: string,
  studentId: number,
  status: AttendanceStatus
): void => {
  const map = getSessionMap()
  const session = map[sessionId]
  if (!session) return
  const student = session.students.find((s) => s.studentId === studentId)
  if (student) {
    student.status = status
    student.isManual = true
    if ((status === '출석' || status === '지각') && !student.checkedAt) {
      student.checkedAt = new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    }
    saveSessions(map)
  }
}

// ── 남은 시간 문자열 (MM:SS) ───────────────────────────────────────
export const getRemainingTimeStr = (expiresAt: number): string => {
  const remaining = Math.max(0, expiresAt - Date.now())
  const totalSec = Math.floor(remaining / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
