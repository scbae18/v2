'use client'

import { useState } from 'react'
import MessagesHistoryTab from './_components/MessagesHistoryTab'
import MessagesSettingsTab from './_components/MessagesSettingsTab'
import * as styles from './messages.css'

type Tab = 'settings' | 'history'

export default function MessagesPage() {
  const [tab, setTab] = useState<Tab>('settings')

  return (
    <div className={styles.pageRoot}>
      <h1 className={styles.pageTitle}>알림톡</h1>

      <div className={styles.tabBar}>
        <button
          type="button"
          className={`${styles.tabBtn}${tab === 'settings' ? ` ${styles.tabBtnActive}` : ''}`}
          onClick={() => setTab('settings')}
        >
          문자 설정
        </button>
        <button
          type="button"
          className={`${styles.tabBtn}${tab === 'history' ? ` ${styles.tabBtnActive}` : ''}`}
          onClick={() => setTab('history')}
        >
          발송 내역
        </button>
      </div>

      {tab === 'settings' ? <MessagesSettingsTab /> : <MessagesHistoryTab />}
    </div>
  )
}
