'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { User, AuthContextType, ApiResponse } from './types'
import { API_ENDPOINTS } from './auth-config'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Token storage key
const TOKEN_STORAGE_KEY = 'auth_token'

// Token management utilities
const tokenStorage = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  },
  set: (token: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
  },
  remove: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  },
}

// Helper to create headers with Authorization
const getAuthHeaders = (includeContentType = true): HeadersInit => {
  const headers: HeadersInit = {}
  const token = tokenStorage.get()

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (includeContentType) {
    headers['Content-Type'] = 'application/json'
  }

  return headers
}

// Response type that includes token
interface AuthResponse {
  user: User
  token: string
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch current user on mount using stored token
  useEffect(() => {
    const fetchUser = async () => {
      const token = tokenStorage.get()

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(API_ENDPOINTS.me, {
          method: 'GET',
          headers: getAuthHeaders(false),
        })

        if (response.ok) {
          const data: ApiResponse<User> = await response.json()
          if (data.success && data.data) {
            setUser(data.data)
          } else {
            // Token might be invalid, clear it
            tokenStorage.remove()
          }
        } else if (response.status === 401) {
          // Token expired or invalid
          tokenStorage.remove()
          setUser(null)
        }
      } catch (err) {
        console.error('Failed to fetch user:', err)
        // On network error, don't clear token (might be temporary)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setError(null)
    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      if (data.data) {
        const { user, token } = data.data as AuthResponse
        tokenStorage.set(token);
        if (typeof document !== 'undefined') {
          document.cookie = `auth-token=${token}; path=/;`
        }
        setUser(user);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      throw err
    }
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    setError(null)
    try {
      const response = await fetch(API_ENDPOINTS.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword: password }),
      })

      const data = await response.json()

      if (!response.ok || data.success === false) {
        throw new Error(data.error ?? data.message ?? 'Registration failed')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message)
      throw err
    }
  }, [])

  const logout = useCallback(async () => {
    setError(null)
    try {
      const token = tokenStorage.get()

      // Optionally notify backend (for token blacklisting if implemented)
      if (token) {
        await fetch(API_ENDPOINTS.logout, {
          method: 'POST',
          headers: getAuthHeaders(),
        }).catch(() => {
          // Ignore errors - we're logging out anyway
        })
      }

      // Always clear local state
      tokenStorage.remove()
      setUser(null)
    } catch (err) {
      // Even on error, clear local state
      tokenStorage.remove()
      setUser(null)
      const message = err instanceof Error ? err.message : 'Logout failed'
      setError(message)
      throw err
    }
  }, [])

  const oauthLogin = useCallback(async (provider: 'google' | 'github') => {
    setError(null)
    try {
      const endpoint = provider === 'google' ? API_ENDPOINTS.oauthGoogle : API_ENDPOINTS.oauthGithub
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data: ApiResponse<{ redirectUrl: string; token?: string }> = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `${provider} login failed`)
      }

      // If token is returned directly (some OAuth flows)
      if (data.data?.token) {
        tokenStorage.set(data.data.token)
      }

      if (data.data?.redirectUrl) {
        window.location.href = data.data.redirectUrl
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : `${provider} login failed`
      setError(message)
      throw err
    }
  }, [])

  const verifyEmail = useCallback(async (token: string, email: string) => {
    setError(null)
    try {
      const response = await fetch(API_ENDPOINTS.verifyEmail, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email }),
      })

      const data: ApiResponse<AuthResponse> = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Email verification failed')
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Email verification failed'
      setError(message)
      throw err
    }
  }, [])

  const forgotPassword = useCallback(async (email: string) => {
    setError(null)
    try {
      const response = await fetch(API_ENDPOINTS.forgotPassword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data: ApiResponse<unknown> = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Request failed')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Forgot password request failed'
      setError(message)
      throw err
    }
  }, [])

  const resetPassword = useCallback(async (token: string, password: string) => {
    setError(null)
    try {
      const response = await fetch(API_ENDPOINTS.resetPassword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data: ApiResponse<unknown> = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Reset failed')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset failed'
      setError(message)
      throw err
    }
  }, [])

  const submitOtp = useCallback(async (otp: string) => {
    setError(null)
    try {
      const response = await fetch(API_ENDPOINTS.submitOtp, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ otp }),
      })

      const data: ApiResponse<AuthResponse> = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '2FA verification failed')
      }

      if (data.data) {
        tokenStorage.set(data.data.token)
        setUser(data.data.user)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '2FA verification failed'
      setError(message)
      throw err
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        oauthLogin,
        verifyEmail,
        forgotPassword,
        resetPassword,
        submitOtp,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Export token utilities for use in other parts of the app (e.g., API clients)
export { tokenStorage, getAuthHeaders }
