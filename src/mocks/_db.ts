/**
 * v2 Mock In-Memory Database
 * 서비스 파일들이 공유하는 단일 상태 저장소.
 * 모든 CRUD 연산은 이 배열을 직접 변경한다 (새로고침 시 초기화).
 */

import type { Student, StudentDetail, IncompleteItem } from '@/types/student'

// ──────────────────────────────────────────────
// 1. 학생 (Student)
// ──────────────────────────────────────────────

export const mockStudentDetails: StudentDetail[] = [
  {
    id: 1,
    name: '김민준',
    phone: '010-3291-5801',
    parent_phone: '010-5821-3394',
    school_name: '강남중학교',
    classes: [
      { id: 1, name: '미적분 A반', academy_name: '엘리에듀학원' },
      { id: 2, name: '미적분 B반', academy_name: '엘리에듀학원' },
    ],
    stats: { total_complete_items: 9, total_incomplete_items: 2, completion_rate: 0.82 },
    incomplete_items: [
      { lesson_student_data_id: 1001, item_name: '과제 제출', lesson_date: '2026-03-25', class_name: '미적분 A반', template_name: '정규 수업 템플릿' },
      { lesson_student_data_id: 1002, item_name: '오답노트', lesson_date: '2026-03-26', class_name: '미적분 B반', template_name: '정규 수업 템플릿' },
    ],
  },
  {
    id: 2,
    name: '이서연',
    phone: '010-2938-1047',
    parent_phone: '010-8472-2039',
    school_name: '강남중학교',
    classes: [{ id: 1, name: '미적분 A반', academy_name: '엘리에듀학원' }],
    stats: { total_complete_items: 11, total_incomplete_items: 1, completion_rate: 0.92 },
    incomplete_items: [
      { lesson_student_data_id: 1003, item_name: '과제 제출', lesson_date: '2026-03-30', class_name: '미적분 A반', template_name: '정규 수업 템플릿' },
    ],
  },
  {
    id: 3,
    name: '박지호',
    phone: '010-7492-3821',
    parent_phone: '010-2938-7104',
    school_name: '강서중학교',
    classes: [{ id: 1, name: '미적분 A반', academy_name: '엘리에듀학원' }],
    stats: { total_complete_items: 6, total_incomplete_items: 3, completion_rate: 0.67 },
    incomplete_items: [
      { lesson_student_data_id: 1004, item_name: '시험 점수', lesson_date: '2026-03-23', class_name: '미적분 A반', template_name: '정규 수업 템플릿' },
      { lesson_student_data_id: 1005, item_name: '과제 제출', lesson_date: '2026-03-25', class_name: '미적분 A반', template_name: '정규 수업 템플릿' },
      { lesson_student_data_id: 1006, item_name: '과제 제출', lesson_date: '2026-03-30', class_name: '미적분 A반', template_name: '정규 수업 템플릿' },
    ],
  },
  {
    id: 4,
    name: '최하은',
    phone: '010-8203-4729',
    parent_phone: '010-3849-2017',
    school_name: '서초중학교',
    classes: [{ id: 2, name: '미적분 B반', academy_name: '엘리에듀학원' }],
    stats: { total_complete_items: 12, total_incomplete_items: 0, completion_rate: 1.0 },
    incomplete_items: [],
  },
  {
    id: 5,
    name: '정시우',
    phone: '010-5039-2817',
    parent_phone: '010-7392-5018',
    school_name: '송파중학교',
    classes: [{ id: 3, name: '기하 A반', academy_name: '엘리에듀학원' }],
    stats: { total_complete_items: 5, total_incomplete_items: 4, completion_rate: 0.56 },
    incomplete_items: [
      { lesson_student_data_id: 1007, item_name: '클리닉 점수', lesson_date: '2026-03-25', class_name: '기하 A반', template_name: '클리닉 템플릿' },
      { lesson_student_data_id: 1008, item_name: '과제 제출', lesson_date: '2026-03-25', class_name: '기하 A반', template_name: '클리닉 템플릿' },
      { lesson_student_data_id: 1009, item_name: '클리닉 점수', lesson_date: '2026-03-27', class_name: '기하 A반', template_name: '클리닉 템플릿' },
      { lesson_student_data_id: 1010, item_name: '과제 제출', lesson_date: '2026-03-27', class_name: '기하 A반', template_name: '클리닉 템플릿' },
    ],
  },
  {
    id: 6,
    name: '강나영',
    phone: '010-1928-3047',
    parent_phone: '010-4829-1032',
    school_name: '강남중학교',
    classes: [
      { id: 1, name: '미적분 A반', academy_name: '엘리에듀학원' },
      { id: 3, name: '기하 A반', academy_name: '엘리에듀학원' },
    ],
    stats: { total_complete_items: 10, total_incomplete_items: 1, completion_rate: 0.91 },
    incomplete_items: [
      { lesson_student_data_id: 1011, item_name: '과제 제출', lesson_date: '2026-03-27', class_name: '기하 A반', template_name: '클리닉 템플릿' },
    ],
  },
  {
    id: 7,
    name: '윤재원',
    phone: '010-3820-4918',
    parent_phone: '010-2039-8127',
    school_name: '서초중학교',
    classes: [{ id: 2, name: '미적분 B반', academy_name: '엘리에듀학원' }],
    stats: { total_complete_items: 8, total_incomplete_items: 2, completion_rate: 0.8 },
    incomplete_items: [
      { lesson_student_data_id: 1012, item_name: '시험 점수', lesson_date: '2026-03-24', class_name: '미적분 B반', template_name: '정규 수업 템플릿' },
      { lesson_student_data_id: 1013, item_name: '과제 제출', lesson_date: '2026-03-26', class_name: '미적분 B반', template_name: '정규 수업 템플릿' },
    ],
  },
  {
    id: 8,
    name: '임수빈',
    phone: '010-9213-4720',
    parent_phone: '010-4821-3029',
    school_name: '송파중학교',
    classes: [{ id: 3, name: '기하 A반', academy_name: '엘리에듀학원' }],
    stats: { total_complete_items: 10, total_incomplete_items: 1, completion_rate: 0.91 },
    incomplete_items: [
      { lesson_student_data_id: 1014, item_name: '과제 제출', lesson_date: '2026-03-25', class_name: '기하 A반', template_name: '클리닉 템플릿' },
    ],
  },
  {
    id: 9,
    name: '신태양',
    phone: '010-4028-3719',
    parent_phone: '010-8293-4710',
    school_name: '강서중학교',
    classes: [{ id: 1, name: '미적분 A반', academy_name: '엘리에듀학원' }],
    stats: { total_complete_items: 4, total_incomplete_items: 5, completion_rate: 0.44 },
    incomplete_items: [
      { lesson_student_data_id: 1015, item_name: '시험 점수', lesson_date: '2026-03-23', class_name: '미적분 A반', template_name: '정규 수업 템플릿' },
      { lesson_student_data_id: 1016, item_name: '과제 제출', lesson_date: '2026-03-23', class_name: '미적분 A반', template_name: '정규 수업 템플릿' },
      { lesson_student_data_id: 1017, item_name: '시험 점수', lesson_date: '2026-03-25', class_name: '미적분 A반', template_name: '정규 수업 템플릿' },
      { lesson_student_data_id: 1018, item_name: '과제 제출', lesson_date: '2026-03-25', class_name: '미적분 A반', template_name: '정규 수업 템플릿' },
      { lesson_student_data_id: 1019, item_name: '과제 제출', lesson_date: '2026-03-30', class_name: '미적분 A반', template_name: '정규 수업 템플릿' },
    ],
  },
  {
    id: 10,
    name: '오예준',
    phone: '010-2938-4017',
    parent_phone: '010-3920-1847',
    school_name: '강남중학교',
    classes: [
      { id: 2, name: '미적분 B반', academy_name: '엘리에듀학원' },
      { id: 3, name: '기하 A반', academy_name: '엘리에듀학원' },
    ],
    stats: { total_complete_items: 7, total_incomplete_items: 3, completion_rate: 0.7 },
    incomplete_items: [
      { lesson_student_data_id: 1020, item_name: '클리닉 점수', lesson_date: '2026-03-25', class_name: '기하 A반', template_name: '클리닉 템플릿' },
      { lesson_student_data_id: 1021, item_name: '시험 점수', lesson_date: '2026-03-26', class_name: '미적분 B반', template_name: '정규 수업 템플릿' },
      { lesson_student_data_id: 1022, item_name: '과제 제출', lesson_date: '2026-03-27', class_name: '기하 A반', template_name: '클리닉 템플릿' },
    ],
  },
]

