import { style } from '@vanilla-extract/css'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'

export const pageStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
})

export const bannerStyle = style({
  background: `radial-gradient(circle at right center, ${colors.primary400} 0%, transparent 75%), ${colors.primary100}`,
  borderRadius: '20px',
  padding: '32px 32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  overflow: 'hidden',
  position: 'relative',
  minHeight: '160px',
})

export const bannerContentStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  zIndex: 1,
})

export const bannerSubtitleStyle = style({
  fontSize: '24px',
  fontWeight: 700,
  letterSpacing: '-0.05em',
  color: colors.gray700,
})

export const bannerTitleStyle = style({
  fontSize: '52px',
  fontWeight: 800,
  letterSpacing: '-0.05em',
  color: colors.primary500,
})

export const bannerIllustWrapStyle = style({
  position: 'absolute',
  right: '-140px',
  bottom: '-110px',
  display: 'flex',
})

/** 히어로 배너 + 계정 카드 묶음 */
export const homeTopStackStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
})

/** 배너 하단과 카드를 자연스럽게 이어 붙임 */
export const userCardDockStyle = style({
  marginTop: '-18px',
  position: 'relative',
  zIndex: 1,
})

export const userCardProStyle = style({
  background: colors.white,
  borderRadius: '14px',
  border: `1px solid ${colors.gray75}`,
  boxShadow:
    '0 0 0 1px rgba(54, 55, 68, 0.04), 0 2px 8px rgba(54, 55, 68, 0.06), 0 12px 32px rgba(54, 55, 68, 0.08)',
  overflow: 'hidden',
})

export const userCardProHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  flexWrap: 'wrap',
  padding: '10px 18px',
  background: colors.gray50,
  borderBottom: `1px solid ${colors.gray75}`,
})

export const userCardProHeaderTitleStyle = style({
  margin: 0,
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '-0.24px',
  color: colors.gray600,
})

export const userCardProBetaStyle = style({
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.08em',
  color: colors.primary600,
  background: colors.white,
  padding: '4px 8px',
  borderRadius: '6px',
  border: `1px solid ${colors.primary200}`,
})

export const userCardProBodyStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  padding: '16px 18px',
})

export const userCardProLeftStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  minWidth: 0,
  flex: '1 1 220px',
})

export const userCardAvatarProStyle = style({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  background: `linear-gradient(145deg, ${colors.primary400} 0%, ${colors.primary600} 100%)`,
  color: colors.white,
  fontSize: '18px',
  fontWeight: 700,
  letterSpacing: '-0.54px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  boxShadow: `0 0 0 3px ${colors.white}, 0 2px 8px rgba(59, 81, 204, 0.25)`,
})

export const userCardProMainStyle = style({
  minWidth: 0,
})

export const userCardProTitleRowStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '8px',
})

export const userCardProNameStyle = style({
  fontSize: '16px',
  fontWeight: 700,
  letterSpacing: '-0.48px',
  color: colors.gray900,
  lineHeight: 1.35,
})

export const userCardProBadgeStyle = style({
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '-0.22px',
  color: colors.gray600,
  background: colors.white,
  padding: '3px 8px',
  borderRadius: '6px',
  border: `1px solid ${colors.gray100}`,
})

export const userCardProEmailStyle = style({
  margin: '4px 0 0',
  fontSize: '13px',
  fontWeight: 500,
  letterSpacing: '-0.39px',
  color: colors.gray500,
  wordBreak: 'break-all',
  lineHeight: 1.45,
})

export const userCardProAsideStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '8px',
  textAlign: 'right',
  flex: '0 0 auto',
  '@media': {
    '(max-width: 640px)': {
      width: '100%',
      alignItems: 'flex-start',
      textAlign: 'left',
      paddingTop: '14px',
      borderTop: `1px solid ${colors.gray75}`,
    },
  },
})

export const userCardProAsideBlockStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
})

export const userCardProAsideLabelStyle = style({
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '-0.22px',
  color: colors.gray500,
})

export const userCardProAsideValueStyle = style({
  fontSize: '13px',
  fontWeight: 600,
  letterSpacing: '-0.39px',
  color: colors.gray900,
})

export const userCardPlaceholderStyle = style({
  margin: 0,
  padding: '8px 0',
  fontSize: '14px',
  fontWeight: 500,
  color: colors.gray500,
  letterSpacing: '-0.42px',
})

