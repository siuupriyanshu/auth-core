export interface User {
  id: string
  email: string
  roles: string[]
  permissions: string[]
  createdAt: string
  emailVerified: boolean
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  oauthLogin: (provider: 'google' | 'github') => Promise<void>
  verifyEmail: (token: string, email: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
  submitOtp: (otp: string) => Promise<void>
  clearError: () => void
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
