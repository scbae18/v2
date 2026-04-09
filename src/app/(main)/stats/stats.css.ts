import { globalStyle, style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

/* ─── 페이지 ─── */
export const pageRoot = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  paddingBottom: '8px',
})

export const pageHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

export const pageTitle = style({
  margin: 0,
  fontSize: '28px',
  fontWeight: 700,
  lineHeight: 1.4,
  letterSpacing: '-0.84px',
  color: colors.gray900,
})

export const pageSubtitle = style({
  margin: 0,
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.55,
  letterSpacing: '-0.42px',
  color: colors.gray500,
  maxWidth: '560px',
})

export const metaLine = style({
  fontSize: '12px',
  fontWeight: 500,
  color: colors.gray300,
  letterSpacing: '-0.36px',
  marginTop: '4px',
})

/* ─── 오늘 할 일 (액션 스트립) ─── */
export const actionStrip = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
})

export const actionCard = style({
  flex: '1 1 240px',
  minWidth: 'min(100%, 220px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '8px',
  padding: '18px 20px',
  borderRadius: '16px',
  border: `1px solid ${colors.gray100}`,
  background: colors.white,
  boxShadow: '0 1px 4px rgba(54, 55, 68, 0.06)',
  textAlign: 'left',
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  selectors: {
    '&:hover': {
      borderColor: colors.primary200,
      boxShadow: `0 2px 12px rgba(59, 81, 204, 0.08)`,
    },
  },
})

export const actionCardEmphasis = style({
  borderColor: colors.primary200,
  background: colors.primary50,
  selectors: {
    '&:hover': {
      borderColor: colors.primary300,
    },
  },
})

export const actionCardTitleRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  flexWrap: 'wrap',
  width: '100%',
})

export const actionTitle = style({
  fontSize: '16px',
  fontWeight: 700,
  letterSpacing: '-0.48px',
  color: colors.gray900,
  lineHeight: 1.35,
})

export const actionBadge = style({
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '-0.36px',
  color: colors.primary600,
  background: colors.white,
  border: `1px solid ${colors.primary200}`,
  borderRadius: '999px',
  padding: '3px 10px',
})

export const actionSub = style({
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.5,
  letterSpacing: '-0.39px',
  color: colors.gray600,
})

/* ─── 건강도(요약) ─── */
export const sectionBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
})

export const sectionHead = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
})

export const sectionTitle = style({
  margin: 0,
  fontSize: '18px',
  fontWeight: 700,
  lineHeight: 1.4,
  letterSpacing: '-0.54px',
  color: colors.gray900,
})

export const sectionDesc = style({
  margin: 0,
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.5,
  letterSpacing: '-0.39px',
  color: colors.gray500,
})

export const healthGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '12px',
  '@media': {
    '(max-width: 900px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '(max-width: 480px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const healthCard = style({
  background: colors.white,
  borderRadius: '14px',
  padding: '16px 18px',
  border: `1px solid ${colors.gray100}`,
  boxShadow: '0 1px 4px rgba(54, 55, 68, 0.04)',
})

export const healthLabel = style({
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '-0.36px',
  color: colors.gray500,
  marginBottom: '10px',
})

export const healthValueRow = style({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '8px',
  flexWrap: 'wrap',
})

export const healthValue = style({
  fontSize: '24px',
  fontWeight: 700,
  letterSpacing: '-0.72px',
  lineHeight: 1,
  color: colors.gray900,
})

export const tonePill = style({
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '-0.33px',
  padding: '3px 8px',
  borderRadius: '6px',
  flexShrink: 0,
})

export const healthHint = style({
  fontSize: '11px',
  fontWeight: 500,
  color: colors.gray300,
  marginTop: '10px',
  lineHeight: 1.45,
  letterSpacing: '-0.33px',
})

/* ─── 집중 학생 ─── */
export const attentionPanel = style({
  background: colors.white,
  borderRadius: '16px',
  border: `1px solid ${colors.gray100}`,
  boxShadow: '0 1px 4px rgba(54, 55, 68, 0.06)',
  padding: '22px 24px',
})

export const attentionHeadRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '16px',
  flexWrap: 'wrap',
  marginBottom: '6px',
})

export const attentionList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginTop: '16px',
})

export const attentionRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '14px',
  width: '100%',
  padding: '14px 16px',
  borderRadius: '12px',
  border: `1px solid ${colors.gray75}`,
  background: colors.gray50,
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'inherit',
  transition: 'background 0.15s, border-color 0.15s',
  selectors: {
    '&:hover': {
      background: colors.white,
      borderColor: colors.gray100,
    },
  },
})

