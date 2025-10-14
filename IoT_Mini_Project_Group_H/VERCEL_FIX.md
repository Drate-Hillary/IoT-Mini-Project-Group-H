# Fix Vercel Deployment Error

## Problem
"Failed to fetch: Internal Server Error" - This means Vercel can't connect to Supabase.

## Solution: Add Environment Variables to Vercel

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com/dashboard
2. Click on your project
3. Click "Settings" tab
4. Click "Environment Variables" in sidebar

### Step 2: Add These Variables

Add each of these (click "Add" after each one):

**Variable 1:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://qelqxewrbxeurmhvsgdm.supabase.co
Environment: Production, Preview, Development (check all)
```

**Variable 2:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlbHF4ZXdyYnhldXJtaHZzZ2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MjQ2MTQsImV4cCI6MjA3NDMwMDYxNH0.ZrxUJH5n4CjqSxzeHuD0nUaCQ2hcMDxSIn5w3qqsNRI
Environment: Production, Preview, Development (check all)
```

### Step 3: Redeploy
1. Go to "Deployments" tab
2. Click the three dots (...) on latest deployment
3. Click "Redeploy"
4. Wait 1-2 minutes

### Step 4: Test
Visit your site and check if data loads.

---

## Alternative: Via Vercel CLI

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste: https://qelqxewrbxeurmhvsgdm.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlbHF4ZXdyYnhldXJtaHZzZ2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MjQ2MTQsImV4cCI6MjA3NDMwMDYxNH0.ZrxUJH5n4CjqSxzeHuD0nUaCQ2hcMDxSIn5w3qqsNRI

vercel --prod
```

---

## Verify Environment Variables

After redeploying, check if variables are set:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. You should see both variables listed
3. They should be enabled for all environments

---

## Still Not Working?

Check browser console (F12) for specific error messages and verify:
- Supabase project is active
- Database table `sensor_data` exists
- API keys are correct