export const sectionHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '16px',
})

export const sectionTitleStyle = style({
  ...fontStyles.headingMd,
  fontWeight: 700,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const tabListStyle = style({
  display: 'flex',
  gap: '8px',
  marginBottom: '16px',
})

export const tabButtonStyle = style({
  padding: '8px 16px',
  borderRadius: '100px',
  border: 'none',
  background: colors.gray50,
  color: colors.gray500,
  ...fontStyles.labelSm,
  fontWeight: 600,
  letterSpacing: '-0.03em',
  cursor: 'pointer',
  transition: 'all 0.15s',
})

export const tabButtonActiveStyle = style({
  padding: '7px 16px',
  borderRadius: '100px',
  border: 'none',
  background: colors.primary500,
  color: colors.white,
  ...fontStyles.labelSm,
  fontWeight: 600,
  letterSpacing: '-0.03em',
  cursor: 'pointer',
  transition: 'all 0.15s',
})

export const stepCardStyle = style({
  background: colors.gray50,
  borderRadius: '20px',
  padding: '24px 28px',
})

export const stepCardHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '16px',
})

export const stepCardTitleStyle = style({
  ...fontStyles.headingSm,
  letterSpacing: '-0.03em',
  color: colors.gray900,
})

export const stepItemListStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
})

export const stepItemStyle = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
})

export const stepNumberStyle = style({
  flexShrink: 0,
  padding: '0 12px',
  height: '20px',
  borderRadius: '100px',
  background: colors.gray75,
  color: colors.gray500,
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '-0.03em',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '2px',
  whiteSpace: 'nowrap',
})

export const stepItemTextStyle = style({
  ...fontStyles.bodyMd,
  color: colors.gray700,
  letterSpacing: '-0.03em',
  lineHeight: '1.65',
})

export const cardGridStyle = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
})

export const betaCardStyle = style({
  background: colors.primary100,
  borderRadius: '20px',
  padding: '28px 32px',
  overflow: 'hidden',
  minHeight: '200px',
  position: 'relative',
})

export const inviteCardStyle = style({
  background: colors.primary500,
  borderRadius: '20px',
  padding: '28px 32px',
  overflow: 'hidden',
  minHeight: '200px',
  position: 'relative',
})

export const cardContentStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  zIndex: 1,
  position: 'relative',
})

export const cardTagStyle = style({
  display: 'inline-flex',
  background: colors.primary200,
  borderRadius: '100px',
  padding: '4px 12px',
  ...fontStyles.titleSm,
  letterSpacing: '-0.03em',
  color: colors.primary400,
  width: 'fit-content',
})

export const cardTagInvertStyle = style({
  display: 'inline-flex',
  background: 'transparent',
  border: `1px solid ${colors.primary100}`,
  borderRadius: '100px',
  padding: '4px 12px',
  ...fontStyles.titleSm,
  letterSpacing: '-0.03em',
  color: colors.primary100,
  width: 'fit-content',
})

export const cardTitleStyle = style({
  fontSize: fontStyles.headingLg.fontSize,
  fontWeight: 700,
  letterSpacing: '-0.05em',
  color: colors.gray900,
  lineHeight: '1.3',
})

export const cardTitleInvertStyle = style({
  fontSize: fontStyles.headingLg.fontSize,
  fontWeight: 700,
  letterSpacing: '-0.05em',
  color: colors.white,
  lineHeight: '1.3',
})

export const cardDescStyle = style({
  fontSize: fontStyles.bodyMd.fontSize,
  fontWeight: 600,
  letterSpacing: '-0.03em',
  color: colors.gray700,
})

export const inviteButtonStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '20px',
  background: colors.white,
  border: 'none',
  borderRadius: '100px',
  padding: '8px 16px',
  fontSize: fontStyles.bodyLg.fontSize,
  fontWeight: 700,
  letterSpacing: '-0.03em',
  color: colors.primary500,
  cursor: 'pointer',
  width: 'fit-content',
  textDecoration: 'none',
  transition: 'background 0.15s, opacity 0.15s',
  selectors: {
    '&:hover': {
      background: colors.primary50,
    },
    '&:active': {
      opacity: 0.8,
    },
  },
})

export const cardImageWrapStyle = style({
  position: 'absolute',
  right: -100,
  bottom: -120,
})

