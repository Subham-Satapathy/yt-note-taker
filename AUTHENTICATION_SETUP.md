# YT Note Maker - Authentication Setup Guide

## 🔐 Authentication is now enabled!

To use the application, you need to configure authentication. Follow these steps:

## Quick Start (5 minutes)

### 1. Generate NextAuth Secret

Run this command in your terminal:

```bash
openssl rand -base64 32
```

Copy the output and add it to your `.env.local` file as `NEXTAUTH_SECRET`

### 2. Option A: Use Email/Password Only (Easiest)

If you want to skip Google OAuth for now, you can use email/password authentication:

1. Update `.env.local`:
```env
NEXTAUTH_SECRET=your-generated-secret-from-step-1
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=file:./dev.db
```

2. You can leave Google OAuth vars as placeholders for now
3. Users can sign up with email/password at `/auth/signup`

### 3. Option B: Add Google OAuth (Recommended for Production)

#### Step-by-step Google OAuth Setup:

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click "Select a project" → "New Project"
   - Name it "YT Note Maker" (or your preferred name)
   - Click "Create"

3. **Enable Google+ API**
   - In the search bar, type "Google+ API"
   - Click on it and press "Enable"

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure the OAuth consent screen:
     - User Type: External
     - App name: YT Note Maker
     - User support email: your email
     - Developer contact: your email
     - Save and continue through the scopes (no scopes needed)
     - Add test users if in testing mode

5. **Configure OAuth Client**
   - Application type: Web application
   - Name: YT Note Maker
   - Authorized redirect URIs:
     - Add: `http://localhost:3000/api/auth/callback/google`
   - Click "Create"

6. **Copy Credentials**
   - Copy the Client ID and Client Secret
   - Add them to your `.env.local`:

```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Test Authentication

1. Go to http://localhost:3000
2. Click "Sign Up" in the top right
3. Create an account using:
   - Email/Password, OR
   - Google OAuth (if configured)

## Environment Variables Reference

Your complete `.env.local` should look like:

```env
# OpenAI (already configured)
OPENAI_API_KEY=your-existing-key

# NextAuth (required)
NEXTAUTH_SECRET=your-32-char-random-secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional for dev, recommended for prod)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database (already configured)
DATABASE_URL=file:./dev.db
```

## Security Features Implemented

✅ **Authentication**
- Google OAuth 2.0
- Email/Password with bcrypt hashing
- JWT session management

✅ **API Protection**
- All API routes require authentication
- Rate limiting: 10 requests/hour per user
- Middleware-level security

✅ **Database Security**
- Prisma ORM (SQL injection protection)
- Password hashing with bcrypt
- Session token encryption

## Troubleshooting

### "Unauthorized" error
- Make sure you're signed in
- Check that NEXTAUTH_SECRET is set
- Verify DATABASE_URL is correct

### Google OAuth not working
- Verify redirect URI matches exactly
- Check OAuth consent screen is configured
- Ensure Google+ API is enabled
- Client ID/Secret are correct in .env.local

### Rate limit exceeded
- Default limit: 10 requests/hour
- Adjust in `lib/rate-limit.ts` if needed
- Rate limits reset automatically

## Production Deployment

When deploying to production:

1. Generate a new NEXTAUTH_SECRET
2. Update NEXTAUTH_URL to your production domain
3. Add production redirect URI to Google OAuth:
   `https://yourdomain.com/api/auth/callback/google`
4. Use PostgreSQL instead of SQLite
5. Set all environment variables in hosting platform

## Need Help?

- NextAuth.js Docs: https://authjs.dev/
- Google OAuth Guide: https://developers.google.com/identity/protocols/oauth2
- Prisma Docs: https://www.prisma.io/docs
