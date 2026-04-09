'use client'

import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { useAttendanceStore } from '@/stores/attendanceStore'
import type { TodayAction } from '../statsModel'
import * as styles from '../stats.css'

function mergeWithAttendance(
  base: TodayAction[],
  session: { className: string } | null,
): TodayAction[] {
  if (!session) return base
  const live: TodayAction = {
    id: 'attendance-live',
    title: '출결이 진행 중이에요',
    sub: `${session.className} · 출결 화면에서 마감하거나 학생 현황을 확인하세요.`,
    href: '/attendance',
    emphasis: true,
    badge: '진행 중',
  }
  return [live, ...base.filter((a) => a.id !== 'attendance-live')]
}

export default function TodayActionsStrip({ actions }: { actions: TodayAction[] }) {
  const router = useRouter()
  const session = useAttendanceStore((s) => s.session)

  const list = useMemo(
    () => mergeWithAttendance(actions, session),
    [actions, session],
  )

  return (
    <section className={styles.sectionBlock} aria-labelledby="stats-actions-title">
      <div className={styles.sectionHead}>
        <h2 id="stats-actions-title" className={styles.sectionTitle}>
          오늘 할 일
        </h2>
        <p className={styles.sectionDesc}>
          지금 바로 처리하면 좋은 일부터 보여 드려요. 카드를 누르면 해당 화면으로 이동합니다.
        </p>
      </div>
      <div className={styles.actionStrip}>
        {list.map((a) => (
          <button
            key={a.id}
            type="button"
            className={`${styles.actionCard}${a.emphasis ? ` ${styles.actionCardEmphasis}` : ''}`}
            onClick={() => {
              router.push(a.href)
              if (a.href.includes('#')) {
                const id = a.href.split('#')[1]
                requestAnimationFrame(() =>
                  document.getElementById(id)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  }),
                )
              }
            }}
          >
            <div className={styles.actionCardTitleRow}>
              <span className={styles.actionTitle}>{a.title}</span>
              {a.badge && <span className={styles.actionBadge}>{a.badge}</span>}
            </div>
            <p className={styles.actionSub}>{a.sub}</p>
          </button>
        ))}
      </div>
    </section>
  )
}
