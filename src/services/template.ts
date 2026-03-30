import type { TemplateItem as EditorItem } from '@/app/(main)/template/_types/template'
import * as db from '@/mocks/_db'

export interface TemplateItemDetail {
  id: number
  name: string
  item_type: 'TEXT' | 'NUMBER' | 'SELECT' | 'COMPLETE' | 'ATTENDANCE'
  is_common: boolean
  include_in_message: boolean
  is_default_attendance: boolean
  sort_order: number
  options?: string[]
}

export interface TemplateClass {
  id: number
  name: string
}

export interface Template {
  id: number
  name: string
  item_count: number
  class_count: number
  class_list: TemplateClass[]
  created_at: string
}

export interface TemplateDetail extends Template {
  id: number
  name: string
  items: TemplateItemDetail[]
}

export interface CreateTemplateItemDto {
  id?: number
  name: string
  item_type: string
  is_common: boolean
  include_in_message: boolean
  sort_order: number
  options: string[]
}

export interface CreateTemplateDto {
  name: string
  items: CreateTemplateItemDto[]
}

export interface UpdateTemplateItemDto {
  id?: number
  name?: string
  item_type?: string
  is_common?: boolean
  include_in_message?: boolean
  sort_order?: number
  options?: string[]
}

export interface UpdateTemplateDto {
  name?: string
  items?: UpdateTemplateItemDto[]
  deleted_item_ids?: number[]
}

const API_TO_ITEM_TYPE: Record<string, EditorItem['itemType']> = {
  TEXT: 'text',
  NUMBER: 'number',
  SELECT: 'choice',
  COMPLETE: 'completion',
}

export const toEditorItems = (detail: TemplateDetail) => {
  const sorted = [...detail.items].sort((a, b) => a.sort_order - b.sort_order)
  const attendanceItems = sorted.filter((i) => i.item_type === 'ATTENDANCE')
  const attendanceItemIds = attendanceItems.map((i) => i.id)
  const nonAttendance = sorted.filter((i) => i.item_type !== 'ATTENDANCE')

  const toItem = (item: TemplateItemDetail): EditorItem => ({
    id: String(item.id),
    label: item.name,
    isActive: true,
    isInMessage: item.include_in_message,
    category: item.is_common ? 'common' : 'individual',
    itemType: API_TO_ITEM_TYPE[item.item_type] ?? 'text',
    choices: item.options?.map((o: any) => (typeof o === 'string' ? o : o.label)) ?? [],
  })

  const messageOrder = sorted
    .map((i) => (i.item_type === 'ATTENDANCE' ? '__attendance__' : String(i.id)))
    .filter((id, index, self) => self.indexOf(id) === index)

  return {
    name: detail.name,
    commonItems: nonAttendance.filter((i) => i.is_common).map(toItem),
    individualItems: nonAttendance.filter((i) => !i.is_common).map(toItem),
    attendanceItemIds,
    messageOrder,
  }
}

const delay = () => new Promise((r) => setTimeout(r, 80))

const toDetail = (t: (typeof db.mockTemplates)[number]): TemplateDetail => ({
  id: t.id,
  name: t.name,
  item_count: t.items.length,
  class_count: t.class_list.length,
  class_list: t.class_list,
  created_at: t.created_at,
  items: t.items as TemplateItemDetail[],
})

export const templateService = {
  async getTemplates(): Promise<Template[]> {
    await delay()
    return db.mockTemplates.map(toDetail)
  },

  async getTemplate(id: number): Promise<TemplateDetail> {
    await delay()
    const t = db.mockTemplates.find((t) => t.id === id)
    if (!t) throw new Error(`Template ${id} not found`)
    return toDetail(t)
  },

  async createTemplate(dto: CreateTemplateDto): Promise<TemplateDetail> {
    await delay()
    const newId = db.ids.nextTemplateId++
    const newTemplate = {
      id: newId,
      name: dto.name,
      item_count: dto.items.length,
      class_count: 0,
      class_list: [],
      created_at: new Date().toISOString(),
      items: dto.items.map((item, idx) => ({
        id: newId * 100 + idx,
        name: item.name,
        item_type: item.item_type as any,
        is_common: item.is_common,
        include_in_message: item.include_in_message,
        is_default_attendance: item.item_type === 'ATTENDANCE',
        sort_order: item.sort_order,
        options: item.options,
      })),
    }
    db.mockTemplates.push(newTemplate)
    return toDetail(newTemplate)
  },

  async updateTemplate(id: number, dto: UpdateTemplateDto): Promise<TemplateDetail> {
    await delay()
    const t = db.mockTemplates.find((t) => t.id === id)
    if (!t) throw new Error(`Template ${id} not found`)
    if (dto.name !== undefined) t.name = dto.name
    if (dto.items !== undefined) {
      t.items = dto.items.map((item, idx) => ({
        id: item.id ?? t.id * 100 + idx,
        name: item.name ?? '',
        item_type: (item.item_type ?? 'TEXT') as any,
        is_common: item.is_common ?? false,
        include_in_message: item.include_in_message ?? true,
        is_default_attendance: item.item_type === 'ATTENDANCE',
        sort_order: item.sort_order ?? idx,
        options: item.options ?? [],
      }))
    }
    if (dto.deleted_item_ids?.length) {
      t.items = t.items.filter((i) => !dto.deleted_item_ids!.includes(i.id))
    }
    return toDetail(t)
  },

  async deleteTemplate(id: number): Promise<void> {
    await delay()
    const idx = db.mockTemplates.findIndex((t) => t.id === id)
    if (idx !== -1) db.mockTemplates.splice(idx, 1)
  },
}
