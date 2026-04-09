'use client'

import { colors } from '@/styles/tokens/colors'
import type { HealthMetric, PulseTone } from '../statsModel'
import * as styles from '../stats.css'

function toneCopy(tone: PulseTone): { label: string; bg: string; fg: string } {
  switch (tone) {
    case 'ok':
      return { label: '양호', bg: colors.success50, fg: colors.success500 }
    case 'warn':
      return { label: '주의', bg: colors.warning50, fg: colors.warning500 }
    case 'risk':
      return { label: '점검', bg: colors.error50, fg: colors.error500 }
    default:
      return { label: '참고', bg: colors.gray50, fg: colors.gray600 }
  }
}

export default function HealthOverview({ metrics }: { metrics: HealthMetric[] }) {
  return (
    <section className={styles.sectionBlock} aria-labelledby="stats-health-title">
      <div className={styles.sectionHead}>
        <h2 id="stats-health-title" className={styles.sectionTitle}>
          운영 건강도
        </h2>
        <p className={styles.sectionDesc}>
          수업 기록·과제·학생 상태를 요약한 지표예요. 수치만 보지 말고, 아래 챙길 학생·반 목록과 함께 보시면 좋아요.
        </p>
      </div>
      <div className={styles.healthGrid}>
        {metrics.map((m) => {
          const t = toneCopy(m.tone)
          return (
            <div key={m.id} className={styles.healthCard}>
              <div className={styles.healthLabel}>{m.label}</div>
              <div className={styles.healthValueRow}>
                <span className={styles.healthValue}>{m.value}</span>
                <span className={styles.tonePill} style={{ background: t.bg, color: t.fg }}>
                  {t.label}
                </span>
              </div>
              <p className={styles.healthHint}>{m.hint}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