export const mockStudents: Student[] = mockStudentDetails.map((s) => ({
  id: s.id,
  name: s.name,
  phone: s.phone,
  parent_phone: s.parent_phone,
  school_name: s.school_name,
  classes: s.classes,
  completion_rate: s.stats.completion_rate,
  total_incomplete_items: s.stats.total_incomplete_items,
}))

// ──────────────────────────────────────────────
// 2. 반 (Class)
// ──────────────────────────────────────────────

export interface MockClassRecord {
  id: number
  academy_name: string
  name: string
  schedules: { day_of_week: number }[]
  student_count: number
  ended_at: string | null
  status: '진행 중' | '종료'
  templates: { id: number; name: string }[]
  students: Student[]
}

export const mockClasses: MockClassRecord[] = [
  {
    id: 1,
    academy_name: '엘리에듀학원',
    name: '미적분 A반',
    schedules: [{ day_of_week: 1 }, { day_of_week: 3 }],
    student_count: 5,
    ended_at: null,
    status: '진행 중',
    templates: [{ id: 1, name: '정규 수업 템플릿' }],
    students: mockStudents.filter((s) => [1, 2, 3, 6, 9].includes(s.id)),
  },
  {
    id: 2,
    academy_name: '엘리에듀학원',
    name: '미적분 B반',
    schedules: [{ day_of_week: 2 }, { day_of_week: 4 }],
    student_count: 4,
    ended_at: null,
    status: '진행 중',
    templates: [{ id: 1, name: '정규 수업 템플릿' }],
    students: mockStudents.filter((s) => [1, 4, 7, 10].includes(s.id)),
  },
  {
    id: 3,
    academy_name: '엘리에듀학원',
    name: '기하 A반',
    schedules: [{ day_of_week: 3 }, { day_of_week: 5 }],
    student_count: 4,
    ended_at: null,
    status: '진행 중',
    templates: [{ id: 2, name: '클리닉 템플릿' }],
    students: mockStudents.filter((s) => [5, 6, 8, 10].includes(s.id)),
  },
  {
    id: 4,
    academy_name: '엘리에듀학원',
    name: '방학특강반',
    schedules: [{ day_of_week: 6 }],
    student_count: 0,
    ended_at: '2026-02-28T00:00:00Z',
    status: '종료',
    templates: [{ id: 3, name: '방학 특강 템플릿' }],
    students: [],
  },
]

