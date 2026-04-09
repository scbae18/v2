'use client'

import Link from 'next/link'
import EditIcon from '@/assets/icons/icon-edit.svg'
import UsersIcon from '@/assets/icons/icon-users.svg'
import ClipboardIcon from '@/assets/icons/icon-clipboard.svg'
import MessageIcon from '@/assets/icons/icon-message.svg'
import FlagIcon from '@/assets/icons/icon-flag.svg'
import TabIcon from '@/assets/icons/icon-tab.svg'
import * as styles from '../home.css'

const items: {
  href: string
  label: string
  desc: string
  Icon: typeof EditIcon
  iconAccent: string
  badge?: (draftCount: number) => string | null
}[] = [
  {
    href: '/lesson',
    label: '수업 기록',
    desc: '날짜·반별 입력',
    Icon: EditIcon,
    iconAccent: styles.qnIconLessonStyle,
    badge: (d) => (d > 0 ? `임시 ${d}` : null),
  },
  {
    href: '/management',
    label: '학생 · 반',
    desc: '명단·반 정보',
    Icon: UsersIcon,
    iconAccent: styles.qnIconMgmtStyle,
  },
  {
    href: '/template',
    label: '수업 템플릿',
    desc: '항목·문자 구성',
    Icon: ClipboardIcon,
    iconAccent: styles.qnIconTplStyle,
  },
  {
    href: '/messages',
    label: '문자 · 알림톡',
    desc: '발송·내역',
    Icon: MessageIcon,
    iconAccent: styles.qnIconMsgStyle,
  },
  {
    href: '/stats',
    label: '현황 · 통계',
    desc: '한눈에 보기',
    Icon: FlagIcon,
    iconAccent: styles.qnIconStatsStyle,
  },
  {
    href: '/ai-settings',
    label: 'AI 문장',
    desc: '피드백 톤',
    Icon: TabIcon,
    iconAccent: styles.qnIconAiStyle,
  },
]

export default function HomeQuickNav({ draftCount }: { draftCount: number }) {
  return (
    <section className={styles.quickNavPanelStyle} aria-labelledby="home-quicknav-title">
      <div style={{ marginBottom: 16 }}>
        <h2 id="home-quicknav-title" className={styles.workSectionTitleStyle}>
          자주 쓰는 메뉴
        </h2>
        <p className={styles.workSectionHintStyle} style={{ marginTop: 6 }}>
          수업 흐름대로 바로 들어가 보세요.
        </p>
      </div>
      <div className={styles.quickNavGridStyle}>
        {items.map(({ href, label, desc, Icon, iconAccent, badge }) => {
          const b = badge?.(draftCount) ?? null
          return (
            <Link key={href} href={href} className={styles.quickNavLinkStyle}>
              <span className={`${styles.quickNavIconBaseStyle} ${iconAccent}`}>
                <Icon width={22} height={22} />
              </span>
              <span className={styles.quickNavLabelStyle}>
                {label}
                {b && <span className={styles.quickNavBadgeStyle}>{b}</span>}
              </span>
              <span className={styles.quickNavDescStyle}>{desc}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
