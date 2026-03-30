/**
 * 학부모 대시보드 mock 데이터
 * 토큰(UUID) 기반 진입, 로그인 없음
 */

export interface ParentDashboardLesson {
  lessonDate: string
  className: string
  attendance: '출석' | '지각' | '결석' | null
  testScore: number | null
  homeworkDone: boolean | null
}

export interface ParentTodoItem {
  id: number
  label: string
  dueDate: string
  done: boolean
}

export interface ParentDashboard {
  token: string
  studentName: string
  teacherName: string
  className: string
  enrolledAt: string

  // 이번 수업 요약
  latestLesson: {
    date: string
    attendance: '출석' | '지각' | '결석' | null
    testScore: number | null
    homeworkDone: boolean | null
    aiFeedback: string
  }

  // 할 일 (미완료 항목)
  todos: ParentTodoItem[]

  // 최근 수업 이력
  recentLessons: ParentDashboardLesson[]
}

export const MOCK_PARENT_DASHBOARD: ParentDashboard = {
  token: 'abc-123-def-456',
  studentName: '김민준',
  teacherName: '김선생',
  className: '미적분 A반',
  enrolledAt: '2026-01-06',

  latestLesson: {
    date: '2026-03-30',
    attendance: '출석',
    testScore: 85,
    homeworkDone: true,
    aiFeedback:
      '민준이는 오늘 극한의 개념을 빠르게 이해하고 문제에 잘 적용했어요. 특히 분수 형태의 극한 계산에서 실수 없이 풀어냈습니다. 다음 시간에는 연속함수 파트로 넘어가는데, 오늘 배운 극한 개념을 바탕으로 어렵지 않게 따라올 수 있을 거예요. 과제를 꼼꼼히 풀어오면 더욱 좋겠습니다.',
  },

  todos: [
    { id: 1, label: '과제 제출 (3/25 수업 분)', dueDate: '2026-04-01', done: false },
    { id: 2, label: '오답노트 작성 (3/26 수업 분)', dueDate: '2026-04-03', done: false },
    { id: 3, label: '교재 p.72~84 예습', dueDate: '2026-04-01', done: false },
  ],

  recentLessons: [
    { lessonDate: '2026-03-30', className: '미적분 A반', attendance: '출석', testScore: 85, homeworkDone: true },
    { lessonDate: '2026-03-25', className: '미적분 A반', attendance: '출석', testScore: 80, homeworkDone: false },
    { lessonDate: '2026-03-23', className: '미적분 A반', attendance: '출석', testScore: 78, homeworkDone: true },
    { lessonDate: '2026-03-18', className: '미적분 A반', attendance: '지각', testScore: 72, homeworkDone: true },
    { lessonDate: '2026-03-16', className: '미적분 A반', attendance: '출석', testScore: 81, homeworkDone: true },
  ],
}

/** 토큰으로 대시보드 조회 (mock) */
export const getParentDashboardByToken = (token: string): ParentDashboard | null => {
  if (token === MOCK_PARENT_DASHBOARD.token) return MOCK_PARENT_DASHBOARD
  // 어떤 토큰이든 데모용으로 반환
  return MOCK_PARENT_DASHBOARD
}
