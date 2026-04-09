/**
 * AI 조교 설정 mock 데이터
 */

export type FeedbackTonePreset = 'warm' | 'analytical' | 'concise' | 'custom'
export type DataPeriod = 'this_only' | 'last_3' | 'last_5' | 'last_month'
export type FeedbackLength = 'short' | 'medium' | 'long'

export interface AiSettings {
  tonePreset: FeedbackTonePreset
  customToneDescription: string
  customToneMessages: string
  dataPeriod: DataPeriod
  feedbackLength: FeedbackLength
  useEmoji: boolean
  includeScore: boolean
  includeHomework: boolean
  includeAttendance: boolean
  includeImprovement: boolean
  includePraise: boolean
}

export const TONE_PRESET_LABELS: Record<FeedbackTonePreset, string> = {
  warm: '따뜻하고 친근하게',
  analytical: '꼼꼼하게 분석해서',
  concise: '간결하게 핵심만',
  custom: '직접 입력',
}

export const TONE_DESCRIPTIONS: Record<FeedbackTonePreset, string> = {
  warm: '잘한 점을 중심으로, 과제나 보완점도 부드럽게 녹여 전달해요.',
  analytical: '잘한 점과 보완할 점을 구체적으로 짚어, 신뢰감 있는 피드백을 전달해요.',
  concise: '2~3문장으로 핵심만 담아, 바쁜 학부모도 한눈에 읽을 수 있어요.',
  custom: '나만의 말투와 예시를 입력하면 AI가 그대로 따라해요.',
}

export const TONE_SAMPLES: Record<Exclude<FeedbackTonePreset, 'custom'>, string> = {
  warm: '오늘도 열심히 해주었어요 😊 극한 개념을 잘 잡아가고 있어서 보기 좋았어요! 이번 주 과제도 빠짐없이 풀어오면 다음 시간에 훨씬 수월할 거예요.',
  analytical:
    '오늘 극한 기본 개념 이해도는 양호하였습니다. 다만 합성함수 극한 적용 문제에서 실수가 반복되고 있어 해당 유형 집중 연습이 필요한 상황입니다. 이번 주 과제에 관련 유형을 담아두었으니 반드시 풀어오시기 바랍니다.',
  concise:
    '오늘 극한 파트 수업 잘 마쳤습니다. 합성함수 유형 복습이 필요하니 이번 주 과제 꼭 풀어오시기 바랍니다.',
}

export const DATA_PERIOD_LABELS: Record<DataPeriod, string> = {
  this_only: '이번 수업만',
  last_3: '최근 3회',
  last_5: '최근 5회',
  last_month: '최근 1개월',
}

export const FEEDBACK_LENGTH_LABELS: Record<FeedbackLength, string> = {
  short: '짧게 (1~2문장)',
  medium: '보통 (3~4문장)',
  long: '길게 (5문장 이상)',
}

export const INCLUDE_CONTENT_LABELS: { key: keyof Pick<AiSettings, 'includeScore' | 'includeHomework' | 'includeAttendance' | 'includeImprovement' | 'includePraise'>; label: string }[] = [
  { key: 'includeScore', label: '점수' },
  { key: 'includeHomework', label: '과제 여부' },
  { key: 'includeAttendance', label: '출결' },
  { key: 'includeImprovement', label: '보완할 점' },
  { key: 'includePraise', label: '칭찬' },
]

export const DEFAULT_AI_SETTINGS: AiSettings = {
  tonePreset: 'warm',
  customToneDescription: '',
  customToneMessages: '',
  dataPeriod: 'this_only',
  feedbackLength: 'medium',
  useEmoji: true,
  includeScore: true,
  includeHomework: true,
  includeAttendance: true,
  includeImprovement: false,
  includePraise: true,
}
