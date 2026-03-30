/**
 * AI 조교 설정 mock 데이터
 */

export type FeedbackTonePreset = 'warm' | 'professional' | 'simple' | 'custom'
export type DataPeriod = 'this_only' | 'last_3' | 'last_5' | 'last_month' | 'custom'
export type FeedbackLength = 'short' | 'medium' | 'long'

export interface AiSettings {
  tonePreset: FeedbackTonePreset
  customToneExample: string
  closingPhrase: string
  dataPeriod: DataPeriod
  customDateFrom?: string
  customDateTo?: string
  feedbackLength: FeedbackLength
  useEmoji: boolean
  mustInclude: string
}

export const TONE_PRESET_LABELS: Record<FeedbackTonePreset, string> = {
  warm: '따뜻하고 친근하게',
  professional: '전문적이고 차분하게',
  simple: '간결하게 핵심만',
  custom: '직접 입력',
}

export const TONE_SAMPLES: Record<FeedbackTonePreset, string> = {
  warm:
    '오늘도 열심히 해줬네요 😊 극한 개념을 꽤 잘 잡아가고 있어요! 과제도 꼭 빠짐없이 풀어오면 다음 시간에 더 수월할 거예요.',
  professional:
    '금일 수업에서 극한의 개념과 계산 원리를 중심으로 학습을 진행했습니다. 전반적인 이해도는 양호하며, 과제 수행을 통해 학습 내용을 정착시키는 과정이 필요합니다.',
  simple: '극한 개념 학습 완료. 과제 미제출 1건 있음. 다음 수업: 연속함수.',
  custom: '',
}

export const DATA_PERIOD_LABELS: Record<DataPeriod, string> = {
  this_only: '이번 수업만',
  last_3: '최근 3회',
  last_5: '최근 5회',
  last_month: '최근 1개월',
  custom: '직접 설정',
}

export const FEEDBACK_LENGTH_LABELS: Record<FeedbackLength, string> = {
  short: '짧게 (1~2문장)',
  medium: '보통 (3~4문장)',
  long: '길게 (5문장 이상)',
}

export const DEFAULT_AI_SETTINGS: AiSettings = {
  tonePreset: 'warm',
  customToneExample: '',
  closingPhrase: '다음 수업에서 만나요!',
  dataPeriod: 'last_3',
  feedbackLength: 'medium',
  useEmoji: true,
  mustInclude: '과제 제출 여부, 다음 수업 안내',
}
