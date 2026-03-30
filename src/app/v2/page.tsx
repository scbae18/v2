'use client'

import Link from 'next/link'
import { colors } from '@/styles/tokens/colors'

const c = colors

const EXISTING_PAGES = [
  { href: '/home', label: '홈 (대시보드)', desc: '오늘의 수업 요약' },
  { href: '/lesson', label: '수업 입력', desc: '날짜별 수업 목록 & 상세 입력' },
  { href: '/management', label: '학생·반 관리', desc: '반 목록, 학생 등록/삭제' },
  { href: '/template', label: '수업 템플릿', desc: '템플릿 생성 & 편집' },
]

const V2_TEACHER_PAGES = [
  { href: '/stats', label: '전체 관리 (전체 통계)', desc: '반별 현황 · 차트 · 집중 관리 학생' },
  { href: '/students/1', label: '학생별 대시보드 (예시: ID=1)', desc: '점수 추이 · 미완료 항목 · 수업 타임라인' },
  { href: '/ai-settings', label: 'AI 조교 설정', desc: '피드백 톤 · 기간 · 이모지 토글' },
  { href: '/attendance', label: '출결', desc: '코드 기반 자동 출결 (선생님 화면)' },
  { href: '/messages', label: '알림톡 / 문자', desc: '발송 · 커스텀 · 내역' },
]

const V2_PUBLIC_PAGES = [
  { href: '/parent/demo-token-123', label: '학부모 대시보드 (모바일)', desc: '이번 수업 · AI 피드백 · 미완료 · 이력' },
  { href: '/check/session-abc', label: '학생 출결 코드 입력 (모바일)', desc: '코드 입력으로 실시간 출결 반영' },
]

function PageGroup({ title, badge, pages }: {
  title: string
  badge?: string
  pages: { href: string; label: string; desc: string }[]
}) {
  return (
    <section style={{ marginBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: c.gray900, margin: 0 }}>{title}</h2>
        {badge && (
          <span style={{ background: c.primary500, color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        {pages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            style={{
              display: 'block', padding: '16px 18px', background: '#fff',
              borderRadius: 12, border: `1px solid ${c.gray75}`, textDecoration: 'none',
              transition: 'box-shadow 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(59,81,204,0.12)'; (e.currentTarget as HTMLElement).style.borderColor = c.primary300 }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.borderColor = c.gray75 }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: c.gray900, marginBottom: 4 }}>{page.label}</div>
            <div style={{ fontSize: 12, color: c.gray500 }}>{page.desc}</div>
            <div style={{ fontSize: 11, color: c.primary400, marginTop: 8 }}>{page.href}</div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default function V2IndexPage() {
  return (
    <div style={{ minHeight: '100vh', background: c.background, padding: '48px 32px', maxWidth: 1000, margin: '0 auto' }}>
      {/* 타이틀 */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: c.gray900, margin: 0 }}>CLAT v2</h1>
          <span style={{ background: c.primary50, color: c.primary500, borderRadius: 20, padding: '4px 14px', fontSize: 13, fontWeight: 700 }}>
            개발용 인덱스
          </span>
        </div>
        <p style={{ fontSize: 14, color: c.gray500, margin: 0 }}>
          모든 페이지가 mock 데이터로 구동됩니다. 실제 API 호출 없음.
        </p>
      </div>

      <PageGroup title="기존 페이지" pages={EXISTING_PAGES} />
      <PageGroup title="v2 신규 — 선생님" badge="NEW" pages={V2_TEACHER_PAGES} />
      <PageGroup title="v2 신규 — 학부모 / 학생 (로그인 없음)" badge="NEW" pages={V2_PUBLIC_PAGES} />
    </div>
  )
}
