/**
 * 선생님 — 전체 통계 대시보드 mock 데이터
 */

export interface DashboardSummary {
  todayClassCount: number
  incompleteStudentCount: number
  unsentMessageCount: number
  weeklyInputRate: number // 0~1
}

export interface ClassStat {
  classId: number
  className: string
  studentCount: number
  avgScore: number | null
  completionRate: number
  trend: 'up' | 'down' | 'stable'
}

export interface WeeklyChartData {
  week: string // 'MM/DD'
  inputCount: number
  attendanceRate: number // 0~1
  avgTestScore: number | null
  homeworkRate: number // 0~1
}

export interface ClassCompareData {
  className: string
  avgScore: number | null
  completionRate: number
  attendanceRate: number
}

export interface FlaggedStudent {
  studentId: number
  name: string
  className: string
  reason: 'incomplete' | 'low_score' | 'absent'
  value: string
}

export const MOCK_DASHBOARD_SUMMARY: DashboardSummary = {
  todayClassCount: 1,
  incompleteStudentCount: 3,
  unsentMessageCount: 4,
  weeklyInputRate: 0.68,
}

export const MOCK_CLASS_STATS: ClassStat[] = [
  {
    classId: 1,
    className: '미적분 A반',
    studentCount: 5,
    avgScore: 83,
    completionRate: 0.72,
    trend: 'up',
  },
  {
    classId: 2,
    className: '미적분 B반',
    studentCount: 4,
    avgScore: 87,
    completionRate: 0.88,
    trend: 'stable',
  },
  {
    classId: 3,
    className: '기하 A반',
    studentCount: 4,
    avgScore: 81,
    completionRate: 0.65,
    trend: 'down',
  },
]

export const MOCK_WEEKLY_CHART: WeeklyChartData[] = [
  { week: '02/03', inputCount: 6, attendanceRate: 0.95, avgTestScore: 76, homeworkRate: 0.72 },
  { week: '02/10', inputCount: 8, attendanceRate: 0.92, avgTestScore: 78, homeworkRate: 0.75 },
  { week: '02/17', inputCount: 7, attendanceRate: 0.88, avgTestScore: 75, homeworkRate: 0.68 },
  { week: '02/24', inputCount: 9, attendanceRate: 0.93, avgTestScore: 79, homeworkRate: 0.80 },
  { week: '03/03', inputCount: 8, attendanceRate: 0.91, avgTestScore: 80, homeworkRate: 0.77 },
  { week: '03/10', inputCount: 10, attendanceRate: 0.90, avgTestScore: 82, homeworkRate: 0.82 },
  { week: '03/17', inputCount: 9, attendanceRate: 0.94, avgTestScore: 83, homeworkRate: 0.79 },
  { week: '03/24', inputCount: 7, attendanceRate: 0.89, avgTestScore: 84, homeworkRate: 0.74 },
]

export const MOCK_CLASS_COMPARE: ClassCompareData[] = [
  { className: '미적분 A반', avgScore: 83, completionRate: 0.72, attendanceRate: 0.91 },
  { className: '미적분 B반', avgScore: 87, completionRate: 0.88, attendanceRate: 0.95 },
  { className: '기하 A반', avgScore: 81, completionRate: 0.65, attendanceRate: 0.88 },
]

export const MOCK_FLAGGED_STUDENTS: FlaggedStudent[] = [
  { studentId: 9, name: '신태양', className: '미적분 A반', reason: 'incomplete', value: '미완료 5개' },
  { studentId: 5, name: '정시우', className: '기하 A반', reason: 'low_score', value: '평균 69점' },
  { studentId: 3, name: '박지호', className: '미적분 A반', reason: 'incomplete', value: '미완료 3개' },
  { studentId: 7, name: '윤재원', className: '미적분 B반', reason: 'low_score', value: '평균 72점' },
  { studentId: 10, name: '오예준', className: '미적분 B반', reason: 'absent', value: '최근 결석 1회' },
]
