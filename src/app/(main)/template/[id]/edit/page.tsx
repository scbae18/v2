'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
import ArrowLeftIcon from '@/assets/icons/icon-arrow-left.svg'
import SaveIcon from '@/assets/icons/icon-save.svg'
import TemplateName from '../../_components/TemplateName/TemplateName'
import ContentSection from '../../_components/ContentSection/ContentSection'
import MessageSettings from '../../_components/MessageSettings/MessageSettings'
import MessagePreview from '../../_components/MessagePreview/MessagePreview'
import { colors } from '@/styles/tokens/colors'

const c = colors

function MessageIntroOutroSection({
  intro, outro, onIntroChange, onOutroChange,
}: { intro: string; outro: string; onIntroChange: (v: string) => void; onOutroChange: (v: string) => void }) {
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 15, color: c.gray900, marginBottom: 4 }}>알림톡 인트로 / 아웃트로</div>
      <div style={{ fontSize: 12, color: c.gray500, marginBottom: 16 }}>
        수업 결과 문자 상단/하단에 삽입되는 문구입니다.
        <br />
        <code style={{ background: c.gray50, padding: '1px 5px', borderRadius: 4, fontSize: 11 }}>{'{학부모님}'}</code>{' '}
        <code style={{ background: c.gray50, padding: '1px 5px', borderRadius: 4, fontSize: 11 }}>{'{선생님}'}</code>{' '}
        <code style={{ background: c.gray50, padding: '1px 5px', borderRadius: 4, fontSize: 11 }}>{'{학생이름}'}</code>{' '}
        변수 사용 가능
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: c.gray700, marginBottom: 6 }}>인트로 (상단)</div>
          <textarea
            value={intro}
            onChange={(e) => onIntroChange(e.target.value)}
            rows={3}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 10,
              border: `1.5px solid ${c.gray100}`, fontSize: 13, resize: 'vertical',
              outline: 'none', boxSizing: 'border-box', color: c.gray900, lineHeight: 1.6,
            }}
          />
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: c.gray700, marginBottom: 6 }}>아웃트로 (하단)</div>
          <textarea
            value={outro}
            onChange={(e) => onOutroChange(e.target.value)}
            rows={2}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 10,
              border: `1.5px solid ${c.gray100}`, fontSize: 13, resize: 'vertical',
              outline: 'none', boxSizing: 'border-box', color: c.gray900, lineHeight: 1.6,
            }}
          />
        </div>
      </div>
    </div>
  )
}
import {
  pageStyle,
  leftSectionStyle,
  rightSectionStyle,
  sectionBoxStyle,
  formHeaderStyle,
  formHeaderLeftStyle,
  formBackButtonStyle,
} from '../../template-form.css'
import useTemplateEditor from '@/hooks/useTemplateEditor'
import { templateService, toEditorItems } from '@/services/template'
import type { TemplateItem } from '../../_types/template'

type EditorInitialData = Parameters<typeof useTemplateEditor>[0]

const ATTENDANCE_DISPLAY: TemplateItem = {
  id: '__attendance__',
  label: '출결 *',
  isActive: true,
  isInMessage: true,
  locked: true,
  category: 'individual',
  itemType: 'attendance',
}

function TemplateEditForm({ id, initialData }: { id: number; initialData: EditorInitialData }) {
  const router = useRouter()
  const editor = useTemplateEditor(initialData)

  return (
    <>
      <div className={formHeaderStyle}>
        <div className={formHeaderLeftStyle}>
          <button className={formBackButtonStyle} onClick={() => router.back()}>
            <ArrowLeftIcon width={24} height={24} />
          </button>
          <Text variant="display" as="h1">
            수업 템플릿 수정
          </Text>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<SaveIcon width={16} height={16} />}
          onClick={() => editor.handleUpdate(id)}
          disabled={editor.isSaving}
        >
          {editor.isSaving ? '저장 중...' : '저장'}
        </Button>
      </div>
      <div className={pageStyle}>
        <div className={leftSectionStyle}>
          <div className={sectionBoxStyle}>
            <TemplateName value={editor.templateName} onChange={editor.setTemplateName} />
            <div style={{ marginTop: '100px' }}>
              <ContentSection
                title="공통 내용"
                description="모든 학생에게 동일하게 전달할 내용이에요"
                items={editor.commonItems}
                onToggle={editor.handleToggleCommonItem}
                onDelete={editor.handleDeleteCommonItem}
                onAddInline={editor.handleAddCommonItem}
                onUpdate={editor.handleUpdateCommonItem}
              />
            </div>
            <div style={{ marginTop: '100px' }}>
              <ContentSection
                title="개별 내용"
                description="학생마다 다르게 전달할 내용이에요"
                items={[ATTENDANCE_DISPLAY, ...editor.individualItems]}
                onToggle={(id) => {
                  if (id !== '__attendance__') editor.handleToggleIndividualItem(id)
                }}
                onDelete={(id) => {
                  if (id !== '__attendance__') editor.handleDeleteIndividualItem(id)
                }}
                onAdd={editor.handleAddIndividualItem}
              />
            </div>
          </div>
        </div>
        <div className={rightSectionStyle}>
          <div className={sectionBoxStyle}>
            <MessageSettings
              messageOrder={editor.messageOrder}
              allItemsMap={editor.allItemsMap}
              onToggle={editor.handleMessagePreviewToggle}
              onReorder={editor.handleMessageReorder}
            />
          </div>
          <div className={sectionBoxStyle}>
            <MessageIntroOutroSection
              intro={editor.messageIntro}
              outro={editor.messageOutro}
              onIntroChange={editor.setMessageIntro}
              onOutroChange={editor.setMessageOutro}
            />
          </div>
          <div className={sectionBoxStyle}>
            <MessagePreview
              messageOrder={editor.messageOrder}
              allItemsMap={editor.allItemsMap}
              intro={editor.messageIntro}
              outro={editor.messageOutro}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default function TemplateEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [initialData, setInitialData] = useState<EditorInitialData>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    templateService.getTemplate(Number(id))
      .then((detail) => {
        setInitialData(toEditorItems(detail))
        setIsLoading(false)
      })
      .catch(() => {
        alert('템플릿을 불러오지 못했습니다.')
        router.push('/template')
      })
  }, [id])

  if (isLoading || !initialData) return null

  return <TemplateEditForm id={Number(id)} initialData={initialData} />
}