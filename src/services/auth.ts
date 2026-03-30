import { useUserStore } from '@/stores/userStore'

interface LoginRequest {
  email: string
  password: string
}

interface AuthTokens {
  access_token: string
  refresh_token: string
}

interface LoginResponse {
  success: boolean
  data: AuthTokens & {
    user: {
      id: number
      email: string
      name: string
      created_at: string
    }
  }
}

interface RefreshResponse {
  success: boolean
  data: AuthTokens
}

interface MeResponse {
  success: boolean
  data: {
    id: number
    email: string
    name: string
    created_at: string
  }
}

const MOCK_USER = {
  id: 1,
  email: 'teacher@clat.com',
  name: '김선생',
  created_at: '2026-01-01T00:00:00Z',
}

export const auth = {
  async login(_req: LoginRequest) {
    useUserStore.getState().setUser(MOCK_USER)
    return MOCK_USER
  },

  async logout() {
    useUserStore.getState().setUser(null)
    if (typeof window !== 'undefined') window.location.href = '/login'
  },

  async refresh() {
    return 'mock-access-token'
  },

  async me() {
    return MOCK_USER
  },
}

export const setTokens = (_a: string, _b: string) => {}
export const clearTokens = () => {}
