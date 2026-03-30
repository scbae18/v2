'use client'

import { useState } from 'react'
import {
  DEFAULT_AI_SETTINGS, TONE_PRESET_LABELS, TONE_SAMPLES,
  DATA_PERIOD_LABELS, FEEDBACK_LENGTH_LABELS,
  type AiSettings, type FeedbackTonePreset, type DataPeriod, type FeedbackLength,
} from '@/mock/ai-settings.mock'
import { colors } from '@/styles/tokens/colors'
import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
import Toggle from '@/components/common/Toggle'

const c = colors

function SectionBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: c.white, borderRadius: 16, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div style={{ fontWeight: 700, fontSize: 15, color: c.gray900, marginBottom: 20, paddingBottom: 14, borderBottom: `1px solid ${c.gray75}` }}>{title}</div>
      {children}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 13, fontWeight: 600, color: c.gray700, marginBottom: 8 }}>{children}</div>
}

function RadioGroup<T extends string>({ options, value, onChange }: { options: Record<T, string>; value: T; onChange: (v: T) => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {(Object.entries(options) as [T, string][]).map(([key, label]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500,
            border: `1.5px solid ${value === key ? c.primary500 : c.gray100}`,
            background: value === key ? c.primary50 : c.white,
            color: value === key ? c.primary500 : c.gray600, cursor: 'pointer',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default function AiSettingsPage() {
  const [settings, setSettings] = useState<AiSettings>(DEFAULT_AI_SETTINGS)

  const update = <K extends keyof AiSettings>(key: K, value: AiSettings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }))

  const previewText = settings.tonePreset === 'custom'
    ? settings.customToneExample || '직접 입력한 예시 문구가 여기에 표시돼요.'
    : TONE_SAMPLES[settings.tonePreset]

  const handleSave = () => {
    console.log('[AI 조교 설정 저장]', settings)
    alert('설정이 저장됐어요. (console.log 확인)')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 720 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text variant="display" as="h1">AI 조교 설정</Text>
        <Button variant="primary" size="sm" onClick={handleSave}>저장</Button>
      </div>

      {/* 1. 피드백 톤 설정 */}
      <SectionBox title="피드백 톤">
        <div style={{ marginBottom: 20 }}>
          <Label>톤 프리셋</Label>
          <RadioGroup<FeedbackTonePreset>
            options={TONE_PRESET_LABELS}
            value={settings.tonePreset}
            onChange={(v) => update('tonePreset', v)}
          />
        </div>

        {settings.tonePreset === 'custom' && (
          <div style={{ marginBottom: 20 }}>
            <Label>말투 예시 직접 작성</Label>
            <textarea
              value={settings.customToneExample}
              onChange={(e) => update('customToneExample', e.target.value)}
              placeholder="예: 안녕하세요! 오늘도 정말 잘 따라와줬어요 ☺️"
              rows={3}
              style={{
                width: '100%', padding: '12px', borderRadius: 10, border: `1.5px solid ${c.gray100}`,
                fontSize: 13, resize: 'vertical', outline: 'none', boxSizing: 'border-box', color: c.gray900,
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <Label>마무리 문구</Label>
          <input
            value={settings.closingPhrase}
            onChange={(e) => update('closingPhrase', e.target.value)}
            placeholder="예: 다음 수업에서 만나요!"
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${c.gray100}`,
              fontSize: 13, outline: 'none', boxSizing: 'border-box', color: c.gray900,
            }}
          />
        </div>

        {/* 톤 프리뷰 */}
        <div>
          <Label>미리보기</Label>
          <div style={{ background: c.primary50, borderRadius: 12, padding: '14px 16px', borderLeft: `4px solid ${c.primary400}` }}>
            <div style={{ fontSize: 11, color: c.primary500, fontWeight: 700, marginBottom: 6 }}>샘플 피드백</div>
            <p style={{ fontSize: 13, color: c.gray700, lineHeight: 1.7, margin: 0 }}>{previewText}</p>
            {settings.closingPhrase && (
              <p style={{ fontSize: 13, color: c.gray500, marginTop: 8, margin: '8px 0 0' }}>{settings.closingPhrase}</p>
            )}
          </div>
        </div>
      </SectionBox>

      {/* 2. 피드백 생성 기준 */}
      <SectionBox title="피드백 생성 기준">
        <div style={{ marginBottom: 20 }}>
          <Label>데이터 기간</Label>
          <RadioGroup<DataPeriod>
            options={DATA_PERIOD_LABELS}
            value={settings.dataPeriod}
            onChange={(v) => update('dataPeriod', v)}
          />
          {settings.dataPeriod === 'custom' && (
            <div style={{ display: 'flex', gap: 10, marginTop: 12, alignItems: 'center' }}>
              <input type="date" value={settings.customDateFrom ?? ''} onChange={(e) => update('customDateFrom', e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 8, border: `1.5px solid ${c.gray100}`, fontSize: 13, outline: 'none' }} />
              <span style={{ color: c.gray300 }}>~</span>
              <input type="date" value={settings.customDateTo ?? ''} onChange={(e) => update('customDateTo', e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 8, border: `1.5px solid ${c.gray100}`, fontSize: 13, outline: 'none' }} />
            </div>
          )}
        </div>

        <div>
          <Label>피드백 길이</Label>
          <RadioGroup<FeedbackLength>
            options={FEEDBACK_LENGTH_LABELS}
            value={settings.feedbackLength}
            onChange={(v) => update('feedbackLength', v)}
          />
        </div>
      </SectionBox>

      {/* 3. 기타 설정 */}
      <SectionBox title="기타 설정">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: c.gray900 }}>이모지 사용</div>
            <div style={{ fontSize: 12, color: c.gray500, marginTop: 2 }}>피드백에 이모지를 포함해요</div>
          </div>
          <Toggle checked={settings.useEmoji} onChange={(v) => update('useEmoji', v)} />
        </div>

        <div>
          <Label>필수 포함 내용</Label>
          <textarea
            value={settings.mustInclude}
            onChange={(e) => update('mustInclude', e.target.value)}
            placeholder="예: 과제 제출 여부, 다음 수업 안내"
            rows={2}
            style={{
              width: '100%', padding: '12px', borderRadius: 10, border: `1.5px solid ${c.gray100}`,
              fontSize: 13, resize: 'vertical', outline: 'none', boxSizing: 'border-box', color: c.gray900,
            }}
          />
          <div style={{ fontSize: 11, color: c.gray300, marginTop: 4 }}>항상 피드백에 언급할 내용을 입력하세요 (쉼표로 구분)</div>
        </div>
      </SectionBox>
    </div>
  )
}
