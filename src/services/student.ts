import type { Student, StudentDetail } from '@/types/student'
import * as db from '@/mocks/_db'

export interface StudentClass {
  id: number
  name: string
  academy_name?: string
}

export interface CreateStudentDto {
  name: string
  phone: string
  parent_phone: string
  school_name: string
  class_ids: number[]
}

export interface UpdateStudentDto {
  name?: string
  phone?: string
  parent_phone?: string
  school_name?: string
  class_ids?: number[]
}

export interface StudentListResponse {
  data: Student[]
  meta: { total: number }
}

export interface BulkCreateStudentDto {
  name: string
  phone: string
  parent_phone: string
  school_name: string
}

const delay = () => new Promise((r) => setTimeout(r, 80))

export const studentService = {
  async getStudents(params?: { search?: string; school?: string }): Promise<StudentListResponse> {
    await delay()
    let result = db.mockStudents
    if (params?.search) {
      const q = params.search.toLowerCase()
      result = result.filter((s) => s.name.toLowerCase().includes(q))
    }
    if (params?.school) {
      result = result.filter((s) => s.school_name?.includes(params.school!))
    }
    return { data: result, meta: { total: result.length } }
  },

  async getStudent(id: number): Promise<StudentDetail> {
    await delay()
    const detail = db.mockStudentDetails.find((s) => s.id === id)
    if (!detail) throw new Error(`Student ${id} not found`)
    return detail
  },

  async createStudent(dto: CreateStudentDto): Promise<Student> {
    await delay()
    const newId = db.ids.nextStudentId++
    const classes = db.mockClasses
      .filter((c) => dto.class_ids.includes(c.id))
      .map((c) => ({ id: c.id, name: c.name, academy_name: c.academy_name }))

    const newStudent: Student = {
      id: newId,
      name: dto.name,
      phone: dto.phone,
      parent_phone: dto.parent_phone,
      school_name: dto.school_name,
      classes,
      completion_rate: 0,
      total_incomplete_items: 0,
    }

    const newDetail: StudentDetail = {
      id: newId,
      name: dto.name,
      phone: dto.phone,
      parent_phone: dto.parent_phone,
      school_name: dto.school_name,
      classes,
      stats: { total_complete_items: 0, total_incomplete_items: 0, completion_rate: 0 },
      incomplete_items: [],
    }

    db.mockStudents.push(newStudent)
    db.mockStudentDetails.push(newDetail)

    // 반에 학생 추가
    dto.class_ids.forEach((classId) => {
      const cls = db.mockClasses.find((c) => c.id === classId)
      if (cls && !cls.students.some((s) => s.id === newId)) {
        cls.students.push(newStudent)
        cls.student_count = cls.students.length
      }
    })

    return newStudent
  },

  async updateStudent(id: number, dto: UpdateStudentDto): Promise<Student> {
    await delay()
    const student = db.mockStudents.find((s) => s.id === id)
    const detail = db.mockStudentDetails.find((s) => s.id === id)
    if (!student || !detail) throw new Error(`Student ${id} not found`)

    if (dto.name !== undefined) { student.name = dto.name; detail.name = dto.name }
    if (dto.phone !== undefined) { student.phone = dto.phone; detail.phone = dto.phone }
    if (dto.parent_phone !== undefined) { student.parent_phone = dto.parent_phone; detail.parent_phone = dto.parent_phone }
    if (dto.school_name !== undefined) { student.school_name = dto.school_name; detail.school_name = dto.school_name }
    if (dto.class_ids !== undefined) {
      const classes = db.mockClasses
        .filter((c) => dto.class_ids!.includes(c.id))
        .map((c) => ({ id: c.id, name: c.name, academy_name: c.academy_name }))
      student.classes = classes
      detail.classes = classes
    }

    return student
  },

  async deleteStudent(id: number): Promise<void> {
    await delay()
    const sIdx = db.mockStudents.findIndex((s) => s.id === id)
    if (sIdx !== -1) db.mockStudents.splice(sIdx, 1)
    const dIdx = db.mockStudentDetails.findIndex((s) => s.id === id)
    if (dIdx !== -1) db.mockStudentDetails.splice(dIdx, 1)

    // 반에서도 제거
    db.mockClasses.forEach((cls) => {
      const i = cls.students.findIndex((s) => s.id === id)
      if (i !== -1) {
        cls.students.splice(i, 1)
        cls.student_count = cls.students.length
      }
    })
  },

  async completeItem(itemId: number): Promise<void> {
    await delay()
    // 미완료 항목을 완료 처리
    db.mockStudentDetails.forEach((detail) => {
      const idx = detail.incomplete_items.findIndex((i) => i.lesson_student_data_id === itemId)
      if (idx !== -1) {
        detail.incomplete_items.splice(idx, 1)
        detail.stats.total_incomplete_items = Math.max(0, detail.stats.total_incomplete_items - 1)
        detail.stats.total_complete_items += 1
        const total = detail.stats.total_complete_items + detail.stats.total_incomplete_items
        detail.stats.completion_rate = total > 0 ? detail.stats.total_complete_items / total : 1

        // mockStudents 동기화
        const s = db.mockStudents.find((s) => s.id === detail.id)
        if (s) {
          s.completion_rate = detail.stats.completion_rate
          s.total_incomplete_items = detail.stats.total_incomplete_items
        }
      }
    })
  },

  async bulkCreateStudents(_file: File): Promise<void> {
    await delay()
    // mock: 아무것도 하지 않음 (파일 파싱 불필요)
  },
}