/* ─── 업무용 홈 (교사 도구) ─── */
export const heroCompactStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '4px 0 8px',
})

export const heroGreetingStyle = style({
  margin: 0,
  fontSize: '28px',
  fontWeight: 700,
  lineHeight: 1.35,
  letterSpacing: '-0.84px',
  color: colors.gray900,
})

export const heroDateStyle = style({
  margin: 0,
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.42px',
  color: colors.gray500,
})

export const heroTaglineStyle = style({
  margin: 0,
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.55,
  letterSpacing: '-0.42px',
  color: colors.gray600,
  maxWidth: '560px',
})

export const quickNavPanelStyle = style({
  borderRadius: '20px',
  padding: '22px 22px 24px',
  background: colors.white,
  border: `1px solid ${colors.primary200}`,
  boxShadow: '0 10px 40px rgba(59, 81, 204, 0.1)',
})

export const quickNavGridStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(158px, 1fr))',
  gap: '12px',
})

export const quickNavLinkStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '10px',
  padding: '16px 14px',
  borderRadius: '16px',
  border: `1px solid ${colors.gray75}`,
  background: `linear-gradient(180deg, ${colors.white} 0%, ${colors.primary50} 100%)`,
  textDecoration: 'none',
  color: 'inherit',
  minHeight: '118px',
  boxShadow: '0 2px 8px rgba(54, 55, 68, 0.06)',
  transition: 'transform 0.15s, border-color 0.15s, box-shadow 0.15s',
  selectors: {
    '&:hover': {
      borderColor: colors.primary300,
      boxShadow: `0 6px 20px rgba(59, 81, 204, 0.14)`,
      transform: 'translateY(-1px)',
    },
  },
})

export const quickNavIconBaseStyle = style({
  width: '44px',
  height: '44px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
})

export const qnIconLessonStyle = style({
  background: colors.primary100,
  color: colors.primary500,
})

export const qnIconMgmtStyle = style({
  background: colors.success50,
  color: colors.success500,
})

export const qnIconTplStyle = style({
  background: colors.primary50,
  color: colors.primary600,
})

export const qnIconMsgStyle = style({
  background: colors.error50,
  color: colors.error500,
})

export const qnIconStatsStyle = style({
  background: colors.warning50,
  color: colors.warning500,
})

export const qnIconAiStyle = style({
  background: colors.gray50,
  color: colors.primary500,
})

export const quickNavLabelStyle = style({
  fontSize: '15px',
  fontWeight: 700,
  letterSpacing: '-0.45px',
  color: colors.gray900,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
})

export const quickNavDescStyle = style({
  fontSize: '12px',
  fontWeight: 500,
  letterSpacing: '-0.36px',
  color: colors.gray500,
  lineHeight: 1.45,
})

export const quickNavBadgeStyle = style({
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '-0.33px',
  color: colors.warning500,
  background: colors.warning50,
  borderRadius: '6px',
  padding: '2px 7px',
})

export const workSectionStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
})

export const workSectionHeadStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '10px',
})

export const workSectionTitleStyle = style({
  margin: 0,
  fontSize: '18px',
  fontWeight: 700,
  letterSpacing: '-0.54px',
  color: colors.gray900,
})

export const workSectionHintStyle = style({
  margin: 0,
  fontSize: '13px',
  fontWeight: 500,
  letterSpacing: '-0.39px',
  color: colors.gray500,
  lineHeight: 1.5,
})

export const todayGridStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: '12px',
})

export const todayGridCompactStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '8px',
})

export const todayCardStyle = style({
  background: colors.white,
  border: `1px solid ${colors.gray100}`,
  borderRadius: '14px',
  padding: '18px 18px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  boxShadow: '0 1px 4px rgba(54, 55, 68, 0.05)',
  borderLeft: `4px solid ${colors.primary400}`,
})

export const todayCardCompactStyle = style({
  background: colors.white,
  border: `1px solid ${colors.gray100}`,
  borderRadius: '12px',
  padding: '12px 14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  boxShadow: '0 1px 3px rgba(54, 55, 68, 0.04)',
  borderLeft: `3px solid ${colors.primary400}`,
})

export const todayCardTitleStyle = style({
  fontSize: '16px',
  fontWeight: 700,
  letterSpacing: '-0.48px',
  color: colors.gray900,
})

