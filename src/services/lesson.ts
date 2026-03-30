import * as db from '@/mocks/_db'

export interface LessonSummary {
  id?: number | null
  lesson_record_id: number | null
  class_id: number
  class_name: string
  academy_name: string
  template_id: number
  template_name: string
  progress_rate: number
  total_students: number
  status: 'DRAFT' | 'SAVED'
  is_adhoc: boolean
}

export interface LessonItemDetail {
  id: number
  name: string
  item_type: 'TEXT' | 'NUMBER' | 'SELECT' | 'COMPLETE' | 'ATTENDANCE'
  is_common: boolean
  include_in_message: boolean
  sort_order: number
  options?: { id: number; label: string; sort_order: number }[]
}

export interface LessonDetail {
  id: number
  class_id: number
  class_name: string
  academy_name: string
  template_id: number
  template_name: string
  lesson_date: string
  status: 'DRAFT' | 'SAVED'
  is_adhoc: boolean
  common_data: CommonDataItem[]
  student_data: StudentData[]
  items: LessonItemDetail[]
}

export interface LessonListResponse {
  data: LessonSummary[]
  meta: { total: number }
}

export interface CommonDataItem {
  template_item_id: number
  value: string
}

export interface StudentDataItem {
  template_item_id: number
  value: string
  is_completed?: boolean
}

export interface StudentData {
  student_id: number
  items: StudentDataItem[]
}

export interface CreateLessonDto {
  class_id: number
  template_id: number
  lesson_date: string
  is_adhoc: boolean
  status: 'DRAFT' | 'SAVED'
  common_data: CommonDataItem[]
  student_data: StudentData[]
}

export interface UpdateLessonDto {
  lesson_id: number
  class_id: number
  lesson_date: string
  template_id?: number
  status?: 'DRAFT' | 'SAVED'
  common_data: CommonDataItem[]
  student_data: StudentData[]
}

const delay = () => new Promise((r) => setTimeout(r, 80))

/** 날짜 문자열(yyyy-MM-dd)로부터 요일(0=일,1=월,...,6=토) 반환 */
const getDayOfWeek = (dateStr: string): number => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).getDay()
}

/** 진행률 계산: 학생 데이터에서 실제 입력된 학생 비율 */
const calcProgressRate = (
  studentData: db.MockLessonRecord['student_data'],
  totalStudents: number,
  templateItems: db.MockTemplateRecord['items']
): number => {
  if (totalStudents === 0) return 0
  const attendanceItemId = templateItems.find((i) => i.item_type === 'ATTENDANCE')?.id
  const nonAttItems = templateItems.filter((i) => i.item_type !== 'ATTENDANCE')

  let complete = 0
  studentData.forEach((sd) => {
    const hasAttendance = attendanceItemId
      ? sd.items.some((i) => i.template_item_id === attendanceItemId && i.value)
      : true
    if (!hasAttendance) return

    const allFilled = nonAttItems.every((ti) => {
      const item = sd.items.find((i) => i.template_item_id === ti.id)
      if (!item) return false
      if (ti.item_type === 'COMPLETE') return item.is_completed !== null && item.is_completed !== undefined
      return item.value.trim() !== ''
    })
    if (allFilled) complete++
  })
  return complete / totalStudents
}

const toLessonItems = (items: db.MockTemplateRecord['items']): LessonItemDetail[] =>
  items.map((i) => ({
    id: i.id,
    name: i.name,
    item_type: i.item_type,
    is_common: i.is_common,
    include_in_message: i.include_in_message,
    sort_order: i.sort_order,
  }))

