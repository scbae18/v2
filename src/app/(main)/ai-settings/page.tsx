'use client'

import { useState, type ReactElement } from 'react'
import {
  DEFAULT_AI_SETTINGS,
  TONE_PRESET_LABELS,
  TONE_DESCRIPTIONS,
  TONE_SAMPLES,
  DATA_PERIOD_LABELS,
  FEEDBACK_LENGTH_LABELS,
  INCLUDE_CONTENT_LABELS,
  type AiSettings,
  type FeedbackTonePreset,
  type DataPeriod,
  type FeedbackLength,
} from '@/mock/ai-settings.mock'
import { colors } from '@/styles/tokens/colors'
import Toggle from '@/components/common/Toggle'
import Button from '@/components/common/Button'

const c = colors

// ── 아이콘 SVG ──────────────────────────────────────────────────────────────

function IconWarm({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.09 8.26L19 6L15.45 11L22 12L15.45 13L19 18L13.09 15.74L12 22L10.91 15.74L5 18L8.55 13L2 12L8.55 11L5 6L10.91 8.26L12 2Z" fill={color} />
    </svg>
  )
}

function IconAnalytical({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
      <path d="M21 21L16.65 16.65" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconConcise({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M13 2L4.09 12.26L12 12L11 22L19.91 11.74L12 12L13 2Z" fill={color} />
    </svg>
  )
}

function IconCustom({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconCheck({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const TONE_ICONS: Record<FeedbackTonePreset, (props: { color: string }) => ReactElement> = {
  warm: IconWarm,
  analytical: IconAnalytical,
  concise: IconConcise,
  custom: IconCustom,
}

// ── 서브 컴포넌트 ──────────────────────────────────────────────────────────

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: c.white,
      border: `1px solid ${c.gray50}`,
      borderRadius: 20,
      padding: '28px',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    }}>
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 20,
      fontWeight: 600,
      color: c.gray900,
      letterSpacing: '-0.6px',
      lineHeight: 1.4,
      margin: 0,
      marginBottom: 20,
    }}>
      {children}
    </p>
  )
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 16,
      fontWeight: 600,
      color: c.gray700,
      letterSpacing: '-0.48px',
      lineHeight: 1.4,
      margin: 0,
    }}>
      {children}
    </p>
  )
}

function HintText({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 14,
      fontWeight: 500,
      color: c.gray500,
      letterSpacing: '-0.42px',
      lineHeight: 1.4,
      margin: 0,
    }}>
      {children}
    </p>
  )
}

// ── 톤 프리셋 칩 ──────────────────────────────────────────────────────────

function ToneChip({
  preset,
  active,
  onClick,
}: {
  preset: FeedbackTonePreset
  active: boolean
  onClick: () => void
}) {
  const Icon = TONE_ICONS[preset]
  const iconColor = active ? c.primary400 : c.gray500

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 8px',
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        background: active ? c.primary100 : c.gray50,
        color: active ? c.primary400 : c.gray500,
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: '-0.42px',
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        height: 32,
      }}
    >
      <Icon color={iconColor} />
      {TONE_PRESET_LABELS[preset]}
    </button>
  )
}

// ── 소형 선택 칩 (데이터 기간 / 피드백 길이) ──────────────────────────────

function SmallChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px 8px',
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        background: active ? c.primary100 : c.gray50,
        color: active ? c.primary400 : c.gray500,
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: '-0.42px',
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        height: 28,
      }}
    >
      {label}
    </button>
  )
}

// ── 체크박스 칩 (필수 포함 내용) ──────────────────────────────────────────

function CheckChip({
  label,
  checked,
  onClick,
}: {
  label: string
  checked: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 8px',
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        background: checked ? c.primary100 : c.gray50,
        color: checked ? c.primary400 : c.gray500,
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: '-0.42px',
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        height: 28,
      }}
    >
      <IconCheck color={checked ? c.primary400 : c.gray300} />
      {label}
    </button>
  )
}

// ── 메인 페이지 ───────────────────────────────────────────────────────────

