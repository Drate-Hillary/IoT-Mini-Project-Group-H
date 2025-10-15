i# Deploy Sensor Scripts to Railway

## Setup Multiple Services on Railway

You'll create **3 separate Railway services**:
1. Prediction API (already running)
2. Sensor Data Collector (new)
3. Database Monitor (new)

---

## Service 1: Prediction API (Already Done)
- Uses: `Procfile` (web: python run_prediction_api.py)
- Status: ✅ Running

---

## Service 2: Sensor Data Collector

### Create New Service
1. Go to Railway dashboard
2. Click "New" → "Empty Service"
3. Name it: `sensor-collector`
4. Connect to same GitHub repo
5. Set Root Directory: `IoT_Mini_Project_Group_H`

### Configure
**Settings → Start Command:**
```
python sensor_data/sensor/temp_humidity_motion_sensor_data_lora.py
```

**Environment Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=https://qelqxewrbxeurmhvsgdm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlbHF4ZXdyYnhldXJtaHZzZ2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MjQ2MTQsImV4cCI6MjA3NDMwMDYxNH0.ZrxUJH5n4CjqSxzeHuD0nUaCQ2hcMDxSIn5w3qqsNRI
```

### Deploy
- Railway auto-deploys
- Check logs for "Connected to TTN MQTT broker!"

---

## Service 3: Database Monitor

### Create New Service
1. Railway dashboard → "New" → "Empty Service"
2. Name it: `database-monitor`
3. Connect to same GitHub repo
4. Set Root Directory: `IoT_Mini_Project_Group_H`

### Configure
**Settings → Start Command:**
```
python sensor_data/sensor/fetch_supabase_data.py
```

**Environment Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=https://qelqxewrbxeurmhvsgdm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlbHF4ZXdyYnhldXJtaHZzZ2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MjQ2MTQsImV4cCI6MjA3NDMwMDYxNH0.ZrxUJH5n4CjqSxzeHuD0nUaCQ2hcMDxSIn5w3qqsNRI
SUPABASE_URL=https://qelqxewrbxeurmhvsgdm.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlbHF4ZXdyYnhldXJtaHZzZ2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MjQ2MTQsImV4cCI6MjA3NDMwMDYxNH0.ZrxUJH5n4CjqSxzeHuD0nUaCQ2hcMDxSIn5w3qqsNRI
```

### Deploy
- Railway auto-deploys
- Check logs for "Monitoring database for updates..."

---

## Final Architecture

```
IoT Sensor → TTN
    ↓
Railway Service 2 (sensor-collector)
    ↓
Supabase Database
    ↓
Railway Service 3 (database-monitor) - monitors changes
    ↓
Vercel Frontend - displays data
    ↓
Railway Service 1 (prediction-api) - runs predictions
```

---

## Cost

**Railway Free Tier:**
- $5 credit/month
- 3 services running 24/7 ≈ $3-4/month
- Still within free tier!

---

## Benefits

✅ All Python scripts run in cloud
✅ No need to keep local machine running
✅ Automatic restarts if crashes
✅ Centralized logging
✅ Easy to scale

---

## Verify All Services

1. **Prediction API**: Visit `/predict` endpoint
2. **Sensor Collector**: Check logs for MQTT messages
3. **Database Monitor**: Check logs for data updates
4. **Vercel Frontend**: Should show real-time data

---

## Alternative: Single Service with Multiple Workers

If you want to save resources, you can run all in one service using `Procfile.sensor`:

**Procfile:**
```
web: python run_prediction_api.py
sensor: python sensor_data/sensor/temp_humidity_motion_sensor_data_lora.py
monitor: python sensor_data/sensor/fetch_supabase_data.py
```

But Railway free tier only runs `web` process. For multiple workers, you need separate services.

---

## Recommended Setup

**3 Separate Services** (easier to manage and monitor)
- Service 1: Prediction API (web)
- Service 2: Sensor Collector (worker)
- Service 3: Database Monitor (worker)

This way each service has its own logs and can be restarted independently.
