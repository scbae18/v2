import { globalStyle, style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'

export const pageRoot = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  minHeight: '100%',
})

export const pageTitle = style({
  margin: 0,
  fontSize: '28px',
  fontWeight: 700,
  lineHeight: 1.4,
  letterSpacing: '-0.84px',
  color: colors.gray900,
})

export const tabBar = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '32px',
  marginTop: '42px',
  paddingBottom: 0,
  borderBottom: `1px solid ${colors.gray100}`,
})

export const tabBtn = style({
  background: 'none',
  border: 'none',
  padding: '0 0 10px',
  marginBottom: '-1px',
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.6px',
  color: colors.gray500,
  cursor: 'pointer',
  borderBottom: '2px solid transparent',
  selectors: {
    '&:hover': {
      color: colors.gray700,
    },
  },
})

export const tabBtnActive = style({
  color: colors.gray900,
  borderBottomColor: colors.gray900,
})

export const settingsGrid = style({
  display: 'flex',
  gap: '24px',
  marginTop: '32px',
  alignItems: 'stretch',
  flexWrap: 'wrap',
})

export const settingsLeft = style({
  flex: '0 0 448px',
  maxWidth: '100%',
  background: colors.gray50,
  borderRadius: '16px',
  padding: '32px',
  boxSizing: 'border-box',
})

export const settingsRight = style({
  flex: '1 1 400px',
  minWidth: '280px',
  background: '#C9DBEA',
  borderRadius: '16px',
  padding: '32px',
  boxSizing: 'border-box',
  position: 'relative',
  paddingBottom: '48px',
})

export const infoRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '20px',
})

export const infoText = style({
  margin: 0,
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.42px',
  color: colors.primary500,
})

export const sectionLabel = style({
  margin: 0,
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.6px',
  color: colors.gray900,
})

export const variableRowLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  marginBottom: '8px',
})

export const variableRowLabelText = style({
  margin: 0,
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.42px',
  color: colors.gray700,
})

export const variableChips = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
})

export const variableChip = style({
  border: 'none',
  cursor: 'pointer',
  background: colors.primary100,
  color: colors.primary500,
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.36px',
  padding: '4px 8px',
  borderRadius: '6px',
  fontFamily: 'inherit',
})

export const textareaWhite = style({
  width: '100%',
  minHeight: '72px',
  padding: '14px 15px',
  borderRadius: '8px',
  border: `1px solid ${colors.gray50}`,
  backgroundColor: colors.white,
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.42px',
  color: colors.gray900,
  outline: 'none',
  resize: 'vertical',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  selectors: {
    '&:focus': {
      borderColor: colors.primary300,
    },
  },
})

export const introBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '24px',
})

export const outroBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '20px',
})

export const previewTitle = style({
  margin: 0,
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.6px',
  color: colors.gray900,
  marginBottom: '20px',
})

export const previewMeta = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '8px',
})

export const previewAppName = style({
  margin: 0,
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.42px',
  color: colors.gray600,
})

export const previewTime = style({
  position: 'absolute',
  right: '32px',
  bottom: '32px',
  margin: 0,
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.36px',
  color: colors.gray600,
})

export const previewCardWrap = style({
  position: 'relative',
  width: '100%',
  maxWidth: '388px',
})

export const filterRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '32px',
})

export const filterChip = style({
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '4px 12px',
  borderRadius: '999px',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.42px',
  fontFamily: 'inherit',
  background: colors.gray50,
  color: colors.gray700,
})

export const filterChipActive = style({
  background: colors.primary500,
  color: colors.white,
})

export const tableWrap = style({
  marginTop: '24px',
  width: '100%',
  overflowX: 'auto',
})

export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
  minWidth: '920px',
})

export const th = style({
  background: colors.gray50,
  border: `1px solid ${colors.gray100}`,
  padding: '10px 16px',
  textAlign: 'left',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.42px',
  color: colors.gray700,
})

export const td = style({
  border: `1px solid ${colors.gray100}`,
  padding: '10px 16px',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '-0.42px',
  color: colors.gray900,
  verticalAlign: 'middle',
  background: colors.white,
})

export const expandBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '14px',
  fontWeight: 500,
  color: colors.gray900,
})

export const statusOk = style({
  display: 'inline-flex',
  padding: '2px 8px',
  borderRadius: '6px',
  background: colors.success50,
  color: colors.success500,
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.42px',
})