// ──────────────────────────────────────────────
// 3. 템플릿 (Template)
// ──────────────────────────────────────────────

export interface MockTemplateRecord {
  id: number
  name: string
  item_count: number
  class_count: number
  class_list: { id: number; name: string }[]
  created_at: string
  items: {
    id: number
    name: string
    item_type: 'TEXT' | 'NUMBER' | 'SELECT' | 'COMPLETE' | 'ATTENDANCE'
    is_common: boolean
    include_in_message: boolean
    is_default_attendance: boolean
    sort_order: number
    options?: string[]
  }[]
}

export const mockTemplates: MockTemplateRecord[] = [
  {
    id: 1,
    name: '정규 수업 템플릿',
    item_count: 6,
    class_count: 2,
    class_list: [
      { id: 1, name: '미적분 A반' },
      { id: 2, name: '미적분 B반' },
    ],
    created_at: '2026-01-10T00:00:00Z',
    items: [
      { id: 101, name: '출결', item_type: 'ATTENDANCE', is_common: false, include_in_message: true, is_default_attendance: true, sort_order: 0 },
      { id: 102, name: '시험 점수', item_type: 'NUMBER', is_common: false, include_in_message: true, is_default_attendance: false, sort_order: 1 },
      { id: 103, name: '과제 제출', item_type: 'COMPLETE', is_common: false, include_in_message: true, is_default_attendance: false, sort_order: 2 },
      { id: 104, name: '오늘 학습 내용', item_type: 'TEXT', is_common: true, include_in_message: true, is_default_attendance: false, sort_order: 3 },
      { id: 105, name: '다음 시간 범위', item_type: 'TEXT', is_common: true, include_in_message: true, is_default_attendance: false, sort_order: 4 },
      { id: 106, name: '이번 주 과제', item_type: 'TEXT', is_common: true, include_in_message: false, is_default_attendance: false, sort_order: 5 },
    ],
  },
  {
    id: 2,
    name: '클리닉 템플릿',
    item_count: 4,
    class_count: 1,
    class_list: [{ id: 3, name: '기하 A반' }],
    created_at: '2026-01-15T00:00:00Z',
    items: [
      { id: 201, name: '출결', item_type: 'ATTENDANCE', is_common: false, include_in_message: true, is_default_attendance: true, sort_order: 0 },
      { id: 202, name: '클리닉 점수', item_type: 'NUMBER', is_common: false, include_in_message: true, is_default_attendance: false, sort_order: 1 },
      { id: 203, name: '과제 제출', item_type: 'COMPLETE', is_common: false, include_in_message: true, is_default_attendance: false, sort_order: 2 },
      { id: 204, name: '수업 목표', item_type: 'TEXT', is_common: true, include_in_message: true, is_default_attendance: false, sort_order: 3 },
    ],
  },
  {
    id: 3,
    name: '방학 특강 템플릿',
    item_count: 3,
    class_count: 1,
    class_list: [{ id: 4, name: '방학특강반' }],
    created_at: '2026-01-20T00:00:00Z',
    items: [
      { id: 301, name: '출결', item_type: 'ATTENDANCE', is_common: false, include_in_message: true, is_default_attendance: true, sort_order: 0 },
      { id: 302, name: '특강 점수', item_type: 'NUMBER', is_common: false, include_in_message: true, is_default_attendance: false, sort_order: 1 },
      { id: 303, name: '수업 내용', item_type: 'TEXT', is_common: true, include_in_message: true, is_default_attendance: false, sort_order: 2 },
    ],
  },
]

