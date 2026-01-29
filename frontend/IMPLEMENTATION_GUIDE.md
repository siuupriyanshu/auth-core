# Multi-Tenant Authentication Frontend - Implementation Guide

This is a comprehensive Next.js 16 frontend application for a multi-tenant authentication system with JWT tokens, 2FA, OAuth, and RBAC.

## Project Structure

```
/app
  ├── page.tsx                 # Home page with features overview
  ├── layout.tsx              # Root layout with AuthProvider
  ├── login/page.tsx          # Login page
  ├── register/page.tsx       # Registration page
  ├── forgot-password/page.tsx # Password recovery
  ├── reset-password/page.tsx # Password reset
  ├── verify-email/page.tsx   # Email verification
  ├── dashboard/
  │   └── page.tsx            # Protected user dashboard
  ├── admin/
  │   └── page.tsx            # Protected admin panel
  ├── settings/
  │   ├── profile/page.tsx    # Profile settings
  │   ├── password/page.tsx   # Password change
  │   ├── sessions/page.tsx   # Session management
  │   └── security/page.tsx   # 2FA setup
  └── oauth/
      ├── google/
      │   ├── page.tsx        # Google OAuth initiator
      │   └── callback/page.tsx
      └── github/
          ├── page.tsx        # GitHub OAuth initiator
          └── callback/page.tsx

/components
  ├── auth/
  │   ├── register-form.tsx
  │   ├── login-form.tsx
  │   ├── forgot-password-form.tsx
  │   ├── reset-password-form.tsx
  │   ├── two-factor-setup.tsx
  │   ├── two-factor-login.tsx
  │   └── oauth-callback-handler.tsx
  ├── dashboard/
  │   ├── header.tsx
  │   └── dashboard-content.tsx
  └── ui/
      └── (shadcn components)

/lib
  ├── auth-context.tsx        # Auth state management
  ├── api-client.ts           # API client utilities
  ├── protected-route.tsx     # Route protection wrapper
  └── validation.ts           # Zod schemas for forms
```

## Features Implemented

### 1. User Authentication
- **Registration**: Email, password, and tenant ID
- **Login**: Email/password authentication with JWT
- **Email Verification**: Secure verification tokens with time limits
- **Password Recovery**: 
  - Forgot password with email link
  - Reset password with token validation

### 2. Two-Factor Authentication (2FA)
- **Setup**: Display QR code and backup secret
- **Verification**: 6-digit TOTP code validation
- **Management**: Enable/disable 2FA from settings

### 3. Social Login (OAuth 2.0)
- **Google OAuth**: Redirect to Google, handle callback
- **GitHub OAuth**: Redirect to GitHub, handle callback
- **Token Exchange**: Automatic token exchange and login

### 4. Multi-Tenancy
- **Tenant Selection**: During registration
- **Tenant-Specific Routes**: Subdomain-based routing support
- **Tenant Context**: User tenantId in JWT claims

### 5. Role-Based Access Control (RBAC)
- **Role Management**: admin, user, guest roles
- **Permission Checking**: Client-side permission validation
- **Protected Routes**: Route guards based on roles/permissions
- **Admin Panel**: Exclusive admin features

### 6. Session Management
- **JWT Tokens**: Secure token storage in localStorage
- **Token Refresh**: Automatic token refresh on expiration
- **Session Tracking**: View active sessions
- **Logout**: Clear tokens and redirect

### 7. Security Features
- **Password Validation**: Strength requirements (8+ chars, uppercase, number, special char)
- **HTTPS in Production**: Enforced via environment config
- **Secure Token Storage**: HTTP-only cookies (via API)
- **CORS Support**: Configured for multi-tenant domains

