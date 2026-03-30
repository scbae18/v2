'use client'

import { useRouter } from 'next/navigation'
import Text from '@/components/common/Text'
import Chip from '@/components/common/Chip'
import CalendarIcon from '@/assets/icons/icon-calendar.svg'
import UsersIcon from '@/assets/icons/icon-users.svg'
import * as db from '@/mocks/_db'
import {
  cardStyle,
  headerStyle,
  chipGroupStyle,
  dateStyle,
  infoGroupStyle,
  infoRowStyle,
} from './ClassCard.css'

interface ClassCardProps {
  id: number
  academyName: string
  name: string
  schedule: string
  studentCount: number
  isEnded?: boolean
  startDate?: string
  endDate?: string
  onStatusChange?: () => void
}

export default function ClassCard({
  id,
  academyName,
  name,
  schedule,
  studentCount,
  isEnded,
  startDate,
  endDate,
  onStatusChange,
}: ClassCardProps) {
  const router = useRouter()

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    const record = db.mockClasses.find((c) => c.id === id)
    if (!record) return
    if (isEnded) {
      record.ended_at = null
      record.status = '진행 중'
    } else {
      record.ended_at = new Date().toISOString()
      record.status = '종료'
    }
    onStatusChange?.()
  }

  return (
    <div
      className={cardStyle}
      onClick={() => router.push(`/management/${id}`)}
      style={{ opacity: isEnded ? 0.65 : 1, position: 'relative' }}
    >
      <div className={headerStyle}>
        <div className={chipGroupStyle}>
          <Chip variant="default" label={academyName} />
          {isEnded && <Chip variant="ended" label="종료" />}
        </div>
        {isEnded && startDate && endDate && (
          <span className={dateStyle}>{startDate} – {endDate}</span>
        )}
      </div>
      <Text variant="headingLg" as="h3">{name}</Text>
      <div className={infoGroupStyle}>
        <div className={infoRowStyle}>
          <CalendarIcon width={16} height={16} />
          {schedule}
        </div>
        <div className={infoRowStyle}>
          <UsersIcon width={16} height={16} />
          {studentCount}명
        </div>
      </div>

      {/* 종료/재개 토글 버튼 */}
      <button
        onClick={handleToggle}
        style={{
          position: 'absolute', bottom: 12, right: 12,
          padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
          border: 'none', cursor: 'pointer',
          background: isEnded ? '#E0E7F9' : '#FFF1F1',
          color: isEnded ? '#3B51CC' : '#EF4453',
        }}
      >
        {isEnded ? '재개' : '종료'}
      </button>
    </div>
  )
}
