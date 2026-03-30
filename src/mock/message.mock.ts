/**
 * 알림톡 / 문자 커스텀 mock 데이터
 */

export interface MessageTemplate {
  intro: string
  outro: string
}

export interface SentMessage {
  id: number
  studentId: number
  studentName: string
  sentAt: string
  type: 'lesson' | 'attendance'
  preview: string
  isExpired: boolean
}

export const DEFAULT_MESSAGE_TEMPLATE: MessageTemplate = {
  intro: '안녕하세요, {studentName} 학부모님!',
  outro: '항상 응원합니다. 감사합니다 😊',
}

export const LESSON_MESSAGE_TEMPLATE = `{intro}

오늘 {className} 수업 결과를 안내드립니다.

📅 수업일: {lessonDate}
✅ 출결: {attendance}
📝 시험 점수: {testScore}점
📚 오늘 학습 내용: {lessonContent}
📌 다음 수업 범위: {nextRange}
✏️ 과제: {homework}

📊 학생 대시보드에서 자세한 내용을 확인하세요:
{dashboardLink}

{outro}`

export const ATTENDANCE_MESSAGE_TEMPLATE = `{intro}

{className} 수업 출결 안내드립니다.

지금 아래 링크에서 출결 코드를 입력해주세요:
🔗 {attendanceLink}

코드 입력 마감: {endTime}

{outro}`

// 수업별 발송 미리보기 샘플 (학생 1 - 김민준)
export const MOCK_LESSON_MESSAGE_PREVIEW = `안녕하세요, 김민준 학부모님!

오늘 미적분 A반 수업 결과를 안내드립니다.

📅 수업일: 3월 30일(월)
✅ 출결: 출석
📝 시험 점수: 85점
📚 오늘 학습 내용: 극한의 개념과 성질 (미적분 1단원)
📌 다음 수업 범위: 연속함수와 연속성
✏️ 과제: 완료

📊 학생 대시보드에서 자세한 내용을 확인하세요:
http://localhost:3001/parent/abc-123-def-456

항상 응원합니다. 감사합니다 😊`

export const MOCK_ATTENDANCE_MESSAGE_PREVIEW = `안녕하세요, 김민준 학부모님!

미적분 A반 수업 출결 안내드립니다.

지금 아래 링크에서 출결 코드를 입력해주세요:
🔗 http://localhost:3001/attendance/student/sess-abc-001

코드 입력 마감: 16:20

항상 응원합니다. 감사합니다 😊`

export const MOCK_SENT_MESSAGES: SentMessage[] = [
  { id: 1, studentId: 1, studentName: '김민준', sentAt: '2026-03-30 16:30', type: 'lesson', preview: '3월 30일 미적분 A반 수업 결과: 출석 ✓ 시험 점수 85점...', isExpired: false },
  { id: 2, studentId: 2, studentName: '이서연', sentAt: '2026-03-30 16:30', type: 'lesson', preview: '3월 30일 미적분 A반 수업 결과: 출석 ✓ 시험 점수 92점...', isExpired: false },
  { id: 3, studentId: 1, studentName: '김민준', sentAt: '2026-03-25 17:00', type: 'lesson', preview: '3월 25일 미적분 A반 수업 결과: 출석 ✓ 시험 점수 80점...', isExpired: false },
  { id: 4, studentId: 4, studentName: '최하은', sentAt: '2026-03-24 17:15', type: 'lesson', preview: '3월 24일 미적분 B반 수업 결과: 출석 ✓ 시험 점수 97점...', isExpired: true },
  { id: 5, studentId: 1, studentName: '김민준', sentAt: '2026-03-30 15:55', type: 'attendance', preview: '미적분 A반 출결 코드 안내: http://localhost:3001/attendance/...', isExpired: true },
]

/** 인트로/아웃트로 적용해 실시간 미리보기 생성 */
export const buildMessagePreview = (
  template: string,
  vars: Record<string, string>
): string => {
  let result = template
  Object.entries(vars).forEach(([key, val]) => {
    result = result.replaceAll(`{${key}}`, val)
  })
  return result
}
