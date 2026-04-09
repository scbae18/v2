'use client'

import { useUserStore } from '@/stores/userStore'
import * as styles from '../home.css'

function formatJoined(iso: string): string {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  } catch {
    return ''
  }
}

type Props = {
  dateLabel: string
}

export default function HomeUserCard({ dateLabel }: Props) {
  const user = useUserStore((s) => s.user)
  const initial = user?.name?.trim()?.charAt(0) ?? '?'
  const joined = user?.created_at ? formatJoined(user.created_at) : ''

  return (
    <section className={styles.userCardProStyle} aria-label="계정 정보">
      <div className={styles.userCardProHeaderStyle}>
        <p className={styles.userCardProHeaderTitleStyle}>내 계정 · 클랫 for Teachers</p>
        <span className={styles.userCardProBetaStyle}>BETA</span>
      </div>
      <div className={styles.userCardProBodyStyle}>
        {user ? (
          <>
            <div className={styles.userCardProLeftStyle}>
              <div className={styles.userCardAvatarProStyle} aria-hidden>
                {initial}
              </div>
              <div className={styles.userCardProMainStyle}>
                <div className={styles.userCardProTitleRowStyle}>
                  <span className={styles.userCardProNameStyle}>{user.name}</span>
                  <span className={styles.userCardProBadgeStyle}>강사</span>
                </div>
                <p className={styles.userCardProEmailStyle}>{user.email}</p>
              </div>
            </div>
            <div className={styles.userCardProAsideStyle}>
              <div className={styles.userCardProAsideBlockStyle}>
                <span className={styles.userCardProAsideLabelStyle}>목업 기준일</span>
                <span className={styles.userCardProAsideValueStyle}>{dateLabel}</span>
              </div>
              {joined ? (
                <div className={styles.userCardProAsideBlockStyle}>
                  <span className={styles.userCardProAsideLabelStyle}>가입일</span>
                  <span className={styles.userCardProAsideValueStyle}>{joined}</span>
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <p className={styles.userCardPlaceholderStyle}>계정 정보를 불러오는 중입니다.</p>
        )}
      </div>
    </section>
  )
}