// ──────────────────────────────────────────────
// 4. 수업 기록 (Lesson Records)
// ──────────────────────────────────────────────

export interface MockLessonRecord {
  id: number
  class_id: number
  class_name: string
  academy_name: string
  template_id: number
  template_name: string
  lesson_date: string
  status: 'DRAFT' | 'SAVED'
  is_adhoc: boolean
  progress_rate: number
  total_students: number
  common_data: { template_item_id: number; value: string }[]
  student_data: {
    student_id: number
    items: { template_item_id: number; value: string; is_completed?: boolean }[]
  }[]
}

export const mockLessonRecords: MockLessonRecord[] = [
  // 이번 주 - 오늘 (2026-03-30 Mon) - 미적분 A반, DRAFT
  {
    id: 1,
    class_id: 1, class_name: '미적분 A반', academy_name: '엘리에듀학원',
    template_id: 1, template_name: '정규 수업 템플릿',
    lesson_date: '2026-03-30', status: 'DRAFT', is_adhoc: false,
    progress_rate: 0.4, total_students: 5,
    common_data: [
      { template_item_id: 104, value: '극한의 개념과 성질 (미적분 1단원)' },
      { template_item_id: 105, value: '연속함수와 연속성' },
    ],
    student_data: [
      { student_id: 1, items: [
        { template_item_id: 101, value: '출석' },
        { template_item_id: 102, value: '85' },
        { template_item_id: 103, value: '', is_completed: true },
      ]},
      { student_id: 2, items: [
        { template_item_id: 101, value: '출석' },
        { template_item_id: 102, value: '92' },
        { template_item_id: 103, value: '', is_completed: true },
      ]},
      { student_id: 3, items: [] },
      { student_id: 6, items: [] },
      { student_id: 9, items: [] },
    ],
  },
  // 지난 주 (2026-03-23 Mon) - 미적분 A반, SAVED
  {
    id: 2,
    class_id: 1, class_name: '미적분 A반', academy_name: '엘리에듀학원',
    template_id: 1, template_name: '정규 수업 템플릿',
    lesson_date: '2026-03-23', status: 'SAVED', is_adhoc: false,
    progress_rate: 1.0, total_students: 5,
    common_data: [
      { template_item_id: 104, value: '다항함수의 미분 (2단원 복습)' },
      { template_item_id: 105, value: '극한의 개념과 성질' },
    ],
    student_data: [
      { student_id: 1, items: [{ template_item_id: 101, value: '출석' }, { template_item_id: 102, value: '78' }, { template_item_id: 103, value: '', is_completed: true }] },
      { student_id: 2, items: [{ template_item_id: 101, value: '출석' }, { template_item_id: 102, value: '95' }, { template_item_id: 103, value: '', is_completed: true }] },
      { student_id: 3, items: [{ template_item_id: 101, value: '지각' }, { template_item_id: 102, value: '71' }, { template_item_id: 103, value: '', is_completed: true }] },
      { student_id: 6, items: [{ template_item_id: 101, value: '출석' }, { template_item_id: 102, value: '88' }, { template_item_id: 103, value: '', is_completed: true }] },
      { student_id: 9, items: [{ template_item_id: 101, value: '결석' }, { template_item_id: 102, value: '' }, { template_item_id: 103, value: '', is_completed: false }] },
    ],
  },
  // 지난 주 (2026-03-24 Tue) - 미적분 B반, SAVED
  {
    id: 3,
    class_id: 2, class_name: '미적분 B반', academy_name: '엘리에듀학원',
    template_id: 1, template_name: '정규 수업 템플릿',
    lesson_date: '2026-03-24', status: 'SAVED', is_adhoc: false,
    progress_rate: 1.0, total_students: 4,
    common_data: [
      { template_item_id: 104, value: '수열의 극한 개념' },
      { template_item_id: 105, value: '급수와 수렴' },
    ],
    student_data: [
      { student_id: 1, items: [{ template_item_id: 101, value: '출석' }, { template_item_id: 102, value: '82' }, { template_item_id: 103, value: '', is_completed: true }] },
      { student_id: 4, items: [{ template_item_id: 101, value: '출석' }, { template_item_id: 102, value: '97' }, { template_item_id: 103, value: '', is_completed: true }] },
      { student_id: 7, items: [{ template_item_id: 101, value: '출석' }, { template_item_id: 102, value: '74' }, { template_item_id: 103, value: '', is_completed: true }] },
      { student_id: 10, items: [{ template_item_id: 101, value: '출석' }, { template_item_id: 102, value: '89' }, { template_item_id: 103, value: '', is_completed: true }] },
    ],
  },
  // 지난 주 (2026-03-25 Wed) - 미적분 A반, SAVED
  {
    id: 4,
    class_id: 1, class_name: '미적분 A반', academy_name: '엘리에듀학원',
    template_id: 1, template_name: '정규 수업 템플릿',
    lesson_date: '2026-03-25', status: 'SAVED', is_adhoc: false,
    progress_rate: 1.0, total_students: 5,
    common_data: [
      { template_item_id: 104, value: '극한값의 계산 방법' },
      { template_item_id: 105, value: '함수의 연속' },
    ],
    student_data: [
      { student_id: 1, items: [{ template_item_id: 101, value: '출석' }, { template_item_id: 102, value: '80' }, { template_item_id: 103, value: '', is_completed: false }] },
      { student_id: 2, items: [{ template_item_id: 101, value: '출석' }, { template_item_id: 102, value: '91' }, { template_item_id: 103, value: '', is_completed: true }] },
      { student_id: 3, items: [{ template_item_id: 101, value: '출석' }, { template_item_id: 102, value: '68' }, { template_item_id: 103, value: '', is_completed: false }] },
      { student_id: 6, items: [{ template_item_id: 101, value: '출석' }, { template_item_id: 102, value: '87' }, { template_item_id: 103, value: '', is_completed: true }] },
      { student_id: 9, items: [{ template_item_id: 101, value: '출석' }, { template_item_id: 102, value: '62' }, { template_item_id: 103, value: '', is_completed: false }] },
    ],
  },
  // 지난 주 (2026-03-25 Wed) - 기하 A반, SAVED
  {
    id: 5,
    class_id: 3, class_name: '기하 A반', academy_name: '엘리에듀학원',
    template_id: 2, template_name: '클리닉 템플릿',
    lesson_date: '2026-03-25', status: 'SAVED', is_adhoc: false,
    progress_rate: 0.75, total_students: 4,
    common_data: [{ template_item_id: 204, value: '이차곡선 심화 (타원·쌍곡선)' }],
    student_data: [
      { student_id: 5, items: [{ template_item_id: 201, value: '출석' }, { template_item_id: 202, value: '73' }, { template_item_id: 203, value: '', is_completed: false }] },
      { student_id: 6, items: [{ template_item_id: 201, value: '출석' }, { template_item_id: 202, value: '90' }, { template_item_id: 203, value: '', is_completed: true }] },
      { student_id: 8, items: [{ template_item_id: 201, value: '출석' }, { template_item_id: 202, value: '85' }, { template_item_id: 203, value: '', is_completed: true }] },
      { student_id: 10, items: [{ template_item_id: 201, value: '출석' }, { template_item_id: 202, value: '78' }, { template_item_id: 203, value: '', is_completed: true }] },
    ],
  },
  // 지난 주 (2026-03-26 Thu) - 미적분 B반, SAVED
  {
    id: 6,
    class_id: 2, class_name: '미적분 B반', academy_name: '엘리에듀학원',
    template_id: 1, template_name: '정규 수업 템플릿',
    lesson_date: '2026-03-26', status: 'SAVED', is_adhoc: false,
    progress_rate: 0.75, total_students: 4,
    common_data: [
      { template_item_id: 104, value: '급수의 수렴·발산 판정' },
      { template_item_id: 105, value: '기하급수' },
    ],
    student_data: [
      { student_id: 1, items: [{ template_item_id: 101, value: '출석' }, { template_item_id: 102, value: '77' }, { template_item_id: 103, value: '', is_completed: true }] },
      { student_id: 4, items: [{ template_item_id: 101, value: '출석' }, { template_item_id: 102, value: '96' }, { template_item_id: 103, value: '', is_completed: true }] },
      { student_id: 7, items: [{ template_item_id: 101, value: '출석' }, { template_item_id: 102, value: '70' }, { template_item_id: 103, value: '', is_completed: false }] },
      { student_id: 10, items: [{ template_item_id: 101, value: '결석' }, { template_item_id: 102, value: '' }, { template_item_id: 103, value: '', is_completed: false }] },
    ],
  },
  // 지난 주 (2026-03-27 Fri) - 기하 A반, SAVED
  {
    id: 7,
    class_id: 3, class_name: '기하 A반', academy_name: '엘리에듀학원',
    template_id: 2, template_name: '클리닉 템플릿',
    lesson_date: '2026-03-27', status: 'SAVED', is_adhoc: false,
    progress_rate: 0.75, total_students: 4,
    common_data: [{ template_item_id: 204, value: '벡터의 내적과 외적' }],
    student_data: [
      { student_id: 5, items: [{ template_item_id: 201, value: '출석' }, { template_item_id: 202, value: '69' }, { template_item_id: 203, value: '', is_completed: false }] },
      { student_id: 6, items: [{ template_item_id: 201, value: '출석' }, { template_item_id: 202, value: '88' }, { template_item_id: 203, value: '', is_completed: false }] },
      { student_id: 8, items: [{ template_item_id: 201, value: '출석' }, { template_item_id: 202, value: '92' }, { template_item_id: 203, value: '', is_completed: true }] },
      { student_id: 10, items: [{ template_item_id: 201, value: '출석' }, { template_item_id: 202, value: '81' }, { template_item_id: 203, value: '', is_completed: false }] },
    ],
  },
]

// next auto-increment ids (wrapped in object so importers can mutate)
export const ids = {
  nextLessonId: 100,
  nextStudentId: 100,
  nextClassId: 100,
  nextTemplateId: 100,
}

// legacy aliases kept for compatibility
export const nextLessonId = 100
export const nextStudentId = 100
export const nextClassId = 100
export const nextTemplateId = 100