export const lessonService = {
  async getLessons(date: string): Promise<LessonListResponse> {
    await delay()
    const dayOfWeek = getDayOfWeek(date)

    // 이 날 스케줄이 있는 진행 중인 반 찾기
    const scheduledClasses = db.mockClasses.filter(
      (c) => !c.ended_at && c.schedules.some((s) => s.day_of_week === dayOfWeek)
    )

    const results: LessonSummary[] = scheduledClasses.map((cls) => {
      const record = db.mockLessonRecords.find(
        (r) => r.class_id === cls.id && r.lesson_date === date
      )
      const template = db.mockTemplates.find((t) => t.id === cls.templates[0]?.id)

      if (record) {
        return {
          id: record.id,
          lesson_record_id: record.id,
          class_id: cls.id,
          class_name: cls.name,
          academy_name: cls.academy_name,
          template_id: record.template_id,
          template_name: record.template_name,
          progress_rate: record.progress_rate,
          total_students: record.total_students,
          status: record.status,
          is_adhoc: record.is_adhoc,
        }
      }

      return {
        id: null,
        lesson_record_id: null,
        class_id: cls.id,
        class_name: cls.name,
        academy_name: cls.academy_name,
        template_id: template?.id ?? 0,
        template_name: template?.name ?? '',
        progress_rate: 0,
        total_students: cls.student_count,
        status: 'DRAFT',
        is_adhoc: false,
      }
    })

    return { data: results, meta: { total: results.length } }
  },

  async getLesson(id: number): Promise<LessonDetail> {
    await delay()
    const record = db.mockLessonRecords.find((r) => r.id === id)
    if (!record) throw new Error(`Lesson ${id} not found`)

    const template = db.mockTemplates.find((t) => t.id === record.template_id)
    if (!template) {
      const err: any = new Error('Template not found')
      err.response = { data: { error: { code: 'TEMPLATE_NOT_FOUND' } } }
      throw err
    }

    return {
      id: record.id,
      class_id: record.class_id,
      class_name: record.class_name,
      academy_name: record.academy_name,
      template_id: record.template_id,
      template_name: record.template_name,
      lesson_date: record.lesson_date,
      status: record.status,
      is_adhoc: record.is_adhoc,
      common_data: record.common_data,
      student_data: record.student_data,
      items: toLessonItems(template.items),
    }
  },

  async createLesson(dto: CreateLessonDto): Promise<LessonDetail> {
    await delay()
    // 같은 날 같은 반 수업이 이미 있으면 409
    const existing = db.mockLessonRecords.find(
      (r) => r.class_id === dto.class_id && r.lesson_date === dto.lesson_date
    )
    if (existing) {
      const err: any = new Error('Conflict')
      err.response = { status: 409, data: { data: { id: existing.id, lesson_record_id: existing.id } } }
      throw err
    }

    const cls = db.mockClasses.find((c) => c.id === dto.class_id)
    const template = db.mockTemplates.find((t) => t.id === dto.template_id)
    if (!cls || !template) throw new Error('Class or Template not found')

    const newId = db.ids.nextLessonId++
    const newRecord: db.MockLessonRecord = {
      id: newId,
      class_id: dto.class_id,
      class_name: cls.name,
      academy_name: cls.academy_name,
      template_id: dto.template_id,
      template_name: template.name,
      lesson_date: dto.lesson_date,
      status: dto.status,
      is_adhoc: dto.is_adhoc,
      progress_rate: 0,
      total_students: cls.student_count,
      common_data: dto.common_data,
      student_data: dto.student_data,
    }
    db.mockLessonRecords.push(newRecord)

    return {
      id: newId,
      class_id: dto.class_id,
      class_name: cls.name,
      academy_name: cls.academy_name,
      template_id: dto.template_id,
      template_name: template.name,
      lesson_date: dto.lesson_date,
      status: dto.status,
      is_adhoc: dto.is_adhoc,
      common_data: dto.common_data,
      student_data: dto.student_data,
      items: toLessonItems(template.items),
    }
  },

  async updateLesson(dto: UpdateLessonDto): Promise<LessonDetail> {
    await delay()
    const record = db.mockLessonRecords.find((r) => r.id === dto.lesson_id)
    if (!record) throw new Error(`Lesson ${dto.lesson_id} not found`)

    record.common_data = dto.common_data
    record.student_data = dto.student_data
    if (dto.status) record.status = dto.status
    if (dto.template_id) record.template_id = dto.template_id

    const template = db.mockTemplates.find((t) => t.id === record.template_id)
    if (template) {
      record.progress_rate = calcProgressRate(dto.student_data, record.total_students, template.items)
    }

    const cls = db.mockClasses.find((c) => c.id === record.class_id)
    return {
      id: record.id,
      class_id: record.class_id,
      class_name: record.class_name,
      academy_name: record.academy_name,
      template_id: record.template_id,
      template_name: record.template_name,
      lesson_date: record.lesson_date,
      status: record.status,
      is_adhoc: record.is_adhoc,
      common_data: record.common_data,
      student_data: record.student_data,
      items: template ? toLessonItems(template.items) : [],
    }
  },

  async saveLesson(id: number): Promise<void> {
    await delay()
    const record = db.mockLessonRecords.find((r) => r.id === id)
    if (record) record.status = 'SAVED'
  },

  async previewLesson(id: number): Promise<any> {
    await delay()
    const record = db.mockLessonRecords.find((r) => r.id === id)
    return record ?? null
  },

  async exportLesson(_id: number): Promise<Blob> {
    await delay()
    return new Blob(['mock export'], { type: 'application/vnd.ms-excel' })
  },
}
