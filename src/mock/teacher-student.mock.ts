/**
 * 선생님 — 학생별 대시보드 mock 데이터
 */

export interface StudentLessonHistory {
  id: number
  date: string
  className: string
  attendance: '출석' | '지각' | '결석' | null
  testScore: number | null
  homeworkDone: boolean | null
  lessonRecordId: number | null
}

export interface StudentIncompleteItem {
  id: number
  label: string
  lessonDate: string
  className: string
  done: boolean
}

export interface StudentNotification {
  id: number
  sentAt: string
  preview: string
  isExpired: boolean
}

export interface ScoreDataPoint {
  date: string
  score: number
}

export interface TeacherStudentDashboard {
  studentId: number
  name: string
  className: string[]
  phone: string
  parentPhone: string
  enrolledAt: string
  completionRate: number
  totalIncompleteCount: number

  // 점수 추이
  scoreHistory: ScoreDataPoint[]

  // 최근 수업 이력 타임라인
  lessonHistory: StudentLessonHistory[]

  // 미완료 항목
  incompleteItems: StudentIncompleteItem[]

  // 최근 알림톡 발송 목록
  notifications: StudentNotification[]
}

export const MOCK_TEACHER_STUDENT_DASHBOARDS: TeacherStudentDashboard[] = [
  {
    studentId: 1,
    name: '김민준',
    className: ['미적분 A반', '미적분 B반'],
    phone: '010-3291-5801',
    parentPhone: '010-5821-3394',
    enrolledAt: '2026-01-06',
    completionRate: 0.82,
    totalIncompleteCount: 2,
    scoreHistory: [
      { date: '2026-02-17', score: 72 },
      { date: '2026-02-24', score: 75 },
      { date: '2026-03-03', score: 78 },
      { date: '2026-03-10', score: 77 },
      { date: '2026-03-17', score: 81 },
      { date: '2026-03-23', score: 78 },
      { date: '2026-03-25', score: 80 },
      { date: '2026-03-30', score: 85 },
    ],
    lessonHistory: [
      { id: 1, date: '2026-03-30', className: '미적분 A반', attendance: '출석', testScore: 85, homeworkDone: true, lessonRecordId: 1 },
      { id: 2, date: '2026-03-26', className: '미적분 B반', attendance: '출석', testScore: 77, homeworkDone: true, lessonRecordId: 6 },
      { id: 3, date: '2026-03-25', className: '미적분 A반', attendance: '출석', testScore: 80, homeworkDone: false, lessonRecordId: 4 },
      { id: 4, date: '2026-03-24', className: '미적분 B반', attendance: '출석', testScore: 82, homeworkDone: true, lessonRecordId: 3 },
      { id: 5, date: '2026-03-23', className: '미적분 A반', attendance: '출석', testScore: 78, homeworkDone: true, lessonRecordId: 2 },
    ],
    incompleteItems: [
      { id: 1001, label: '과제 제출', lessonDate: '2026-03-25', className: '미적분 A반', done: false },
      { id: 1002, label: '오답노트', lessonDate: '2026-03-26', className: '미적분 B반', done: false },
    ],
    notifications: [
      { id: 1, sentAt: '2026-03-30 16:30', preview: '3월 30일 미적분 A반 수업 결과: 출석 ✓  시험 점수 85점...', isExpired: false },
      { id: 2, sentAt: '2026-03-25 17:00', preview: '3월 25일 미적분 A반 수업 결과: 출석 ✓  시험 점수 80점...', isExpired: false },
      { id: 3, sentAt: '2026-03-23 16:45', preview: '3월 23일 미적분 A반 수업 결과: 출석 ✓  시험 점수 78점...', isExpired: true },
    ],
  },
  {
    studentId: 9,
    name: '신태양',
    className: ['미적분 A반'],
    phone: '010-4028-3719',
    parentPhone: '010-8293-4710',
    enrolledAt: '2026-01-06',
    completionRate: 0.44,
    totalIncompleteCount: 5,
    scoreHistory: [
      { date: '2026-02-17', score: 55 },
      { date: '2026-02-24', score: 58 },
      { date: '2026-03-03', score: 60 },
      { date: '2026-03-10', score: 57 },
      { date: '2026-03-17', score: 63 },
      { date: '2026-03-23', score: null as any },
      { date: '2026-03-25', score: 62 },
      { date: '2026-03-30', score: null as any },
    ],
    lessonHistory: [
      { id: 1, date: '2026-03-30', className: '미적분 A반', attendance: null, testScore: null, homeworkDone: null, lessonRecordId: 1 },
      { id: 2, date: '2026-03-25', className: '미적분 A반', attendance: '출석', testScore: 62, homeworkDone: false, lessonRecordId: 4 },
      { id: 3, date: '2026-03-23', className: '미적분 A반', attendance: '결석', testScore: null, homeworkDone: false, lessonRecordId: 2 },
    ],
    incompleteItems: [
      { id: 1015, label: '시험 점수', lessonDate: '2026-03-23', className: '미적분 A반', done: false },
      { id: 1016, label: '과제 제출', lessonDate: '2026-03-23', className: '미적분 A반', done: false },
      { id: 1017, label: '시험 점수', lessonDate: '2026-03-25', className: '미적분 A반', done: false },
      { id: 1018, label: '과제 제출', lessonDate: '2026-03-25', className: '미적분 A반', done: false },
      { id: 1019, label: '과제 제출', lessonDate: '2026-03-30', className: '미적분 A반', done: false },
    ],
    notifications: [],
  },
]

export const getTeacherStudentDashboard = (studentId: number): TeacherStudentDashboard | null => {
  return MOCK_TEACHER_STUDENT_DASHBOARDS.find((d) => d.studentId === studentId) ?? null
}
