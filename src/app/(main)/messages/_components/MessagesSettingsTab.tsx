'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import LogoSymbol from '@/assets/logo/logo-symbol.svg'
import Button from '@/components/common/Button'
import useToast from '@/hooks/useToast'
import { colors } from '@/styles/tokens/colors'
import * as styles from '../messages.css'

const PREVIEW_VARS: { pattern: RegExp; value: string }[] = [
  { pattern: /\{\s*강사명\s*\}/g, value: '김클랫' },
  { pattern: /\{\s*학원명\s*\}/g, value: '엘리에듀학원' },
  { pattern: /\{\s*학생이름\s*\}/g, value: '김민준' },
  { pattern: /\{\s*날짜\s*\}/g, value: '2026년 4월 9일' },
  { pattern: /\{\s*반이름\s*\}/g, value: '수1 심화반' },
]

const SAMPLE_BODY = `■ 오늘 학습 내용: 이차방정식의 판별식
■ 출결: 출석
■ 시험 점수: 85점
■ 피드백: 개념 이해도가 좋아요`

const INSERT_TOKENS: { label: string; token: string }[] = [
  { label: '{ 강사명 }', token: '{강사명}' },
  { label: '{ 학원명 }', token: '{학원명}' },
  { label: '{ 학생이름 }', token: '{학생이름}' },
  { label: '{ 날짜 }', token: '{날짜}' },
  { label: '{ 반이름 }', token: '{반이름}' },
]

const DEFAULT_INTRO = `안녕하세요, {학원명} {강사명} 강사입니다.
{학생이름}의 수업 결과를 안내드립니다.`

const DEFAULT_OUTRO = `감사합니다.
{강사명} 드림.`

function applyPreviewVars(text: string): string {
  let s = text
  for (const { pattern, value } of PREVIEW_VARS) {
    s = s.replace(pattern, value)
  }
  return s
}

function previewTimeLabel(): string {
  const d = new Date()
  let h = d.getHours()
  const isPm = h >= 12
  const h12 = h % 12 || 12
  const min = d.getMinutes().toString().padStart(2, '0')
  return `${isPm ? '오후' : '오전'} ${String(h12).padStart(2, '0')}:${min}`
}

function insertAtCursor(
  el: HTMLTextAreaElement,
  token: string,
  value: string,
  onChange: (next: string) => void,
) {
  const start = el.selectionStart
  const end = el.selectionEnd
  const next = value.slice(0, start) + token + value.slice(end)
  onChange(next)
  requestAnimationFrame(() => {
    el.focus()
    const pos = start + token.length
    el.setSelectionRange(pos, pos)
  })
}

function IconBrackets() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M4 2.5H2.5V9.5H4M8 2.5H9.5V9.5H8"
        stroke={colors.primary500}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconInfoCheck() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        borderRadius: 6,
        background: colors.primary100,
        flexShrink: 0,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path
          d="M10 3.5L4.5 9L2 6.5"
          stroke={colors.primary500}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export default function MessagesSettingsTab() {
  const toast = useToast()
  const [intro, setIntro] = useState(DEFAULT_INTRO)
  const [outro, setOutro] = useState(DEFAULT_OUTRO)
  const introRef = useRef<HTMLTextAreaElement>(null)
  const outroRef = useRef<HTMLTextAreaElement>(null)

  const previewIntro = useMemo(() => applyPreviewVars(intro), [intro])
  const previewOutro = useMemo(() => applyPreviewVars(outro), [outro])

  const insertIntro = useCallback(
    (token: string) => {
      const el = introRef.current
      if (el) insertAtCursor(el, token, intro, setIntro)
      else setIntro((v) => v + token)
    },
    [intro],
  )

  const insertOutro = useCallback(
    (token: string) => {
      const el = outroRef.current
      if (el) insertAtCursor(el, token, outro, setOutro)
      else setOutro((v) => v + token)
    },
    [outro],
  )

  return (
    <div className={styles.settingsGrid}>
      <div className={styles.settingsLeft}>
        <div className={styles.infoRow}>
          <IconInfoCheck />
          <p className={styles.infoText}>
            알림톡에 포함할 항목은 각 수업 템플릿에서 설정할 수 있어요
          </p>
        </div>

        <div className={styles.introBlock}>
          <p className={styles.sectionLabel}>인트로</p>
          <textarea
            ref={introRef}
            className={styles.textareaWhite}
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            rows={3}
            aria-label="인트로"
          />
          <div>
            <div className={styles.variableRowLabel}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  background: colors.primary100,
                }}
              >
                <IconBrackets />
              </span>
              <p className={styles.variableRowLabelText}>변수 삽입</p>
            </div>
            <div className={styles.variableChips}>
              {INSERT_TOKENS.map(({ label, token }) => (
                <button
                  key={token}
                  type="button"
                  className={styles.variableChip}
                  onClick={() => insertIntro(token)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.outroBlock}>
          <p className={styles.sectionLabel}>아웃트로</p>
          <textarea
            ref={outroRef}
            className={styles.textareaWhite}
            value={outro}
            onChange={(e) => setOutro(e.target.value)}
            rows={3}
            aria-label="아웃트로"
          />
          <div>
            <div className={styles.variableRowLabel}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  background: colors.primary100,
                }}
              >
                <IconBrackets />
              </span>
              <p className={styles.variableRowLabelText}>변수 삽입</p>
            </div>
            <div className={styles.variableChips}>
              {INSERT_TOKENS.map(({ label, token }) => (
                <button
                  key={`o-${token}`}
                  type="button"
                  className={styles.variableChip}
                  onClick={() => insertOutro(token)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={() => toast.success('문자 설정을 저장했어요.')}
        >
          저장
        </Button>
      </div>

      <div className={styles.settingsRight}>
        <p className={styles.previewTitle}>알림톡 미리보기</p>

        <div className={styles.previewMeta}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 14,
              background: colors.white,
              overflow: 'hidden',
            }}
          >
            <LogoSymbol width={36} height={36} />
          </span>
          <p className={styles.previewAppName}>클랫 수업 알림</p>
        </div>

        <div className={styles.previewCardWrap}>
          <div
            style={{
              width: '100%',
              maxWidth: 388,
              borderRadius: 20,
              overflow: 'hidden',
              background: colors.white,
              boxShadow: '0 2px 12px rgba(54,55,68,0.08)',
            }}
          >
            <div
              style={{
                height: 44,
                background: '#FEE501',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 12,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: '-0.42px',
                  color: colors.gray900,
                }}
              >
                알림톡 도착
              </span>
            </div>
            <div style={{ padding: '16px 16px 14px' }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: 1.4,
                  letterSpacing: '-0.42px',
                  color: colors.gray900,
                  whiteSpace: 'pre-wrap',
                  marginBottom: 12,
                }}
              >
                {previewIntro}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: 1.6,
                  letterSpacing: '-0.42px',
                  color: colors.gray900,
                  whiteSpace: 'pre-wrap',
                  marginBottom: 12,
                }}
              >
                {SAMPLE_BODY}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: 1.4,
                  letterSpacing: '-0.42px',
                  color: colors.gray900,
                  whiteSpace: 'pre-wrap',
                  marginBottom: 12,
                }}
              >
                {previewOutro}
              </div>
              <div
                style={{
                  background: colors.gray50,
                  borderRadius: 8,
                  padding: '12px 16px',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: '-0.42px',
                    color: colors.gray600,
                  }}
                >
                  학습 대시보드 보기
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className={styles.previewTime}>{previewTimeLabel()}</p>
      </div>
    </div>
  )
}
