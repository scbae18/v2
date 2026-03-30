'use client'

import { use, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
import ArrowLeftIcon from '@/assets/icons/icon-arrow-left.svg'
import DownloadIcon from '@/assets/icons/icon-download.svg'
import SaveIcon from '@/assets/icons/icon-save.svg'
import ChevronDownIcon from '@/assets/icons/icon-chevron-down.svg'
import MessageIcon from '@/assets/icons/icon-message.svg'
import LessonTable from './_components/LessonTableSection/LessonTableSection'
import CommonContent from './_components/CommonContent/CommonContent'
import ProgressBar from './_components/ProgressBar/ProgressBar'
import MessagePreview from './_components/MessagePreview/MessagePreview'
import ConfirmModal from '@/components/common/ConfirmModal'
import TemplateSelectModal from '../_components/TemplateSelectModal/TemplateSelectModal'
import {
  pageStyle,
  headerStyle,
  footerStyle,
  sectionStyle,
  backButtonStyle,
  headerLeftStyle,
  headerButtonGroupStyle,
  templateChipButtonStyle,
} from './lessonDetail.css'
import useLessonDetail from '@/hooks/useLessonDetail'
import useDisclosure from '@/hooks/useDisclosure'
import { lessonService } from '@/services/lesson'
import { useToastStore } from '@/stores/toastStore'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { createAttendanceSession, updateAttendanceStatus, type AttendanceSession, type AttendanceStatus } from '@/mock/attendance.mock'
import { colors } from '@/styles/tokens/colors'
import { useUserStore } from '@/stores/userStore'
import { format as formatDate } from 'date-fns'
import { ko as koLocale } from 'date-fns/locale'

const c = colors

// ─── 알림톡 발송 모달 ───────────────────────────────────────────────────
interface NotifyStudent {
  id: number
  name: string
  phone: string
  parentPhone: string
  message: string
}

function NotifyModal({
  isOpen,
  onClose,
  students,
  lessonLabel,
}: {
  isOpen: boolean
  onClose: () => void
  students: NotifyStudent[]
  lessonLabel: string
}) {
  const [selected, setSelected] = useState<number[]>(students.map((s) => s.id))
  const [previewId, setPreviewId] = useState<number>(students[0]?.id ?? 0)
  const [sent, setSent] = useState(false)

  const toggleAll = () =>
    setSelected((prev) => (prev.length === students.length ? [] : students.map((s) => s.id)))

  const toggle = (id: number) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const preview = students.find((s) => s.id === previewId)

  const handleSend = () => {
    setSent(true)
    setTimeout(() => { setSent(false); onClose() }, 1800)
  }

  if (!isOpen) return null

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 780, maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: `1px solid ${c.gray75}` }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, color: c.gray900 }}>알림톡 발송하기</div>
            <div style={{ fontSize: 12, color: c.gray500, marginTop: 3 }}>{lessonLabel}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: c.gray300 }}>✕</button>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
          {/* 왼쪽: 학생 선택 */}
          <div style={{ width: 240, borderRight: `1px solid ${c.gray75}`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${c.gray50}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: c.gray700 }}>발송 대상 ({selected.length}명)</span>
              <button onClick={toggleAll} style={{ fontSize: 11, color: c.primary500, background: 'none', border: 'none', cursor: 'pointer' }}>
                {selected.length === students.length ? '전체 해제' : '전체 선택'}
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {students.map((s) => (
                <div
                  key={s.id}
                  onClick={() => { toggle(s.id); setPreviewId(s.id) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', cursor: 'pointer',
                    background: previewId === s.id ? c.primary50 : 'transparent',
                    borderBottom: `1px solid ${c.gray50}`,
                  }}
                >
                  <input type="checkbox" checked={selected.includes(s.id)} onChange={() => {}} style={{ cursor: 'pointer' }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: c.gray900 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: c.gray300 }}>{s.parentPhone || s.phone || '-'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽: 미리보기 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '12px 20px', borderBottom: `1px solid ${c.gray50}`, fontSize: 13, fontWeight: 600, color: c.gray700 }}>
              미리보기 — {preview?.name ?? '학생 선택'}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {preview ? (
                <div style={{ background: c.gray50, borderRadius: 12, padding: '16px 18px', fontSize: 13, color: c.gray700, whiteSpace: 'pre-wrap', lineHeight: 1.75 }}>
                  {preview.message}
                </div>
              ) : (
                <p style={{ color: c.gray300, fontSize: 13 }}>왼쪽에서 학생을 선택하면 미리보기가 표시돼요.</p>
              )}
            </div>
          </div>
        </div>

        {/* 하단 발송 버튼 */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${c.gray75}`, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button variant="ghost" size="sm" onClick={onClose}>취소</Button>
          <Button
            variant="primary"
            size="sm"
            disabled={selected.length === 0 || sent}
            onClick={handleSend}
          >
            {sent ? '발송 완료! ✓' : `${selected.length}명에게 발송`}
          </Button>
        </div>
      </div>
    </div>
  )
}

const TIME_PRESETS = [
  { label: '5분', seconds: 300 },
  { label: '10분', seconds: 600 },
  { label: '15분', seconds: 900 },
  { label: '20분', seconds: 1200 },
]

// 제한시간 설정 패널
function AttendanceSetupPanel({
  onStart,
  onCancel,
}: {
  onStart: (limitSeconds: number) => void
  onCancel: () => void
}) {
  const [selected, setSelected] = useState(600) // 기본 10분
  const [custom, setCustom] = useState('')
  const [useCustom, setUseCustom] = useState(false)

  const effectiveSeconds = useCustom ? (Number(custom) * 60 || 0) : selected

  return (
    <div style={{
      background: '#fff', border: `1.5px solid ${c.primary200}`, borderRadius: 16,
      padding: '20px 24px', marginBottom: 8, boxShadow: '0 2px 12px rgba(59,81,204,0.10)',
    }}>
      <div style={{ fontWeight: 700, fontSize: 15, color: c.gray900, marginBottom: 16 }}>출결 시작 설정</div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: c.gray600, marginBottom: 10 }}>제한 시간</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {TIME_PRESETS.map((p) => (
            <button
              key={p.seconds}
              onClick={() => { setSelected(p.seconds); setUseCustom(false) }}
              style={{
                padding: '8px 18px', borderRadius: 20, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                border: `2px solid ${!useCustom && selected === p.seconds ? c.primary500 : c.gray100}`,
                background: !useCustom && selected === p.seconds ? c.primary50 : '#fff',
                color: !useCustom && selected === p.seconds ? c.primary500 : c.gray600,
              }}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={() => setUseCustom(true)}
            style={{
              padding: '8px 18px', borderRadius: 20, fontSize: 14, fontWeight: 600, cursor: 'pointer',
              border: `2px solid ${useCustom ? c.primary500 : c.gray100}`,
              background: useCustom ? c.primary50 : '#fff',
              color: useCustom ? c.primary500 : c.gray600,
            }}
          >
            직접 입력
          </button>
        </div>
        {useCustom && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <input
              type="number" min={1} max={60}
              value={custom} onChange={(e) => setCustom(e.target.value)}
              placeholder="분 입력"
              style={{ width: 80, padding: '8px 12px', borderRadius: 8, border: `1.5px solid ${c.gray100}`, fontSize: 14, outline: 'none' }}
            />
            <span style={{ fontSize: 13, color: c.gray600 }}>분</span>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <Button variant="primary" size="sm" onClick={() => onStart(effectiveSeconds)} disabled={useCustom && !custom}>
          출결 시작
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>취소</Button>
      </div>
    </div>
  )
}

// 출결 패널 컴포넌트 (제한시간 카운트다운 포함)
function AttendancePanel({
  session,
  limitSeconds,
  onManualChange,
  onApply,
  onClose,
}: {
  session: AttendanceSession
  limitSeconds: number
  onManualChange: (studentId: number, status: AttendanceStatus) => void
  onApply: () => void
  onClose: () => void
}) {
  const [remaining, setRemaining] = useState(limitSeconds)

  useEffect(() => {
    // 2초마다 세션 갱신 + 1초마다 카운트다운
    const syncTimer = setInterval(() => {
      const s = session // 최신 session 참조 (React state로 전달됨)
      void s // trigger re-render by referencing
    }, 2000)
    const countTimer = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => { clearInterval(syncTimer); clearInterval(countTimer) }
  }, [])

  const checked = session.students.filter((s) => s.status !== '미확인').length
  const total = session.students.length
  const isExpired = remaining === 0
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')

  const statusColors: Record<AttendanceStatus, { bg: string; text: string }> = {
    출석: { bg: c.success50, text: c.success500 },
    지각: { bg: c.warning50, text: c.warning500 },
    미확인: { bg: c.gray50, text: c.gray500 },
  }

  return (
    <div style={{
      background: '#fff', border: `1.5px solid ${isExpired ? c.error200 : c.primary200}`, borderRadius: 16,
      padding: '20px 24px', marginBottom: 8,
      boxShadow: `0 2px 12px ${isExpired ? 'rgba(239,68,83,0.10)' : 'rgba(59,81,204,0.10)'}`,
    }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: isExpired ? c.error500 : c.gray900 }}>
            {isExpired ? '출결 시간 종료' : '출결 진행 중'}
          </div>
          <span style={{ background: c.primary50, color: c.primary500, borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>
            {checked}/{total}명 확인
          </span>
          {/* 카운트다운 */}
          <span style={{
            background: isExpired ? c.error50 : remaining < 60 ? c.warning50 : c.gray50,
            color: isExpired ? c.error500 : remaining < 60 ? c.warning500 : c.gray600,
            borderRadius: 20, padding: '2px 12px', fontSize: 13, fontWeight: 700,
          }}>
            {isExpired ? '시간 초과' : `${mm}:${ss} 남음`}
          </span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.gray300, fontSize: 18 }}>✕</button>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
        {/* 코드 */}
        <div style={{
          background: isExpired ? c.gray200 : c.primary500,
          borderRadius: 12, padding: '16px 24px', color: '#fff', textAlign: 'center', flexShrink: 0,
        }}>
          <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>출결 코드</div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: 6 }}>{isExpired ? '----' : session.code}</div>
          <div style={{ fontSize: 11, opacity: 0.75, marginTop: 4 }}>{isExpired ? '시간이 만료됐어요' : '화면에 보여주세요'}</div>
        </div>

        {/* 학생 링크 */}
        {!isExpired && (
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 12, color: c.gray500, marginBottom: 6 }}>학생 참여 링크</div>
            <div style={{ background: c.gray50, borderRadius: 10, padding: '10px 14px', fontSize: 12, color: c.primary500, wordBreak: 'break-all', marginBottom: 8 }}>
              {session.studentLink}
            </div>
            <button
              onClick={() => { void navigator.clipboard?.writeText(session.studentLink); alert('링크가 복사됐어요.') }}
              style={{ fontSize: 12, color: c.primary500, background: c.primary50, border: 'none', borderRadius: 6, padding: '5px 12px', cursor: 'pointer' }}
            >
              링크 복사
            </button>
          </div>
        )}
      </div>

      {/* 학생 현황 + 수기 수정 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
        {session.students.map((s) => (
          <div key={s.studentId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: c.gray50, borderRadius: 8 }}>
            <div>
              <span style={{ fontSize: 14, fontWeight: 600, color: c.gray900 }}>{s.name}</span>
              {s.checkedAt && <span style={{ fontSize: 11, color: c.gray500, marginLeft: 8 }}>{s.checkedAt}</span>}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['출석', '지각', '미확인'] as AttendanceStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => onManualChange(s.studentId, status)}
                  style={{
                    padding: '4px 10px', borderRadius: 14, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    background: s.status === status ? statusColors[status].bg : '#fff',
                    color: s.status === status ? statusColors[status].text : c.gray300,
                    border: `1.5px solid ${s.status === status ? statusColors[status].text : c.gray100}`,
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <Button variant="primary" size="sm" onClick={onApply}>출결 적용</Button>
        <Button variant="ghost" size="sm" onClick={onClose}>종료</Button>
        {!isExpired && (
          <span style={{ fontSize: 11, color: c.gray300, display: 'flex', alignItems: 'center' }}>
            2초마다 자동 갱신 중…
          </span>
        )}
      </div>
    </div>
  )
}

export default function LessonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const lessonId = Number(id)
  const router = useRouter()
  const addToast = useToastStore((s) => s.addToast)

  const {
    lesson,
    error,
    commonValues,
    setCommonValues,
    students,
    setStudents,
    messagePreview,
    inputCount,
    isLoading,
    handleExcelDownload,
    refetch,
  } = useLessonDetail(lessonId)

  const user = useUserStore((s) => s.user)
  const teacherName = user?.name ?? ''

  const templateModal = useDisclosure()
  const confirmModal = useDisclosure()
  const notifyModal = useDisclosure()
  const [pendingTemplateId, setPendingTemplateId] = useState<number | null>(null)

  // 출결 세션
  const [attSetup, setAttSetup] = useState(false) // 제한시간 설정 단계
  const [attSession, setAttSession] = useState<AttendanceSession | null>(null)
  const [attLimitSeconds, setAttLimitSeconds] = useState(600)
  const attInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  const openAttSetup = () => setAttSetup(true)

  const startAttendance = (limitSeconds: number) => {
    if (!lesson) return
    setAttSetup(false)
    setAttLimitSeconds(limitSeconds)
    const session = createAttendanceSession(
      lessonId,
      lesson.class_id,
      lesson.class_name,
      lesson.lesson_date,
      students.map((s) => ({ id: s.id, name: s.name }))
    )
    setAttSession({ ...session, students: [...session.students] })
    // 2초마다 세션 상태 반영
    attInterval.current = setInterval(() => {
      setAttSession((prev) => prev ? { ...prev, students: [...prev.students] } : null)
    }, 2000)
  }

  const stopAttendance = () => {
    if (attInterval.current) clearInterval(attInterval.current)
    setAttSession(null)
    setAttSetup(false)
  }

  const applyAttendance = () => {
    if (!attSession) return
    setStudents((prev) => prev.map((s) => {
      const record = attSession.students.find((r) => r.studentId === s.id)
      if (!record) return s
      const mapped: '출석' | '지각' | '결석' | null =
        record.status === '출석' ? '출석'
        : record.status === '지각' ? '지각'
        : null
      return { ...s, attendance: mapped }
    }))
    stopAttendance()
    addToast({ variant: 'success', message: '출결이 적용됐어요.' })
  }

  const handleManualAttendance = (studentId: number, status: AttendanceStatus) => {
    if (!attSession) return
    updateAttendanceStatus(attSession.sessionId, studentId, status)
    setAttSession((prev) => prev ? { ...prev, students: [...prev.students] } : null)
  }

  const handleSave = async () => {
    if (!lesson) return
    try {
      const attendanceItem = lesson.items.find((i) => i.item_type === 'ATTENDANCE')
      await lessonService.updateLesson({
        lesson_id: lessonId,
        class_id: lesson.class_id,
        lesson_date: lesson.lesson_date,
        template_id: lesson.template_id,
        status: 'SAVED',
        common_data: Object.entries(commonValues).map(([id, value]) => ({
          template_item_id: Number(id),
          value,
        })),
        student_data: students.map((s) => ({
          student_id: s.id,
          items: [
            ...(attendanceItem
              ? [
                  {
                    template_item_id: attendanceItem.id,
                    value: s.attendance ?? '',
                    is_completed: false,
                  },
                ]
              : []),
            ...s.items.map((item) => ({
              template_item_id: item.template_item_id,
              value: item.value,
              // Fix #2: null(미선택)은 null 그대로 전송, ?? false 제거
              is_completed: item.is_completed ?? undefined,
            })),
          ],
        })),
      })
      addToast({ variant: 'success', message: '저장됐어요.' })
    } catch {
      addToast({ variant: 'error', message: '저장에 실패했어요.' })
    }
  }

  const handleTemplateSelect = (templateId: number) => {
    setPendingTemplateId(templateId)
    templateModal.close()
    confirmModal.open()
  }

  const handleTemplateChange = async (templateId?: number) => {
    const targetId = templateId ?? pendingTemplateId
    if (!lesson || !targetId) return
    confirmModal.close()
    templateModal.close()
    try {
      await lessonService.updateLesson({
        lesson_id: lessonId,
        class_id: lesson.class_id,
        lesson_date: lesson.lesson_date,
        template_id: targetId,
        status: 'SAVED',
        common_data: [],
        student_data: students.map((s) => ({ student_id: s.id, items: [] })),
      })
      refetch()
    } catch {
      addToast({ variant: 'error', message: '템플릿 변경에 실패했어요.' })
    } finally {
      setPendingTemplateId(null)
    }
  }

  if (isLoading || !lesson) return null

  // 템플릿 삭제된 경우
  if (error === 'TEMPLATE_NOT_FOUND') {
    return (
      <div className={pageStyle}>
        <div className={headerStyle}>
          <div className={headerLeftStyle}>
            <button onClick={() => router.push('/lesson')} className={backButtonStyle}>
              <ArrowLeftIcon width={24} height={24} />
            </button>
            <Text variant="display" as="h1">
              {format(new Date(lesson.lesson_date), 'M월 d일(E)', { locale: ko })}{' '}
              {lesson.class_name}
            </Text>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            minHeight: 'calc(100vh - 300px)',
          }}
        >
          <Text variant="headingMd">템플릿이 삭제됐어요</Text>
          <Text variant="bodyLg" color="gray500">
            다른 템플릿을 선택해주세요
          </Text>
          <Button variant="primary" size="md" onClick={templateModal.open}>
            템플릿 선택
          </Button>
        </div>
        <TemplateSelectModal
          isOpen={templateModal.isOpen}
          onClose={templateModal.close}
          onConfirm={handleTemplateChange}
          title="템플릿 선택"
          confirmLabel="선택"
        />
      </div>
    )
  }

  const commonItems = lesson.items
    .filter((i) => i.is_common)
    .map((i) => ({ id: i.id, label: i.name }))

  return (
    <div className={pageStyle}>
      {/* 헤더 */}
      <div className={headerStyle}>
        <div className={headerLeftStyle}>
          <button onClick={() => router.push('/lesson')} className={backButtonStyle}>
            <ArrowLeftIcon width={24} height={24} />
          </button>
          <Text variant="display" as="h1">
            {format(new Date(lesson.lesson_date), 'M월 d일(E)', { locale: ko })} {lesson.class_name}
          </Text>
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ChevronDownIcon width={20} height={20} />}
            onClick={templateModal.open}
            className={templateChipButtonStyle}
          >
            {lesson.template_name}
          </Button>
        </div>
        <div className={headerButtonGroupStyle}>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<DownloadIcon width={20} height={20} />}
            onClick={handleExcelDownload}
          >
            엑셀 다운로드
          </Button>
          {!attSession && !attSetup ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={openAttSetup}
            >
              ✓ 출석 시작하기
            </Button>
          ) : attSession ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={stopAttendance}
              style={{ color: c.error500 }}
            >
              출결 종료
            </Button>
          ) : null}
          <Button
            variant="primary"
            size="sm"
            leftIcon={<SaveIcon width={20} height={20} />}
            onClick={handleSave}
          >
            저장
          </Button>
        </div>
      </div>

      {/* 출결 설정 패널 */}
      {attSetup && !attSession && (
        <div className={sectionStyle}>
          <AttendanceSetupPanel
            onStart={startAttendance}
            onCancel={() => setAttSetup(false)}
          />
        </div>
      )}

      {/* 출결 패널 */}
      {attSession && (
        <div className={sectionStyle}>
          <AttendancePanel
            session={attSession}
            limitSeconds={attLimitSeconds}
            onManualChange={handleManualAttendance}
            onApply={applyAttendance}
            onClose={stopAttendance}
          />
        </div>
      )}

      {/* 공통 내용 */}
      {commonItems.length > 0 && (
        <div className={sectionStyle}>
          <Text variant="headingMd">공통 내용</Text>
          <CommonContent
            items={commonItems}
            values={commonValues}
            onChange={(id, value) => setCommonValues((prev) => ({ ...prev, [id]: value }))}
          />
        </div>
      )}

      {/* 개별 내용 */}
      <div className={sectionStyle}>
        <Text variant="headingMd">개별 내용</Text>
        <LessonTable students={students} templateItems={lesson.items} onChange={setStudents} />
      </div>

      {/* 하단 진행도 */}
      <div className={footerStyle}>
        <ProgressBar current={inputCount} total={students.length} />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<MessageIcon width={20} height={20} />}
            onClick={async () => {
              await handleSave()
              messagePreview.open()
            }}
          >
            문자 미리보기
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<MessageIcon width={20} height={20} />}
            onClick={async () => {
              await handleSave()
              notifyModal.open()
            }}
          >
            알림톡 발송
          </Button>
        </div>
      </div>

      <TemplateSelectModal
        isOpen={templateModal.isOpen}
        onClose={templateModal.close}
        onConfirm={handleTemplateSelect}
        currentTemplateId={lesson.template_id}
        title="템플릿 변경"
        confirmLabel="확인"
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => {
          confirmModal.close()
          setPendingTemplateId(null)
        }}
        onConfirm={() => handleTemplateChange()}
        title="템플릿을 변경할까요?"
        descriptions={['템플릿을 변경하면 입력한 내용이 모두 사라져요.']}
        confirmLabel="변경"
        confirmVariant="danger"
      />

      <MessagePreview
        isOpen={messagePreview.isOpen}
        onClose={messagePreview.close}
        lessonId={lessonId}
        lesson={lesson}
      />

      <NotifyModal
        isOpen={notifyModal.isOpen}
        onClose={notifyModal.close}
        lessonLabel={`${formatDate(new Date(lesson.lesson_date), 'M월 d일(E)', { locale: koLocale })} ${lesson.class_name}`}
        students={students.map((s) => ({
          id: s.id,
          name: s.name,
          phone: '',
          parentPhone: '',
          message: [
            `안녕하세요, ${lesson.academy_name} ${teacherName}강사입니다.\n`,
            `${lesson.class_name} ${formatDate(new Date(lesson.lesson_date), 'M월 d일(E)', { locale: koLocale })} 수업 결과를 안내드립니다.\n`,
            s.attendance ? `✅ 출결: ${s.attendance}` : '',
            ...s.items
              .filter((i) => i.value.trim())
              .map((i) => `📌 ${i.value}`),
            '\n감사합니다.',
          ].filter(Boolean).join('\n'),
        }))}
      />
    </div>
  )
}
