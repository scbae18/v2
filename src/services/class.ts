import type { Student } from '@/types/student'
import { mockClasses, mockStudents, nextClassId } from '@/mocks/_db'
import * as db from '@/mocks/_db'

export interface ClassSchedule {
  day_of_week: number
}

export interface Class {
  id: number
  academy_name: string
  name: string
  schedules: ClassSchedule[]
  student_count: number
  ended_at: string | null
}

export interface ClassDetail extends Class {
  status: '진행 중' | '종료'
  templates: { id: number; name: string }[]
  students: Student[]
}

export interface ClassListResponse {
  data: Class[]
  meta: { total: number }
}

export interface CreateClassDto {
  academy_name: string
  name: string
  day_of_week: number[]
}

export interface UpdateClassDto {
  academy_name?: string
  name?: string
  day_of_week?: number[]
}

const delay = () => new Promise((r) => setTimeout(r, 80))

export const classService = {
  async getClasses(params?: { status?: 'active' | 'ended' }): Promise<ClassListResponse> {
    await delay()
    let result = db.mockClasses as Class[]
    if (params?.status === 'active') result = db.mockClasses.filter((c) => !c.ended_at)
    if (params?.status === 'ended') result = db.mockClasses.filter((c) => !!c.ended_at)
    return { data: result, meta: { total: result.length } }
  },

  async getClass(id: number): Promise<ClassDetail> {
    await delay()
    const cls = db.mockClasses.find((c) => c.id === id)
    if (!cls) throw new Error(`Class ${id} not found`)
    return cls as ClassDetail
  },

  async createClass(dto: CreateClassDto): Promise<Class> {
    await delay()
    const newId = db.ids.nextClassId++
    const newClass = {
      id: newId,
      academy_name: dto.academy_name,
      name: dto.name,
      schedules: dto.day_of_week.map((d) => ({ day_of_week: d })),
      student_count: 0,
      ended_at: null,
      status: '진행 중' as const,
      templates: [],
      students: [],
    }
    db.mockClasses.push(newClass)
    return newClass
  },

  async updateClass(id: number, dto: UpdateClassDto): Promise<Class> {
    await delay()
    const cls = db.mockClasses.find((c) => c.id === id)
    if (!cls) throw new Error(`Class ${id} not found`)
    if (dto.academy_name !== undefined) cls.academy_name = dto.academy_name
    if (dto.name !== undefined) cls.name = dto.name
    if (dto.day_of_week !== undefined) cls.schedules = dto.day_of_week.map((d) => ({ day_of_week: d }))
    return cls
  },

  async deleteClass(id: number): Promise<void> {
    await delay()
    const idx = db.mockClasses.findIndex((c) => c.id === id)
    if (idx !== -1) db.mockClasses.splice(idx, 1)
  },

  async endClass(id: number, ended_at?: string): Promise<void> {
    await delay()
    const cls = db.mockClasses.find((c) => c.id === id)
    if (cls) {
      cls.ended_at = ended_at ?? new Date().toISOString()
      cls.status = '종료'
    }
  },

  async getClassStudents(id: number, _date?: string): Promise<Student[]> {
    await delay()
    const cls = db.mockClasses.find((c) => c.id === id)
    return cls?.students ?? []
  },

  async addStudents(id: number, student_ids: number[]): Promise<void> {
    await delay()
    const cls = db.mockClasses.find((c) => c.id === id)
    if (!cls) return
    const toAdd = db.mockStudents.filter(
      (s) => student_ids.includes(s.id) && !cls.students.some((cs) => cs.id === s.id)
    )
    cls.students.push(...toAdd)
    cls.student_count = cls.students.length
  },

  async removeStudent(classId: number, studentId: number): Promise<void> {
    await delay()
    const cls = db.mockClasses.find((c) => c.id === classId)
    if (!cls) return
    const idx = cls.students.findIndex((s) => s.id === studentId)
    if (idx !== -1) cls.students.splice(idx, 1)
    cls.student_count = cls.students.length
  },
}
