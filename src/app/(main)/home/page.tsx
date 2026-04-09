'use client'

import { useMemo } from 'react'
import { buildHomeSnapshot } from './homeModel'
import * as styles from './home.css'
import HomeBanner from './_components/HomeBanner'
import HomeUserCard from './_components/HomeUserCard'
import HomeStatsStrip from './_components/HomeStatsStrip'
import HomeQuickNav from './_components/HomeQuickNav'
import HomeAttendanceSection from './_components/HomeAttendanceSection'
import HomeGuideCollapsible from './_components/HomeGuideCollapsible'
import HomePromoSection from './_components/HomePromoSection'

export default function HomePage() {
  const snap = useMemo(() => buildHomeSnapshot(), [])

  return (
    <div className={styles.pageStyle}>
      <div className={styles.homeTopStackStyle}>
        <HomeBanner />
        <div className={styles.userCardDockStyle}>
          <HomeUserCard dateLabel={snap.dateLabel} />
        </div>
      </div>

      <HomeStatsStrip
        todayClassCount={snap.todayClasses.length}
        draftCount={snap.draftLessonCount}
        attentionCount={snap.attentionTotal}
      />

      <HomeQuickNav draftCount={snap.draftLessonCount} />

      <div className={styles.attendanceSectionPanelStyle}>
        <HomeAttendanceSection dateLabel={snap.weekdayLine} />
      </div>

      <HomeGuideCollapsible />

      <HomePromoSection />
    </div>
  )
}
