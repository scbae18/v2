'use client'

import { useRouter } from 'next/navigation'
import { colors } from '@/styles/tokens/colors'
import type { ClassOverviewRow, PulseTone } from '../statsModel'
import * as styles from '../stats.css'

function pulseBarColor(tone: PulseTone): string {
  switch (tone) {
    case 'ok':
      return colors.success500
    case 'warn':
      return colors.warning500
    case 'risk':
      return colors.error500
    default:
      return colors.gray200
  }
}

export default function ClassOverviewTable({ rows }: { rows: ClassOverviewRow[] }) {
  const router = useRouter()

  return (
    <section className={styles.sectionBlock} aria-labelledby="stats-class-table-title">
      <div className={styles.sectionHead}>
        <h2 id="stats-class-table-title" className={styles.sectionTitle}>
          반별 운영 요약
        </h2>
        <p className={styles.sectionDesc}>
          저장된 수업 수와 지표를 한 줄로 비교해요. 행을 누르면 해당 반 관리 화면으로 이동합니다.
        </p>
      </div>

      <div className={styles.tablePanel}>
        <div className={styles.tableScroll}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th className={styles.th} style={{ width: '36%' }}>
                  반
                </th>
                <th className={styles.th} style={{ width: '12%' }}>
                  학생
                </th>
                <th className={styles.th} style={{ width: '14%' }}>
                  저장 수업
                </th>
                <th className={styles.th} style={{ width: '12%' }}>
                  평균 점수
                </th>
                <th className={styles.th} style={{ width: '12%' }}>
                  출석률
                </th>
                <th className={styles.th} style={{ width: '12%' }}>
                  완료율
                </th>
                <th className={styles.th} style={{ width: '8%' }} aria-label="이동" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.classId}
                  className={styles.tableRowClickable}
                  onClick={() => router.push(`/management/${r.classId}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      router.push(`/management/${r.classId}`)
                    }
                  }}
                  tabIndex={0}
                  role="link"
                >
                  <td className={styles.td}>
                    <div className={styles.nameCellInner}>
                      <span
                        className={styles.rowPulse}
                        style={{ background: pulseBarColor(r.pulse) }}
                        aria-hidden
                      />
                      <span
                        style={{
                          fontWeight: 600,
                          color: colors.gray900,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {r.className}
                      </span>
                    </div>
                  </td>
                  <td className={styles.td}>{r.studentCount}명</td>
                  <td className={styles.td}>{r.savedLessonCount}회</td>
                  <td className={styles.td}>{r.avgScoreDisplay}</td>
                  <td className={styles.td}>{r.attendanceDisplay}</td>
                  <td className={styles.td}>{r.completionPct}%</td>
                  <td className={styles.td}>
                    <span className={styles.cellLink}>관리</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
