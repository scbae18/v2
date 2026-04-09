'use client'

import { useRouter } from 'next/navigation'
import Button from '@/components/common/Button'
import { colors } from '@/styles/tokens/colors'
import type { AttentionStudent } from '../statsModel'
import * as styles from '../stats.css'

const c = colors

const VISIBLE = 6

export default function AttentionStudentsSection({
  students,
}: {
  students: AttentionStudent[]
}) {
  const router = useRouter()
  const slice = students.slice(0, VISIBLE)
  const more = students.length - slice.length

  return (
    <section
      id="attention"
      className={styles.attentionPanel}
      aria-labelledby="stats-attention-title"
    >
      <div className={styles.attentionHeadRow}>
        <div>
          <h2 id="stats-attention-title" className={styles.sectionTitle}>
            챙길 학생
          </h2>
          <p className={styles.sectionDesc} style={{ marginTop: 6 }}>
            미완료 항목이 있거나 완료율이 낮은 학생이에요. 학생 카드를 누르면 상세 페이지로 이동합니다.
          </p>
        </div>
        <span className={styles.metaLine} style={{ marginTop: 0 }}>
          {students.length}명
        </span>
      </div>

      {students.length === 0 ? (
        <div className={styles.emptyState}>지금은 우선 챙겨야 할 학생이 없어요.</div>
      ) : (
        <>
          <div className={styles.attentionList}>
            {slice.map((s) => {
              const chipBg = s.reasonTone === 'risk' ? c.error50 : c.warning50
              const chipFg = s.reasonTone === 'risk' ? c.error500 : c.warning500
              const rateColor =
                s.completionPct >= 80 ? c.success500 : s.completionPct >= 60 ? c.warning500 : c.error500
              return (
                <button
                  key={s.id}
                  type="button"
                  className={styles.attentionRow}
                  onClick={() => router.push(`/students/${s.id}`)}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span className={styles.studentName}>{s.name}</span>
                      <span className={styles.reasonChip} style={{ background: chipBg, color: chipFg }}>
                        {s.reasonLabel}
                      </span>
                    </div>
                    <div className={styles.studentClasses}>{s.classesLine}</div>
                  </div>
                  <div className={styles.pctBlock}>
                    <div className={styles.pctValue} style={{ color: rateColor }}>
                      {s.completionPct}%
                    </div>
                    <div className={styles.pctLabel}>완료율</div>
                  </div>
                </button>
              )
            })}
          </div>
          {more > 0 && (
            <p className={styles.healthHint} style={{ marginTop: 12, textAlign: 'center' }}>
              외 {more}명은 학생·반 관리에서 확인할 수 있어요.
            </p>
          )}
          <div className={styles.footLinkRow}>
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => router.push('/management')}
            >
              학생·반 관리로 이동
            </Button>
          </div>
        </>
      )}
    </section>
  )
}
