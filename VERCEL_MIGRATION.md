# APU Bridge - Vercel Migration Guide

## Overview
This guide explains how to deploy the APU Bridge application to Vercel with proper database and storage configuration.

## Database Options for Vercel

### Option 1: Vercel Postgres (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Storage tab
3. Create a new Postgres database
4. Copy the connection string to use as `DATABASE_URL`

### Option 2: Neon (Serverless Postgres)
1. Sign up at [Neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Use it as `DATABASE_URL` in Vercel environment variables

### Option 3: Supabase
1. Create a project at [Supabase](https://supabase.com)
2. Go to Settings > Database
3. Copy the connection string under "Connection pooling"
4. Replace `[YOUR-PASSWORD]` with your actual password

## Environment Variables
Set these in your Vercel project settings:

```
DATABASE_URL=your_postgres_connection_string
NODE_ENV=production
SESSION_SECRET=your_secure_random_string
```

## File Storage Options

### Option 1: Vercel Blob (Recommended)
- Perfect for profile images and file uploads
- Easy integration with Vercel
- Automatic CDN distribution

### Option 2: Cloudinary
- Great for image processing and optimization
- Free tier available
- Advanced image transformations

### Option 3: AWS S3
- Scalable object storage
- Pay-as-you-use pricing
- Industry standard

## Deployment Steps

1. **Prepare the repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Vercel deployment"
   ```

2. **Connect to Vercel:**
   - Import your repository in Vercel Dashboard
   - Or use Vercel CLI: `npx vercel`

3. **Configure build settings:**
   - Build Command: `npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm install`

4. **Set environment variables in Vercel Dashboard**

5. **Deploy:**
   ```bash
   npx vercel --prod
   ```

## API Structure for Vercel

The application has been restructured for Vercel's serverless functions:

- `/api/auth/user.ts` - User authentication
- `/api/posts/index.ts` - Post management
- `/api/_lib/auth.ts` - Shared authentication utilities

## Key Changes Made

1. **Serverless API Routes:** Converted Express routes to Vercel functions
2. **Static Build:** Frontend builds to `client/dist` for static hosting
3. **Database Compatibility:** Maintained Drizzle ORM for database operations
4. **Authentication:** Simplified auth for serverless environment

## Testing Locally

```bash
# Install Vercel CLI
npm i -g vercel

# Run locally
vercel dev
```

## Production Considerations

1. **Database Connections:** Use connection pooling for serverless functions
2. **Cold Starts:** Implement proper caching strategies
3. **File Uploads:** Use multipart form handling for serverless
4. **Real-time Features:** Consider Vercel's WebSocket alternatives

## Cost Optimization

- Use Vercel's free tier for development
- Optimize bundle sizes
- Implement proper caching headers
- Monitor function execution times

## Next Steps

1. Choose your database provider
2. Set up environment variables
3. Deploy to Vercel
4. Configure custom domain (optional)
5. Set up monitoring and analytics