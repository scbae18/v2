import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// v2 mock 모드: 인증 없이 모든 경로 접근 허용
export function proxy(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
