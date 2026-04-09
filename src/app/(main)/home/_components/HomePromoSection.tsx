import Image from 'next/image'
import giftBox from '@/assets/images/gift-box.png'
import envelope from '@/assets/images/envelope.png'
import ChevronRight from '@/assets/icons/icon-chevron-right.svg'
import * as styles from '../home.css'

export default function HomePromoSection() {
  return (
    <div className={styles.promoGridResponsiveStyle}>
      <div className={styles.betaCardStyle}>
        <div className={styles.cardContentStyle}>
          <div className={styles.cardTagStyle}>베타 테스터 혜택</div>
          <div className={styles.cardTitleStyle}>
            지금 참여하면
            <br />
            3개월 무료
          </div>
          <div className={styles.cardDescStyle}>
            베타 기간 동안 모든 기능을
            <br />
            무료로 사용하세요.
          </div>
        </div>
        <div className={styles.cardImageWrapStyle}>
          <Image src={giftBox} alt="" width={360} height={360} style={{ objectFit: 'contain' }} />
        </div>
      </div>

      <div className={styles.inviteCardStyle}>
        <div className={styles.cardContentStyle}>
          <div className={styles.cardTagInvertStyle}>친구 초대 이벤트</div>
          <div className={styles.cardTitleInvertStyle}>
            친구 초대하고
            <br />
            3개월 추가 무료
          </div>
          <a
            href="https://forms.gle/GnAunK7KUQQuHCSY8"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.inviteButtonStyle}
          >
            친구 초대하기
            <ChevronRight width={24} height={24} />
          </a>
        </div>
        <div className={styles.cardImageWrapStyle}>
          <Image src={envelope} alt="" width={360} height={360} style={{ objectFit: 'contain' }} />
        </div>
      </div>
    </div>
  )
}
