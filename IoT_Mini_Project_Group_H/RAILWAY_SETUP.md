# Deploy Prediction Model to Railway

## Quick Setup

### 1. Create Railway Account
- Go to https://railway.app
- Sign up with GitHub

### 2. Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository

### 3. Set Root Directory
**IMPORTANT:** Railway needs to know where your code is.

In Railway Dashboard:
1. Go to Settings
2. Find "Root Directory"
3. Set to: `IoT_Mini_Project_Group_H`
4. Click "Save"

### 4. Configure Environment Variables
Add in Railway dashboard:
```
NEXT_PUBLIC_SUPABASE_URL=https://qelqxewrbxeurmhvsgdm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlbHF4ZXdyYnhldXJtaHZzZ2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MjQ2MTQsImV4cCI6MjA3NDMwMDYxNH0.ZrxUJH5n4CjqSxzeHuD0nUaCQ2hcMDxSIn5w3qqsNRI
```

### 5. Deploy
Railway auto-detects `Procfile` and deploys

### 6. Get Railway URL
- Go to Settings → Networking
- Click "Generate Domain"
- Copy URL (e.g., `https://your-app.railway.app`)

### 7. Update Vercel
Add environment variable in Vercel:
```
PREDICTION_API_URL=https://your-app.railway.app
```

### 8. Test
Click "Run Prediction" on your Vercel site - it should work!
Update `/app/api/run-prediction/route.js`:

```javascript
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const apiUrl = process.env.PREDICTION_API_URL;
    
    if (!apiUrl) {
      return NextResponse.json({ 
        success: false, 
        error: 'Prediction service not configured' 
      }, { status: 500 });
    }
    
    const response = await fetch(`${apiUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Prediction failed');
    }

    const result = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Prediction completed',
      data: result.data
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
```

## Architecture

```
User clicks "Run Prediction"
    ↓
Vercel (/api/run-prediction)
    ↓
Railway (run_prediction_api.py)
    ↓
Runs prediction_model.py
    ↓
Returns JSON
    ↓
Display results
```

## Files
- `run_prediction_api.py` - Flask wrapper
- `requirements-api.txt` - Dependencies
- `Procfile` - Railway start command

## Test
```bash
curl -X POST https://your-app.railway.app/predict
```

## Cost
- Railway: $5 credit/month (free)
- Usage: ~$1-2/month