export const todayCardTitleCompactStyle = style({
  fontSize: '14px',
  fontWeight: 700,
  letterSpacing: '-0.42px',
  color: colors.gray900,
})

export const todayCardMetaStyle = style({
  fontSize: '12px',
  fontWeight: 500,
  letterSpacing: '-0.36px',
  color: colors.gray500,
})

export const todayCardMetaCompactStyle = style({
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '-0.33px',
  color: colors.gray500,
})

export const todayCardActionsStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: 'auto',
})

export const emptyTodayStyle = style({
  padding: '28px 20px',
  textAlign: 'center',
  fontSize: '14px',
  fontWeight: 500,
  color: colors.gray600,
  lineHeight: 1.55,
  background: `linear-gradient(135deg, ${colors.primary50} 0%, ${colors.gray50} 100%)`,
  borderRadius: '14px',
  border: `1px dashed ${colors.primary200}`,
})

export const emptyTodayCompactStyle = style({
  padding: '14px 12px',
  textAlign: 'center',
  fontSize: '12px',
  fontWeight: 500,
  color: colors.gray600,
  lineHeight: 1.5,
  background: colors.gray50,
  borderRadius: '12px',
  border: `1px dashed ${colors.gray100}`,
})

export const attendanceGridStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '12px',
})

export const attendanceGridRichStyle = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(288px, 1fr))',
  gap: '14px',
})

export const attendanceClassCardStyle = style({
  background: colors.white,
  border: `1.5px solid ${colors.gray75}`,
  borderRadius: '14px',
  padding: '16px 18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
})

export const attendanceClassCardActiveStyle = style({
  borderColor: colors.primary300,
  boxShadow: `0 0 0 1px ${colors.primary200}`,
})

export const attendanceCardRichStyle = style({
  background: colors.white,
  border: `1px solid ${colors.gray75}`,
  borderRadius: '16px',
  padding: '16px 18px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  boxShadow: '0 2px 12px rgba(54, 55, 68, 0.06)',
})

export const attendanceCardRichActiveStyle = style({
  borderColor: colors.primary300,
  boxShadow: `0 0 0 2px ${colors.primary100}, 0 4px 16px rgba(59, 81, 204, 0.12)`,
})

export const attendanceCardHeadStyle = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '10px',
})

export const attendanceCardNameStyle = style({
  fontSize: '16px',
  fontWeight: 700,
  letterSpacing: '-0.48px',
  color: colors.gray900,
  lineHeight: 1.35,
})

export const attendanceTodayBadgeStyle = style({
  flexShrink: 0,
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '-0.33px',
  color: colors.primary600,
  background: colors.primary100,
  borderRadius: '8px',
  padding: '4px 8px',
})

export const attendanceCardMetaBlockStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
})

export const attendanceCardMetaLineStyle = style({
  fontSize: '13px',
  fontWeight: 500,
  letterSpacing: '-0.39px',
  color: colors.gray600,
  lineHeight: 1.45,
})

export const attendanceCardSchedulePillStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  width: 'fit-content',
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '-0.36px',
  color: colors.gray700,
  background: colors.gray50,
  borderRadius: '8px',
  padding: '5px 10px',
  border: `1px solid ${colors.gray75}`,
})

export const attendanceCardFooterStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '10px',
  paddingTop: '10px',
  borderTop: `1px solid ${colors.gray75}`,
  marginTop: '2px',
})

export const attendanceCardLessonActionsStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '8px',
})

export const attendanceHintStyle = style({
  margin: '0 0 14px',
  fontSize: '13px',
  fontWeight: 500,
  letterSpacing: '-0.39px',
  color: colors.gray600,
  lineHeight: 1.5,
})

export const attendanceSessionForeignStyle = style({
  marginBottom: '14px',
  padding: '12px 14px',
  borderRadius: '12px',
  background: colors.primary50,
  border: `1px solid ${colors.primary200}`,
  fontSize: '13px',
  fontWeight: 600,
  letterSpacing: '-0.39px',
  color: colors.primary700,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '10px',
})

export const attendanceEmptyStyle = style({
  padding: '20px 16px',
  textAlign: 'center',
  fontSize: '14px',
  fontWeight: 500,
  color: colors.gray600,
  lineHeight: 1.55,
  background: colors.gray50,
  borderRadius: '14px',
  border: `1px dashed ${colors.gray100}`,
})

