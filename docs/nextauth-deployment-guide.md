# NextAuth Deployment Guide

## Overview

This guide explains how to properly configure NextAuth.js for deployment to ensure authentication works correctly in production environments.

## Key Changes Made

1. **Added SessionProvider**: 
   - Created `AuthProvider` component that wraps the application with NextAuth's `SessionProvider`
   - Updated the root layout to include this provider

2. **Environment Configuration**:
   - Added `.env.production` file with deployment-specific settings
   - Added comments to clarify the purpose of `NEXTAUTH_URL`

## Deployment Checklist

### 1. Set Correct NEXTAUTH_URL

In your deployment environment, make sure to set the `NEXTAUTH_URL` to your actual deployed domain:

```
NEXTAUTH_URL=https://your-actual-domain.com
```

This is critical for NextAuth callbacks to work properly. Without this, authentication redirects will fail.

### 2. Configure OAuth Callback URLs

For each OAuth provider (Google, GitHub, LinkedIn), update their developer console settings to include your production callback URL:

```
https://your-actual-domain.com/api/auth/callback/google
https://your-actual-domain.com/api/auth/callback/github
https://your-actual-domain.com/api/auth/callback/linkedin
```

### 3. Verify Environment Variables

Ensure all required environment variables are properly set in your deployment platform:

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- OAuth provider credentials
- Contract addresses

### 4. Testing After Deployment

After deploying, test the authentication flow:

1. Try signing up with email
2. Try signing in with OAuth providers
3. Verify session persistence
4. Test protected routes

## Troubleshooting

### Common Issues

1. **Redirect Errors**: Usually caused by incorrect `NEXTAUTH_URL` or OAuth callback URLs
2. **Session Not Persisting**: Check that `SessionProvider` is properly wrapping the application
3. **OAuth Provider Errors**: Verify provider credentials and authorized domains

### Debugging

To enable debug logs, set:

```
NEXTAUTH_DEBUG=true
```

This will output detailed NextAuth logs to help identify issues.

## Additional Resources

- [NextAuth.js Deployment Documentation](https://next-auth.js.org/deployment)
- [NextAuth.js Environment Variables](https://next-auth.js.org/configuration/options#environment-variables)