export default function AiSettingsPage() {
  const [settings, setSettings] = useState<AiSettings>(DEFAULT_AI_SETTINGS)
  const [analyzingTone, setAnalyzingTone] = useState(false)
  const [sampleFeedback, setSampleFeedback] = useState<string | null>(null)

  const update = <K extends keyof AiSettings>(key: K, value: AiSettings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }))

  const handleAnalyzeTone = async () => {
    if (!settings.customToneDescription && !settings.customToneMessages) return
    setAnalyzingTone(true)
    setSampleFeedback(null)
    await new Promise((r) => setTimeout(r, 1800))
    setSampleFeedback('오늘 민준이가 극한 파트 정말 잘 따라왔어요! 합성함수 쪽은 조금 더 연습이 필요하니까 이번 주 과제 꼭 풀어오면 좋겠어요 :)')
    setAnalyzingTone(false)
  }

  const handleSave = () => {
    console.log('[AI 조교 설정 저장]', settings)
    alert('설정이 저장됐어요. 다음 발송부터 적용됩니다.')
  }

  const canAnalyze = !!settings.customToneDescription || !!settings.customToneMessages

  const tonePresets: FeedbackTonePreset[] = ['warm', 'analytical', 'concise', 'custom']
  const dataPeriods: DataPeriod[] = ['this_only', 'last_3', 'last_5', 'last_month']
  const feedbackLengths: FeedbackLength[] = ['short', 'medium', 'long']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 917 }}>
      {/* 페이지 제목 */}
      <h1 style={{
        fontSize: 28,
        fontWeight: 700,
        color: c.gray900,
        letterSpacing: '-0.84px',
        lineHeight: 1.4,
        margin: 0,
        marginBottom: 32,
      }}>
        AI 조교
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── 섹션 1: 피드백 톤 ─────────────────────────────── */}
        <SectionCard>
          <SectionTitle>피드백 톤</SectionTitle>

          {/* 톤 프리셋 */}
          <SubLabel>톤 프리셋</SubLabel>
          <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
            {tonePresets.map((preset) => (
              <ToneChip
                key={preset}
                preset={preset}
                active={settings.tonePreset === preset}
                onClick={() => {
                  update('tonePreset', preset)
                  setSampleFeedback(null)
                }}
              />
            ))}
          </div>

          {/* 프리셋 설명 */}
          <p style={{
            fontSize: 14,
            fontWeight: 500,
            color: c.gray700,
            letterSpacing: '-0.42px',
            lineHeight: 1.4,
            margin: 0,
            marginTop: 12,
          }}>
            {TONE_DESCRIPTIONS[settings.tonePreset]}
          </p>

          {/* 예시 피드백 (non-custom) */}
          {settings.tonePreset !== 'custom' && (
            <>
              <div style={{ marginTop: 20 }}>
                <SubLabel>예시 피드백</SubLabel>
                <div style={{
                  marginTop: 8,
                  background: c.gray50,
                  borderRadius: 12,
                  padding: '16px',
                }}>
                  <p style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: c.gray700,
                    letterSpacing: '-0.42px',
                    lineHeight: 1.4,
                    margin: 0,
                  }}>
                    {TONE_SAMPLES[settings.tonePreset]}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* 직접 입력 UI */}
          {settings.tonePreset === 'custom' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
              {/* 나만의 말투 설명 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <SubLabel>나만의 말투 설명</SubLabel>
                  <HintText>AI에게 원하는 말투를 자유롭게 설명해 주세요</HintText>
                </div>
                <textarea
                  value={settings.customToneDescription}
                  onChange={(e) => update('customToneDescription', e.target.value)}
                  placeholder="예: 존댓말이지만 너무 딱딱하지 않게, 학생 이름 꼭 넣어서"
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: `1px solid ${c.gray75}`,
                    background: c.gray50,
                    fontSize: 14,
                    color: c.gray700,
                    letterSpacing: '-0.42px',
                    lineHeight: 1.4,
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* 기존에 보낸 메시지 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <SubLabel>기존에 보낸 메시지</SubLabel>
                  <HintText>평소에 학부모께 보내던 메시지를 붙여넣어 주세요.</HintText>
                </div>
                <textarea
                  value={settings.customToneMessages}
                  onChange={(e) => update('customToneMessages', e.target.value)}
                  placeholder="예: 존댓말이지만 너무 딱딱하지 않게, 학생 이름 꼭 넣어서"
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 12,
                    border: `1px solid ${c.gray75}`,
                    background: c.gray50,
                    fontSize: 14,
                    color: c.gray700,
                    letterSpacing: '-0.42px',
                    lineHeight: 1.4,
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* 말투 분석하기 버튼 */}
              <button
                type="button"
                onClick={handleAnalyzeTone}
                disabled={!canAnalyze || analyzingTone}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '12px',
                  borderRadius: 12,
                  border: 'none',
                  cursor: canAnalyze && !analyzingTone ? 'pointer' : 'not-allowed',
                  background: canAnalyze && !analyzingTone ? c.primary500 : c.gray100,
                  color: canAnalyze && !analyzingTone ? c.white : c.gray500,
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: '-0.48px',
                  transition: 'background 0.2s',
                }}
              >
                {analyzingTone ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                    AI가 말투를 분석하고 있어요 ...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    말투 분석하기
                  </>
                )}
              </button>

              {/* 샘플 피드백 미리보기 */}
              {sampleFeedback && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 14,
                      fontWeight: 600,
                      color: c.primary500,
                    }}>
                      <IconWarm color={c.primary500} />
                      샘플 피드백
                    </div>
                    <HintText>입력하신 스타일로 생성했어요</HintText>
                  </div>
                  <div style={{
                    background: c.gray50,
                    borderRadius: 12,
                    padding: '12px 16px',
                  }}>
                    <p style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: c.gray700,
                      letterSpacing: '-0.42px',
                      lineHeight: 1.4,
                      margin: 0,
                    }}>
                      {sampleFeedback}
                    </p>
                  </div>
                </div>
              )}

              {/* 유효성 경고 */}
              {!canAnalyze && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                  borderRadius: 12,
                  border: `1px solid ${c.gray75}`,
                }}>
                  <HintText>말투 설명이나 예시 메시지 중 하나는 입력해 주세요.</HintText>
                </div>
              )}
            </div>
          )}
        </SectionCard>

        {/* ── 섹션 2: 피드백 생성 기준 ───────────────────────── */}
        <SectionCard>
          <SectionTitle>피드백 생성 기준</SectionTitle>

          {/* 데이터 기간 */}
          <SubLabel>데이터 기간</SubLabel>
          <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
            {dataPeriods.map((period) => (
              <SmallChip
                key={period}
                label={DATA_PERIOD_LABELS[period]}
                active={settings.dataPeriod === period}
                onClick={() => update('dataPeriod', period)}
              />
            ))}
          </div>

          {/* 피드백 길이 */}
          <div style={{ marginTop: 20 }}>
            <SubLabel>피드백 길이</SubLabel>
            <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
              {feedbackLengths.map((length) => (
                <SmallChip
                  key={length}
                  label={FEEDBACK_LENGTH_LABELS[length]}
                  active={settings.feedbackLength === length}
                  onClick={() => update('feedbackLength', length)}
                />
              ))}
            </div>
          </div>

          {/* 필수 포함 내용 */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <SubLabel>필수 포함 내용</SubLabel>
              <HintText>항상 피드백에 언급할 내용을 입력하세요</HintText>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {INCLUDE_CONTENT_LABELS.map(({ key, label }) => (
                <CheckChip
                  key={key}
                  label={label}
                  checked={settings[key]}
                  onClick={() => update(key, !settings[key])}
                />
              ))}
            </div>
          </div>
        </SectionCard>

        {/* ── 섹션 3: 기타 설정 ──────────────────────────────── */}
        <SectionCard>
          <SectionTitle>기타 설정</SectionTitle>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <SubLabel>이모지 사용</SubLabel>
            <Toggle checked={settings.useEmoji} onChange={(v) => update('useEmoji', v)} />
          </div>
          <div style={{ marginTop: 6 }}>
            <HintText>피드백에 이모지를 포함해요</HintText>
          </div>
        </SectionCard>

        {/* ── 저장 버튼 ───────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
          <p style={{
            fontSize: 13,
            color: c.gray500,
            lineHeight: 1.4,
            margin: 0,
            marginRight: 16,
            display: 'flex',
            alignItems: 'center',
          }}>
            저장 후 다음 발송부터 적용됩니다
          </p>
          <Button variant="primary" size="md" onClick={handleSave}>
            설정 저장
          </Button>
        </div>
      </div>
    </div>
  )
}
