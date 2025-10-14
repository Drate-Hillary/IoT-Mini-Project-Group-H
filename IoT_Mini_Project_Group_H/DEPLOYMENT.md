# Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Supabase account with your database set up

## Step 1: Push to GitHub
1. Initialize git repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Create a new repository on GitHub
3. Push your code:
   ```bash
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

## Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./` (or leave default)
   - Build Command: `npm run build`
   - Output Directory: `.next`

## Step 3: Add Environment Variables
In Vercel project settings, add these environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon/public key

## Step 4: Deploy
Click "Deploy" and wait for the build to complete.

## Important Notes

### Python Scripts
The Python scripts (`temp_humidity_motion_sensor_data_lora.py`, `prediction_model.py`) **cannot run on Vercel** because:
- Vercel is serverless and doesn't support long-running processes
- Python dependencies won't be installed in the Next.js build

### Solutions for Python Scripts:
1. **Run locally**: Keep Python scripts running on your local machine or a server
2. **Use a separate service**: Deploy Python scripts to:
   - Railway.app
   - Render.com
   - AWS Lambda
   - Google Cloud Functions
3. **Schedule with cron jobs**: Use services like GitHub Actions or Vercel Cron to trigger Python scripts periodically

### What Works on Vercel:
✅ Next.js frontend
✅ API routes (JavaScript/TypeScript)
✅ Reading from Supabase
✅ All React components and charts

### What Doesn't Work on Vercel:
❌ Python sensor data collection script
❌ Python prediction model script
❌ Long-running background processes

## Recommended Architecture:
1. **Vercel**: Host Next.js dashboard (frontend + API routes)
2. **Local/Server**: Run Python scripts for sensor data collection
3. **Supabase**: Central database for both to read/write data

This way, your dashboard on Vercel reads from Supabase, while your Python scripts (running elsewhere) write to Supabase.
