'use client'

import { useMemo } from 'react'
import { buildDashboardModel } from './statsModel'
import * as styles from './stats.css'
import TodayActionsStrip from './_components/TodayActionsStrip'
import HealthOverview from './_components/HealthOverview'
import AttentionStudentsSection from './_components/AttentionStudentsSection'
import ClassOverviewTable from './_components/ClassOverviewTable'
import StatsAnalyticsPanel from './_components/StatsAnalyticsPanel'

export default function StatsPage() {
  const model = useMemo(() => buildDashboardModel(), [])

  return (
    <div className={styles.pageRoot}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>전체 관리</h1>
        <p className={styles.pageSubtitle}>
          오늘 처리할 일·운영 지표·챙길 학생·반 단위 요약을 순서대로 모았습니다. 아래는
          목업 데이터 기준이며, 실제 서비스에서는 기간·반 필터를 연결할 수 있습니다.
        </p>
        <p className={styles.metaLine}>{model.meta.referenceDateLabel}</p>
      </header>

      <TodayActionsStrip actions={model.actions} />
      <HealthOverview metrics={model.health} />
      <AttentionStudentsSection students={model.attention} />
      <ClassOverviewTable rows={model.classes} />
      <StatsAnalyticsPanel weekly={model.weekly} classCompare={model.classCompare} />
    </div>
  )
}