## Environment Configuration

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AuthHub
```

## API Integration

This frontend expects a Node.js/Express backend with these endpoints:

### Authentication
- `POST /api/register` - Create new account
- `POST /api/login` - Authenticate user
- `POST /api/refresh-token` - Refresh JWT token
- `POST /api/verify-email` - Verify email address
- `POST /api/forgot-password` - Request password reset
- `POST /api/reset-password` - Reset password with token
- `POST /api/change-password` - Change password for authenticated user

### Two-Factor Authentication
- `POST /api/2fa/setup` - Generate QR code and secret
- `POST /api/2fa/verify` - Verify TOTP code
- `POST /api/2fa/disable` - Disable 2FA

### OAuth
- `POST /api/oauth/google/auth-url` - Get Google OAuth URL
- `POST /api/oauth/google/callback` - Handle Google callback
- `POST /api/oauth/github/auth-url` - Get GitHub OAuth URL
- `POST /api/oauth/github/callback` - Handle GitHub callback

### User Profile
- `GET /api/user` - Get current user info
- `PUT /api/profile` - Update profile
- `GET /api/sessions` - List active sessions
- `POST /api/sessions/:id/revoke` - Revoke session

## Authentication Flow

### Registration
1. User fills registration form (email, password, tenant ID)
2. Form validation with Zod schemas
3. API call to `/api/register`
4. JWT token received and stored in localStorage
5. Redirect to email verification page

### Login
1. User enters email and password
2. API call to `/api/login`
3. Check if 2FA is required
4. If 2FA enabled: Show verification prompt
5. After verification: Store token and redirect to dashboard

### Protected Routes
1. `useAuth()` hook checks for valid token
2. If no token or expired: Redirect to login
3. `ProtectedRoute` component enforces role/permission checks
4. Admin-only routes check for "admin" role

## JWT Token Structure

Expected JWT claims (decoded):

```json
{
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "role": "admin",
    "permissions": ["read", "write", "delete"],
    "tenantId": "my-company",
    "verified": true,
    "mfaEnabled": true
  },
  "exp": 1234567890,
  "iat": 1234567890
}
```

## Running the Application

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your backend URL
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Access the app:**
   - Open http://localhost:3000
   - Register a new account
   - Complete email verification
   - Set up 2FA
   - Access the dashboard

## Key Components

### AuthContext (`/lib/auth-context.tsx`)
Provides authentication state and methods:
- `user`: Current user object
- `token`: JWT token
- `isAuthenticated`: Boolean auth status
- `login(token)`: Set token and user
- `logout()`: Clear auth state
- `hasRole()`: Check user role
- `hasPermission()`: Check user permission

### APIClient (`/lib/api-client.ts`)
Makes authenticated API calls:
- Automatically adds Authorization header
- Handles token refresh
- Provides type-safe methods (get, post, put, patch, delete)
- Custom error handling with APIError

### ProtectedRoute (`/lib/protected-route.tsx`)
Guards pages with authentication:
- Redirects unauthenticated users to login
- Checks roles and permissions
- Shows access denied message
- Customizable fallback component

### Validation Schemas (`/lib/validation.ts`)
Zod schemas for all forms:
- Email validation
- Password strength requirements
- Registration form validation
- 2FA code validation
- And more...

## Customization

### Adding New Permissions
1. Update JWT claims in backend
2. Add permission checks in components:
   ```tsx
   {user?.permissions.includes('admin_panel') && (
     <AdminLink />
   )}
   ```

### Custom OAuth Providers
1. Add provider in `oauth-callback-handler.tsx`
2. Create initiation page in `/app/oauth/[provider]/page.tsx`
3. Add API methods to `authAPI` object

### Styling
- Uses Tailwind CSS v4 with design tokens
- Customize colors in `/app/globals.css`
- All components use semantic design tokens
- Responsive design with mobile-first approach

## Security Considerations

1. **Token Storage**: Currently uses localStorage (consider HTTP-only cookies via API)
2. **CORS**: Configure backend to accept your frontend domain
3. **HTTPS**: Always use HTTPS in production
4. **Token Expiration**: Set reasonable expiration times (30 min - 24 hours)
5. **Refresh Tokens**: Implement refresh token rotation in backend
6. **Password Requirements**: Enforce strong passwords (8+ chars, mixed case, numbers, symbols)
7. **Rate Limiting**: Implement rate limiting on backend for login attempts
8. **CSRF Protection**: Add CSRF tokens for state-changing requests

## Backend Setup Recommendations

### Node.js/Express Server
```javascript
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
```

## Testing

The application includes form validation and error handling. Test scenarios:

1. **Happy Path**: Register → Verify Email → Login → Dashboard
2. **OAuth Login**: Click social login → Authenticate → Dashboard
3. **2FA Setup**: Enable 2FA in settings → Verify code
4. **Role Check**: Try accessing admin page as regular user (should see denied message)
5. **Password Reset**: Forgot password → Verify email → Reset
6. **Session Expiry**: Wait for token to expire → Should redirect to login

## Troubleshooting

**API Connection Issues:**
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify backend is running
- Check CORS configuration on backend

**2FA QR Code Not Displaying:**
- Ensure backend returns valid base64-encoded QR code
- Check browser console for errors

**Redirect Loops:**
- Clear localStorage and cookies
- Check token expiration time
- Verify AuthProvider is in root layout

**OAuth Errors:**
- Verify OAuth client IDs are correct
- Check redirect URIs match backend config
- Ensure backend has OAuth provider credentials

## Next Steps

1. Set up your backend API with the required endpoints
2. Configure environment variables
3. Deploy to production (Vercel recommended)
4. Set up custom domain with SSL
5. Configure OAuth provider credentials
6. Enable email verification service (SendGrid, Mailgun, etc.)
7. Set up 2FA backup codes storage
8. Implement session management backend
9. Add audit logging for security events
10. Set up monitoring and error tracking

## Support

For issues or questions:
1. Check this implementation guide
2. Review the code comments
3. Verify backend API responses
4. Check browser console for errors
5. Look at network requests in DevTools
