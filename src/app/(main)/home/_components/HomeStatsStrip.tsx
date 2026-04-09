'use client'

import * as styles from '../home.css'

type Props = {
  todayClassCount: number
  draftCount: number
  attentionCount: number
}

export default function HomeStatsStrip({ todayClassCount, draftCount, attentionCount }: Props) {
  return (
    <div className={styles.statsStripOuterStyle} role="region" aria-label="오늘 요약">
      <span className={`${styles.statChipStyle} ${styles.statChipPrimaryStyle}`}>
        <span className={`${styles.statChipDotStyle} ${styles.statChipDotPrimaryStyle}`} />
        오늘 수업 반{' '}
        <em className={`${styles.statChipEmStyle} ${styles.statChipEmPrimaryStyle}`}>{todayClassCount}</em>
      </span>
      <span className={`${styles.statChipStyle} ${styles.statChipDraftStyle}`}>
        <span className={`${styles.statChipDotStyle} ${styles.statChipDotWarnStyle}`} />
        작성 중{' '}
        <em className={`${styles.statChipEmStyle} ${styles.statChipEmWarnStyle}`}>{draftCount}</em>
      </span>
      <span className={`${styles.statChipStyle} ${styles.statChipAttentionStyle}`}>
        <span className={`${styles.statChipDotStyle} ${styles.statChipDotRoseStyle}`} />
        확인할 학생{' '}
        <em className={`${styles.statChipEmStyle} ${styles.statChipEmRoseStyle}`}>{attentionCount}</em>
      </span>
    </div>
  )
}
