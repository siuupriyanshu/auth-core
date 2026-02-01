export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  logout: `${API_BASE_URL}/auth/logout`,
  me: `${API_BASE_URL}/auth/me`,
  verifyEmail: `${API_BASE_URL}/auth/verify-email`,
  forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
  resetPassword: `${API_BASE_URL}/auth/reset-password`,
  oauthGoogle: `${API_BASE_URL}/auth/oauth/google`,
  oauthGithub: `${API_BASE_URL}/auth/oauth/github`,
  submitOtp: `${API_BASE_URL}/auth/2fa/submit`,
}