export const studentName = style({
  fontSize: '15px',
  fontWeight: 600,
  letterSpacing: '-0.45px',
  color: colors.gray900,
})

export const reasonChip = style({
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '-0.33px',
  padding: '3px 8px',
  borderRadius: '6px',
})

export const studentClasses = style({
  fontSize: '12px',
  fontWeight: 500,
  color: colors.gray500,
  marginTop: '6px',
  letterSpacing: '-0.36px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const pctBlock = style({
  textAlign: 'right',
  flexShrink: 0,
})

export const pctValue = style({
  fontSize: '16px',
  fontWeight: 700,
  letterSpacing: '-0.48px',
})

export const pctLabel = style({
  fontSize: '10px',
  fontWeight: 500,
  color: colors.gray300,
  marginTop: '2px',
})

export const footLinkRow = style({
  marginTop: '16px',
  display: 'flex',
  justifyContent: 'flex-end',
})

export const emptyState = style({
  textAlign: 'center',
  padding: '36px 20px',
  fontSize: '14px',
  fontWeight: 500,
  color: colors.success500,
  lineHeight: 1.55,
})

/* ─── 반 테이블 ─── */
export const tablePanel = style({
  background: colors.white,
  borderRadius: '16px',
  border: `1px solid ${colors.gray100}`,
  boxShadow: '0 1px 4px rgba(54, 55, 68, 0.06)',
  padding: '22px 0 8px',
  overflow: 'hidden',
})

export const tableScroll = style({
  overflowX: 'auto',
})

export const dataTable = style({
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '640px',
})

export const th = style({
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '-0.36px',
  color: colors.gray500,
  padding: '8px 20px 12px',
  borderBottom: `1px solid ${colors.gray100}`,
  background: colors.gray50,
})

export const td = style({
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.42px',
  color: colors.gray900,
  padding: '14px 20px',
  borderBottom: `1px solid ${colors.gray75}`,
  verticalAlign: 'middle',
})

export const tableRowClickable = style({
  cursor: 'pointer',
})

globalStyle(`${tableRowClickable}:hover td`, {
  backgroundColor: colors.gray50,
})

export const rowPulse = style({
  width: '4px',
  borderRadius: '2px',
  flexShrink: 0,
  alignSelf: 'stretch',
  minHeight: '36px',
})

export const nameCellInner = style({
  display: 'flex',
  alignItems: 'stretch',
  gap: '12px',
})

export const cellMuted = style({
  color: colors.gray500,
  fontSize: '13px',
})

export const cellLink = style({
  fontSize: '12px',
  fontWeight: 600,
  color: colors.primary500,
})

/* ─── 분석 패널 ─── */
export const analyticsPanel = style({
  background: colors.white,
  borderRadius: '16px',
  border: `1px solid ${colors.gray100}`,
  boxShadow: '0 1px 4px rgba(54, 55, 68, 0.06)',
  padding: '22px 24px 20px',
})

export const analyticsHead = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginBottom: '8px',
})

export const viewTabs = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
})

export const viewTab = style({
  padding: '8px 16px',
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: 600,
  letterSpacing: '-0.39px',
  border: `1px solid ${colors.gray100}`,
  cursor: 'pointer',
  fontFamily: 'inherit',
  background: colors.white,
  color: colors.gray600,
  transition: 'background 0.15s, border-color 0.15s, color 0.15s',
  selectors: {
    '&:hover': {
      borderColor: colors.gray200,
      background: colors.gray50,
    },
  },
})

export const viewTabActive = style({
  background: colors.gray900,
  color: colors.white,
  borderColor: colors.gray900,
  selectors: {
    '&:hover': {
      background: colors.gray900,
      borderColor: colors.gray900,
    },
  },
})

export const metricTabs = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
})

export const metricTab = style({
  padding: '6px 12px',
  borderRadius: '999px',
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '-0.36px',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  background: colors.gray50,
  color: colors.gray600,
  transition: 'background 0.15s, color 0.15s',
})

export const metricTabActive = style({
  background: colors.primary500,
  color: colors.white,
})

export const chartHint = style({
  fontSize: '12px',
  fontWeight: 500,
  color: colors.gray300,
  marginTop: '12px',
  letterSpacing: '-0.36px',
})
