'use client'

import { useEffect, useState } from 'react'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import { colors } from '@/styles/tokens/colors'
import type { AlimtalkHistoryBatch } from '../alimtalkData'
import * as styles from '../messages.css'

function messagePreviewLine(text: string, max = 40): string {
  const line = text.split('\n').find((l) => l.trim())?.trim() ?? ''
  if (!line) return '내용 없음'
  return line.length > max ? `${line.slice(0, max)}…` : line
}

interface Props {
  batch: AlimtalkHistoryBatch | null
  isOpen: boolean
  onClose: () => void
}

export default function BatchDetailModal({ batch, isOpen, onClose }: Props) {
  const [studentId, setStudentId] = useState<number | null>(null)

  useEffect(() => {
    if (!batch?.students.length) {
      setStudentId(null)
      return
    }
    setStudentId(batch.students[0].studentId)
  }, [batch])

  const selected = batch?.students.find((s) => s.studentId === studentId)

  if (!batch) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className={styles.batchDetailShell}>
        <header className={styles.batchDetailHeader}>
          <h2 className={styles.batchDetailTitle}>학생별 발송 내용</h2>
          <div className={styles.batchDetailMeta}>
            <span style={{ fontSize: 14, fontWeight: 600, color: colors.gray900 }}>{batch.sentAtLabel}</span>
            <span style={{ color: colors.gray300 }}>·</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: colors.gray700 }}>{batch.className}</span>
            {batch.type === 'lesson' ? (
              <span className={styles.typePillLesson}>수업</span>
            ) : (
              <span className={styles.typePillAtt}>출결</span>
            )}
            {batch.templateName ? (
              <span className={styles.tplPill}>{batch.templateName}</span>
            ) : (
              <span className={styles.tplPill} style={{ color: colors.gray500 }}>
                —
              </span>
            )}
            <span className={styles.hintMuted}>{batch.recipientCount}명 대상</span>
          </div>
        </header>

        <div className={styles.batchDetailBody}>
          <aside className={styles.batchDetailStudentList} aria-label="학생 목록">
            {batch.students.map((s) => {
              const active = s.studentId === studentId
              return (
                <button
                  key={s.studentId}
                  type="button"
                  className={`${styles.batchDetailStudentBtn}${active ? ` ${styles.batchDetailStudentBtnActive}` : ''}`}
                  onClick={() => setStudentId(s.studentId)}
                >
                  <span className={styles.batchDetailStudentName}>{s.studentName}</span>
                  <span className={styles.batchDetailStudentHint}>{messagePreviewLine(s.fullContent)}</span>
                  {s.isExpired && (
                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        color: colors.gray500,
                        background: colors.gray100,
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}
                    >
                      링크 만료
                    </span>
                  )}
                </button>
              )
            })}
          </aside>

          <section className={styles.batchDetailMessageCol} aria-live="polite">
            <p className={styles.batchDetailMessageLabel}>
              {selected ? `${selected.studentName}님에게 발송된 문자` : '학생을 선택하세요'}
            </p>
            <div className={styles.batchDetailMessageBox}>
              {selected ? (
                <pre className={styles.batchDetailMessagePre}>{selected.fullContent}</pre>
              ) : (
                <p style={{ margin: 0, fontSize: 14, color: colors.gray500 }}>왼쪽에서 학생을 선택하면 전문이 표시됩니다.</p>
              )}
            </div>
          </section>
        </div>

        <footer className={styles.batchDetailFooter}>
          <Button variant="secondary" size="md" type="button" onClick={onClose}>
            닫기
          </Button>
        </footer>
      </div>
    </Modal>
  )
}
