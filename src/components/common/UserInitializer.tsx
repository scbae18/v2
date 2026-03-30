'use client'

import { useEffect } from 'react'
import { useUserStore } from '@/stores/userStore'

const MOCK_USER = {
  id: 1,
  email: 'teacher@clat.com',
  name: '김선생',
  created_at: '2026-01-01T00:00:00Z',
}

export default function UserInitializer() {
  const setUser = useUserStore((s) => s.setUser)

  useEffect(() => {
    setUser(MOCK_USER)
  }, [setUser])

  return null
}
