# API Configuration Guide

This project uses a centralized API configuration system to manage different backend services for each project.

## Setup

### 1. Create `.env.local` file

Create a `.env.local` file in the `portfolio` root directory (same level as `package.json`):

```env
# Inflation Tracker Backend (runs on port 8002)
NEXT_PUBLIC_INFLATION_API_URL=http://localhost:8002

# Sentiment Analysis Backend (runs on port 8000)
NEXT_PUBLIC_SENTIMENT_API_URL=http://localhost:8000
```

### 2. Restart your dev server

After creating or updating `.env.local`, restart your Next.js dev server:

```bash
npm run dev
```

## How It Works

- **Centralized Config**: All API URLs are managed in `/lib/api-config.ts`
- **Project-Specific**: Each project uses its own environment variable
- **No Conflicts**: Projects don't interfere with each other's API URLs
- **Easy Deployment**: Change production URLs in one place

## Adding New Projects

When adding a new project:

1. Add the API URL to `/lib/api-config.ts`:
   ```typescript
   export const NEW_PROJECT_API_URL = 
     process.env.NEXT_PUBLIC_NEW_PROJECT_API_URL || 
     process.env.NODE_ENV === 'production' 
       ? 'https://new-api.yourdomain.com'
       : 'http://localhost:8003';
   ```

2. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_NEW_PROJECT_API_URL=http://localhost:8003
   ```

3. Use in your project:
   ```typescript
   import { getApiUrl } from '@/lib/api-config';
   const API_BASE_URL = getApiUrl('new-project');
   ```

## Production Deployment

For production, set environment variables in your hosting platform:

- **Vercel**: Settings → Environment Variables
- **Netlify**: Site settings → Environment variables
- **Other platforms**: Set in their respective environment variable settings

Production URLs should use HTTPS:
```env
NEXT_PUBLIC_INFLATION_API_URL=https://inflation-api.yourdomain.com
NEXT_PUBLIC_SENTIMENT_API_URL=https://sentiment-api.yourdomain.com
```

## Troubleshooting

### Port conflicts
- Each project should use a different port
- Check which ports are in use: `netstat -ano | findstr :8000`

### Environment variables not updating
- Restart your dev server after changing `.env.local`
- Clear Next.js cache: `rm -rf .next`
- Make sure variable names start with `NEXT_PUBLIC_` for browser access

### Debugging
Check the console for API URL logs:
- `🔧 INFLATION API URL: http://localhost:8002`
- `🔧 SENTIMENT API URL: http://localhost:8000`


