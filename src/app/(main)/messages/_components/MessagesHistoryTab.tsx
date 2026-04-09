'use client'

import { useMemo, useState } from 'react'
import { colors } from '@/styles/tokens/colors'
import {
  ALIMTALK_HISTORY_BATCHES,
  filterHistory,
  historyChipCounts,
  type AlimtalkHistoryBatch,
  type HistoryFilter,
} from '../alimtalkData'
import * as styles from '../messages.css'
import BatchDetailModal from './BatchDetailModal'

function IconRefresh() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2.5 8a5.5 5.5 0 0 1 9.18-4.1M13.5 8a5.5 5.5 0 0 1-9.18 4.1M12.5 1.5V5h-3.5M3.5 14.5V11h3.5"
        stroke={colors.gray700}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const FILTER_DEF: { key: HistoryFilter; label: string; countKey: keyof ReturnType<typeof historyChipCounts> }[] = [
  { key: 'all', label: '전체', countKey: 'all' },
  { key: 'complete', label: '발송 완료', countKey: 'complete' },
  { key: 'failed', label: '실패', countKey: 'failed' },
  { key: 'lesson', label: '수업 문자', countKey: 'lesson' },
  { key: 'attendance', label: '출결 문자', countKey: 'attendance' },
]

export default function MessagesHistoryTab() {
  const [filter, setFilter] = useState<HistoryFilter>('all')
  const [detailBatchId, setDetailBatchId] = useState<number | null>(null)
  const [resentIds, setResentIds] = useState<Set<number>>(new Set())

  const counts = useMemo(() => historyChipCounts(ALIMTALK_HISTORY_BATCHES), [])
  const rows = useMemo(
    () => filterHistory(ALIMTALK_HISTORY_BATCHES, filter),
    [filter],
  )

  const detailBatch: AlimtalkHistoryBatch | null = useMemo(() => {
    if (detailBatchId == null) return null
    return ALIMTALK_HISTORY_BATCHES.find((b) => b.id === detailBatchId) ?? null
  }, [detailBatchId])

  return (
    <>
      <div className={styles.filterRow}>
        {FILTER_DEF.map(({ key, label, countKey }) => {
          const active = filter === key
          return (
            <button
              key={key}
              type="button"
              className={`${styles.filterChip}${active ? ` ${styles.filterChipActive}` : ''}`}
              onClick={() => setFilter(key)}
            >
              <span>{label}</span>
              <span>{counts[countKey]}</span>
            </button>
          )
        })}
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th} style={{ width: 200 }}>
                발송 일시
              </th>
              <th className={styles.th} style={{ width: 140 }}>
                반
              </th>
              <th className={styles.th} style={{ width: 220 }}>
                발송 상태
              </th>
              <th className={styles.th} style={{ width: 100 }}>
                문자 유형
              </th>
              <th className={styles.th} style={{ width: 200 }}>
                수업 템플릿
              </th>
              <th className={styles.th} style={{ width: 120 }}>
                발송 수
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className={styles.td} colSpan={6} style={{ textAlign: 'center', color: colors.gray500 }}>
                  조건에 맞는 발송 내역이 없어요.
                </td>
              </tr>
            ) : (
              rows.map((batch) => {
                const hasStudents = batch.students.length > 0
                const showResend = batch.failCount > 0 && !resentIds.has(batch.id)

                return (
                  <tr
                    key={batch.id}
                    className={hasStudents ? styles.tableRowInteractive : undefined}
                    onClick={() => {
                      if (hasStudents) setDetailBatchId(batch.id)
                    }}
                    title={hasStudents ? '클릭하면 학생별 발송 문자를 볼 수 있어요' : undefined}
                  >
                    <td className={styles.td}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: colors.gray900 }}>
                          {batch.sentAtLabel}
                        </span>
                        {hasStudents && (
                          <span className={styles.hintMuted}>학생별 내용 보기</span>
                        )}
                      </div>
                    </td>
                    <td className={styles.td}>{batch.className}</td>
                    <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                      <div className={styles.statusCellInner}>
                        {batch.failCount === 0 ? (
                          <span className={styles.statusOk}>발송 완료</span>
                        ) : (
                          <>
                            <span className={styles.statusFail}>실패 {batch.failCount}건</span>
                            {showResend && (
                              <button
                                type="button"
                                className={styles.resendBtn}
                                onClick={() =>
                                  setResentIds((prev) => new Set([...prev, batch.id]))
                                }
                              >
                                <IconRefresh />
                                재발송
                              </button>
                            )}
                            {!showResend && batch.failCount > 0 && resentIds.has(batch.id) && (
                              <span style={{ fontSize: 13, color: colors.gray500 }}>재발송 완료</span>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td className={styles.td}>
                      {batch.type === 'lesson' ? (
                        <span className={styles.typePillLesson}>수업</span>
                      ) : (
                        <span className={styles.typePillAtt}>출결</span>
                      )}
                    </td>
                    <td className={styles.td}>
                      {batch.templateName ? (
                        <span className={styles.tplPill}>{batch.templateName}</span>
                      ) : (
                        <span className={styles.tplPill} style={{ color: colors.gray500 }}>
                          —
                        </span>
                      )}
                    </td>
                    <td className={styles.td}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: colors.gray900 }}>
                        {batch.recipientCount}명
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <BatchDetailModal
        batch={detailBatch}
        isOpen={detailBatchId != null && detailBatch != null}
        onClose={() => setDetailBatchId(null)}
      />
    </>
  )
}
