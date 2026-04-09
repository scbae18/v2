'use client'

import Image from 'next/image'
import LogoBetaIcon from '@/assets/logo/logo-beta.svg'
import bannerIllust from '@/assets/images/banner-illust.png'
import * as styles from '../home.css'

export default function HomeBanner() {
  return (
    <div className={styles.bannerStyle}>
      <div className={styles.bannerContentStyle}>
        <div style={{ overflow: 'hidden', height: 24, width: 120 }}>
          <LogoBetaIcon style={{ height: 16, width: 'auto', marginLeft: 3 }} />
        </div>
        <div>
          <div className={styles.bannerSubtitleStyle}>수업 기록부터 문자까지,</div>
          <div className={styles.bannerTitleStyle}>3분이면 끝</div>
        </div>
      </div>
      <div className={styles.bannerIllustWrapStyle} aria-hidden>
        <Image
          src={bannerIllust}
          alt=""
          width={520}
          height={380}
          style={{ objectFit: 'contain', objectPosition: 'right bottom', width: 'auto', maxHeight: 380 }}
        />
      </div>
    </div>
  )
}
