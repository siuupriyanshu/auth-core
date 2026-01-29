const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class APIClient {
  private static getAuthHeader(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = { ...this.getAuthHeader(), ...options.headers };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new APIError(error.message, response.status, error);
    }

    return response.json();
  }

  static get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static post<T>(endpoint: string, data?: Record<string, any>) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  }

  static put<T>(endpoint: string, data?: Record<string, any>) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data || {}),
    });
  }

  static patch<T>(endpoint: string, data?: Record<string, any>) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data || {}),
    });
  }

  static delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export class APIError extends Error {
  constructor(
    public message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Auth API endpoints
export const authAPI = {
  register: (email: string, password: string, tenantId: string) =>
    APIClient.post<{ token: string }>('/register', { email, password, tenantId }),

  login: (email: string, password: string) =>
    APIClient.post<{ token: string }>('/login', { email, password }),

  verifyEmail: (token: string) =>
    APIClient.post('/verify-email', { token }),

  forgotPassword: (email: string) =>
    APIClient.post('/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    APIClient.post('/reset-password', { token, newPassword }),

  setupTwoFactor: () =>
    APIClient.post<{ qrCode: string; secret: string }>('/2fa/setup'),

  verifyTwoFactor: (code: string) =>
    APIClient.post<{ verified: boolean }>('/2fa/verify', { code }),

  disableTwoFactor: () =>
    APIClient.post('/2fa/disable'),

  refreshToken: () =>
    APIClient.post<{ token: string }>('/refresh-token'),

  getUser: () =>
    APIClient.get<{ user: any }>('/user'),

  updateProfile: (data: Record<string, any>) =>
    APIClient.put('/profile', data),

  changePassword: (currentPassword: string, newPassword: string) =>
    APIClient.post('/change-password', { currentPassword, newPassword }),

  // OAuth endpoints
  getGoogleAuthUrl: (tenantId?: string) =>
    APIClient.post<{ authUrl: string }>('/oauth/google/auth-url', { tenantId }),

  handleGoogleCallback: (code: string) =>
    APIClient.post<{ token: string }>('/oauth/google/callback', { code }),

  getGithubAuthUrl: (tenantId?: string) =>
    APIClient.post<{ authUrl: string }>('/oauth/github/auth-url', { tenantId }),

  handleGithubCallback: (code: string) =>
    APIClient.post<{ token: string }>('/oauth/github/callback', { code }),
};