export const statusFail = style({
  display: 'inline-flex',
  padding: '2px 8px',
  borderRadius: '6px',
  background: colors.error50,
  color: colors.error500,
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.42px',
})

export const resendBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '2px 8px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  background: colors.gray50,
  color: colors.gray700,
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.42px',
  fontFamily: 'inherit',
})

export const typePillLesson = style({
  display: 'inline-flex',
  padding: '2px 8px',
  borderRadius: '6px',
  background: colors.primary50,
  border: `1px solid ${colors.primary100}`,
  color: colors.primary500,
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.42px',
})

export const typePillAtt = style({
  display: 'inline-flex',
  padding: '2px 8px',
  borderRadius: '6px',
  background: colors.gray50,
  border: `1px solid ${colors.primary100}`,
  color: colors.gray700,
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.42px',
})

export const tplPill = style({
  display: 'inline-flex',
  padding: '2px 8px',
  borderRadius: '6px',
  background: colors.white,
  border: `1px solid ${colors.gray100}`,
  color: colors.gray700,
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.42px',
})

export const statusCellInner = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '10px',
})

export const tableRowInteractive = style({
  cursor: 'pointer',
})

globalStyle(`${tableRowInteractive}:hover td`, {
  backgroundColor: colors.gray50,
})

export const hintMuted = style({
  fontSize: '12px',
  fontWeight: 500,
  color: colors.gray500,
  letterSpacing: '-0.36px',
})

export const batchDetailShell = style({
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 'min(720px, 90vh)',
})

export const batchDetailHeader = style({
  padding: '20px 24px 16px',
  borderBottom: `1px solid ${colors.gray100}`,
  flexShrink: 0,
})

export const batchDetailTitle = style({
  margin: 0,
  fontSize: '18px',
  fontWeight: 700,
  lineHeight: 1.4,
  letterSpacing: '-0.54px',
  color: colors.gray900,
})

export const batchDetailMeta = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '8px',
  marginTop: '10px',
})

export const batchDetailBody = style({
  display: 'flex',
  flex: '1 1 auto',
  minHeight: '360px',
  maxHeight: 'min(520px, calc(90vh - 200px))',
  overflow: 'hidden',
})

export const batchDetailStudentList = style({
  width: '232px',
  flexShrink: 0,
  overflowY: 'auto',
  background: colors.gray50,
  borderRight: `1px solid ${colors.gray100}`,
  padding: '10px',
  boxSizing: 'border-box',
})

export const batchDetailStudentBtn = style({
  display: 'block',
  width: '100%',
  textAlign: 'left',
  border: `1px solid transparent`,
  borderRadius: '10px',
  padding: '12px 14px',
  marginBottom: '6px',
  background: colors.white,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'background 0.15s, border-color 0.15s',
  selectors: {
    '&:hover': {
      background: colors.white,
      borderColor: colors.gray100,
    },
  },
})

export const batchDetailStudentBtnActive = style({
  background: colors.primary50,
  border: `1px solid ${colors.primary200}`,
  selectors: {
    '&:hover': {
      background: colors.primary100,
      borderColor: colors.primary300,
    },
  },
})

export const batchDetailStudentName = style({
  display: 'block',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '-0.42px',
  color: colors.gray900,
})

export const batchDetailStudentHint = style({
  display: 'block',
  marginTop: '4px',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: colors.gray500,
  letterSpacing: '-0.36px',
})

export const batchDetailMessageCol = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: '20px 24px',
  minHeight: 0,
  background: colors.white,
})

export const batchDetailMessageLabel = style({
  margin: '0 0 12px',
  fontSize: '13px',
  fontWeight: 600,
  lineHeight: 1.4,
  color: colors.gray700,
  letterSpacing: '-0.39px',
})

export const batchDetailMessageBox = style({
  flex: 1,
  minHeight: '120px',
  overflowY: 'auto',
  background: colors.gray50,
  border: `1px solid ${colors.gray100}`,
  borderRadius: '12px',
  padding: '18px 20px',
})

export const batchDetailMessagePre = style({
  margin: 0,
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.65,
  letterSpacing: '-0.42px',
  color: colors.gray900,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  fontFamily: 'inherit',
})

export const batchDetailFooter = style({
  padding: '14px 24px',
  borderTop: `1px solid ${colors.gray100}`,
  flexShrink: 0,
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
  background: colors.white,
})