export const guideDetailsStyle = style({
  border: `1px solid ${colors.gray100}`,
  borderRadius: '16px',
  background: colors.white,
  overflow: 'hidden',
})

export const guideSummaryStyle = style({
  padding: '16px 20px',
  fontSize: '15px',
  fontWeight: 700,
  letterSpacing: '-0.45px',
  color: colors.gray900,
  cursor: 'pointer',
  listStyle: 'none',
  selectors: {
    '&::-webkit-details-marker': {
      display: 'none',
    },
  },
})

export const guideBodyStyle = style({
  padding: '0 20px 20px',
  borderTop: `1px solid ${colors.gray75}`,
})

export const workTwoColStyle = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  gap: '20px',
  alignItems: 'stretch',
  '@media': {
    '(max-width: 900px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

export const statsStripOuterStyle = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '10px',
  padding: '14px 18px',
  borderRadius: '18px',
  background: `linear-gradient(102deg, ${colors.primary50} 0%, ${colors.white} 40%, ${colors.success50} 100%)`,
  border: `1px solid ${colors.primary200}`,
  boxShadow: '0 4px 18px rgba(59, 81, 204, 0.08)',
})

export const statChipStyle = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 14px',
  borderRadius: '999px',
  fontSize: '13px',
  fontWeight: 600,
  letterSpacing: '-0.39px',
  color: colors.gray900,
})

export const statChipPrimaryStyle = style({
  background: colors.white,
  border: `1px solid ${colors.primary200}`,
  boxShadow: '0 2px 10px rgba(59, 81, 204, 0.12)',
})

export const statChipDraftStyle = style({
  background: colors.white,
  border: `1px solid ${colors.warning200}`,
  boxShadow: '0 2px 10px rgba(253, 173, 34, 0.14)',
})

export const statChipAttentionStyle = style({
  background: colors.white,
  border: `1px solid ${colors.error200}`,
  boxShadow: '0 2px 10px rgba(239, 68, 83, 0.1)',
})

export const statChipDotStyle = style({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  flexShrink: 0,
})

export const statChipDotPrimaryStyle = style({
  background: colors.primary500,
})

export const statChipDotWarnStyle = style({
  background: colors.warning500,
})

export const statChipDotRoseStyle = style({
  background: colors.error500,
})

export const statChipEmStyle = style({
  fontStyle: 'normal',
  fontWeight: 800,
  fontSize: '15px',
  marginLeft: '4px',
})

export const statChipEmPrimaryStyle = style({
  color: colors.primary600,
})

export const statChipEmWarnStyle = style({
  color: '#C77D00',
})

export const statChipEmRoseStyle = style({
  color: colors.error600,
})

export const contentSurfaceStyle = style({
  background: colors.white,
  borderRadius: '20px',
  padding: '22px',
  border: `1px solid ${colors.gray75}`,
  boxShadow: '0 6px 28px rgba(54, 55, 68, 0.08)',
})

export const surfaceAccentPrimaryStyle = style({
  borderTop: `4px solid ${colors.primary500}`,
})

export const attendanceSectionPanelStyle = style({
  borderRadius: '20px',
  padding: '22px 22px 8px',
  background: `linear-gradient(180deg, ${colors.primary50} 0%, ${colors.white} 55%)`,
  border: `1px solid ${colors.primary200}`,
  boxShadow: '0 6px 24px rgba(59, 81, 204, 0.07)',
})

export const guidePanelStyle = style({
  borderRadius: '20px',
  overflow: 'hidden',
  border: `1px solid ${colors.primary200}`,
  boxShadow: '0 10px 36px rgba(59, 81, 204, 0.1)',
  background: colors.white,
})

export const guidePanelHeaderStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '16px 22px',
  background: `linear-gradient(92deg, ${colors.primary500} 0%, ${colors.primary400} 55%, #6B8AE8 100%)`,
  color: colors.white,
  fontSize: '17px',
  fontWeight: 700,
  letterSpacing: '-0.51px',
})

export const guidePanelBodyStyle = style({
  padding: '20px 22px 24px',
  background: colors.gray50,
})

export const promoGridResponsiveStyle = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
  '@media': {
    '(max-width: 720px)': {
      gridTemplateColumns: '1fr',
    },
  },
})
