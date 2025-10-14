# IoT Temperature Prediction System - Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Features](#features)
5. [Installation & Setup](#installation--setup)
6. [System Components](#system-components)
7. [Python Scripts](#python-scripts)
8. [API Endpoints](#api-endpoints)
9. [Machine Learning Model](#machine-learning-model)
10. [Data Flow](#data-flow)
11. [User Guide](#user-guide)
12. [Troubleshooting](#troubleshooting)

---

## System Overview

The IoT Temperature Prediction System is a full-stack web application that collects, visualizes, and predicts temperature data from IoT sensors. The system uses machine learning (Ridge/Lasso regression) to forecast future temperature readings with high accuracy.

### Key Capabilities
- Real-time sensor data collection via LoRa/TTN
- Automatic data synchronization to ThingSpeak and Supabase
- Real-time sensor data visualization
- Temperature prediction using ML models
- Historical data analysis
- Downloadable reports (PDF/PNG)
- Responsive design for all devices

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  IoT Sensor (LoRa Device)                    │
│              lht65n-01-temp-humidity-sensor                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              The Things Network (TTN) Gateway                │
│                  eu1.cloud.thethings.network                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│         Python Data Collection Script (MQTT Client)          │
│       temp_humidity_motion_sensor_data_lora.py               │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┼───────────┐
                ↓           ↓           ↓
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ThingSpeak│  │ Supabase │  │CSV Files │
        └──────────┘  └──────────┘  └──────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 15)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │   Charts     │  │  Predictor   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (Next.js API)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Sensor Data  │  │  Prediction  │  │   Reports    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
                  ┌──────────────────────┐
                  │  Python ML Model     │
                  │  Ridge Regression    │
                  └──────────────────────┘
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15.5.4 (React 19)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: React Icons, Lucide React
- **Notifications**: Sonner
- **Theme**: next-themes

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **PDF Generation**: jsPDF
- **Process Manager**: Concurrently

### IoT & Data Collection
- **Protocol**: MQTT (paho-mqtt)
- **Gateway**: The Things Network (TTN)
- **Cloud Storage**: ThingSpeak, Supabase
- **Local Storage**: CSV files

### Machine Learning
- **Language**: Python 3.x
- **Libraries**:
  - pandas (data manipulation)
  - numpy (numerical operations)
  - scikit-learn (ML models)
  - matplotlib (visualization)
  - python-dotenv (environment variables)
  - supabase-py (database client)
- **Models**: Ridge Regression, Lasso Regression

---

## Features

### 1. Dashboard
- Real-time sensor metrics (Temperature, Humidity, Battery, Motion)
- Summary cards with average values
- Responsive grid layout
- Auto-refresh capability

### 2. Data Visualization
- Area charts with gradient fills
- Line charts for sensor data
- Interactive tooltips
- Responsive chart sizing
- Historical data trends

### 3. Temperature Prediction
- ML-based temperature forecasting
- Model performance metrics (RMSE, MAE, R²)
- Quality badges (Excellent/Good/Moderate/Weak/Poor)
- Next temperature prediction
- Train/Validation/Test split visualization

### 4. Reports & Export
- PDF report generation with full metrics
- PNG chart download
- Detailed prediction statistics
- CSV data export

### 5. Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop full-feature experience

### 6. Real-time Data Collection
- MQTT-based live data streaming
- Automatic historical data sync
- Duplicate detection
- Multi-platform storage

---

## Installation & Setup

### Prerequisites
```bash
- Node.js 18+ 
- Python 3.8+
- npm or yarn
- Supabase account
- ThingSpeak account (optional)
```

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd IoT_Mini_Project_Group_H
```

### Step 2: Install Dependencies

**Frontend:**
```bash
npm install
```

**Python Environment:**
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Unix/Mac
pip install -r requirements.txt
```

**Required Python packages:**
- pandas, numpy, scikit-learn, matplotlib
- python-dotenv, supabase
- paho-mqtt, requests

### Step 3: Environment Configuration

Create `.env` file in root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
WEATHER_API_KEY=your_weather_api_key
```

### Step 4: Database Setup

Create Supabase table:
```sql
CREATE TABLE sensor_data (
  entry_id INTEGER PRIMARY KEY,
  temperature FLOAT,
  humidity FLOAT,
  battery_voltage FLOAT,
  motion_counts INTEGER,
  timestamp TIMESTAMPTZ,
  data_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Step 5: Run Application
```bash
npm run dev
```

This command will automatically start:
- Next.js development server (port 3000)
- Python sensor data collection script
- Python Supabase data fetcher
- Python average summary calculator

Access at: `http://localhost:3000`

---

## System Components

### Frontend Components

#### 1. **Dashboard Summary** (`components/charts/dashboard_summary.jsx`)
- Displays average sensor metrics
- Fetches data from `/api/average-data`
- Auto-refreshes on mount

#### 2. **Temperature Predictor** (`components/temperature-predictor.jsx`)
- Main prediction interface
- Features:
  - Summary cards (Total Samples, Temp Range, Mean, Std Dev)
  - Area chart with gradient fills
  - Prediction quality badge
  - Metrics display (Train Mean, Test MAE, Test RMSE, Test R²)
  - Download buttons (PDF/PNG)

#### 3. **Chart Components** (`components/charts/`)
- `sensor_charts.jsx`: Real-time sensor data visualization
- `data_graph_card.jsx`: Historical data graphs
- `summary_card.jsx`: Reusable metric card component

### Backend Components

#### API Routes (`app/api/`)

1. **`/api/sensor-data`**: Fetch all sensor data
2. **`/api/average-data`**: Get average metrics
3. **`/api/predict-temperature`**: Get prediction results
4. **`/api/run-prediction`**: Execute Python ML model
5. **`/api/download-forecast-image`**: Download PNG chart
6. **`/api/download-prediction-report`**: Generate PDF report

---

## Python Scripts

### 1. **`temp_humidity_motion_sensor_data_lora.py`**
Main sensor data collection script that handles real-time and historical data.

**Location:** `sensor_data/sensor/`

**Features:**
- MQTT connection to The Things Network (TTN)
- Real-time sensor data collection via MQTT
- Historical data fetching from TTN API (48 hours)
- Data transmission to ThingSpeak
- Data storage in Supabase with entry_id as primary key
- CSV file generation for local backup
- Duplicate detection and filtering
- Automatic average calculation trigger

**Configuration:**
- Broker: `eu1.cloud.thethings.network`
- Port: 1883 (MQTT)
- Device: `lht65n-01-temp-humidity-sensor`
- ThingSpeak Channel: 3085407
- Rate Limit: 15 seconds between ThingSpeak updates

**Data Flow:**
```
IoT Sensor → TTN → MQTT → Script → ThingSpeak → Supabase → CSV
```

**Key Functions:**
- `on_connect()`: MQTT connection handler
- `on_message()`: Real-time message processor
- `send_to_thingspeak()`: Sends data to ThingSpeak API, returns entry_id
- `store_in_supabase()`: Stores data with entry_id as primary key
- `append_to_csv()`: Appends data to local CSV file
- `get_historical_sensor_data()`: Fetches 48h historical data from TTN
- `fetch_thingspeak_to_csv()`: Downloads all ThingSpeak data (8000 max)
- `fetch_thingspeak_to_supabase()`: Transfers ThingSpeak data to Supabase
- `data_has_changed()`: Filters duplicate readings (0.1°C threshold)
- `format_timestamp()`: Converts timestamps to ISO format

**Output Files:**
- `thingspeak_historical_data.csv`: All sensor readings
- `message.json`: Latest MQTT message
- `message_history.json`: Historical messages from TTN

**Sensor Data Fields:**
- `field1`: Battery voltage (V)
- `field3`: Humidity (%)
- `field4`: Motion counts
- `field5`: Temperature (°C)

**Usage:**
```bash
python temp_humidity_motion_sensor_data_lora.py
```

### 2. **`fetch_supabase_data.py`**
Monitors Supabase database for updates and provides data access.

**Location:** `sensor_data/sensor/`

**Features:**
- Real-time database monitoring (30-second interval)
- Paginated data fetching (1000 records per page)
- Entry count tracking
- Missing entry detection
- JSON export capability
- Console notifications for new data

**Key Functions:**
- `monitor_db_updates(interval=30)`: Continuous monitoring loop
- `fetch_all_db_data()`: Retrieves all records with pagination
- `count_db_entries()`: Returns total record count
- `get_max_entry_id()`: Finds highest entry_id

**Usage:**
```bash
python fetch_supabase_data.py              # Monitor mode (default)
python fetch_supabase_data.py --json       # Export all data as JSON
python fetch_supabase_data.py --count      # Show statistics
```

**Output:**
```
Monitoring database for updates every 30 seconds...
Total entries fetched: 11259

[OK] Data updated! New total: 11260 records
Latest entry: {...}
```

### 3. **`average_summary.py`**
Calculates and saves average sensor metrics.

**Location:** `sensor_data/sensor/`

**Features:**
- Fetches latest 8000 records from Supabase
- Calculates averages for all sensor readings
- Generates JSON summary file
- Automatic execution after new data collection
- Error handling and validation

**Key Functions:**
- `calculate_and_save_averages()`: Main calculation function

**Output File:**
- `average_summary.json`: Contains average metrics

**Output Format:**
```json
{
  "timestamp": "2025-01-10T12:00:00",
  "average_temperature": 25.4,
  "average_humidity": 58.3,
  "average_battery": 3.65,
  "average_motion": 2.1
}
```

**Usage:**
```bash
python average_summary.py
```

### 4. **`prediction_model.py`**
Machine learning model for temperature prediction.

**Location:** `sensor_data/sensor/`

**Features:**
- Ridge/Lasso regression models
- 13 engineered features
- 70/15/15 train/validation/test split
- Model comparison and selection
- Visualization generation (4 subplots)
- Next temperature prediction

**See [Machine Learning Model](#machine-learning-model) section for details.**

---

## API Endpoints

### GET `/api/sensor-data`
Fetches all sensor data from Supabase.

**Response:**
```json
[
  {
    "entry_id": 1,
    "temperature": 25.5,
    "humidity": 60.2,
    "battery_voltage": 3.7,
    "motion_counts": 1,
    "timestamp": "2025-01-10T12:00:00Z",
    "data_type": "real-time"
  }
]
```

### GET `/api/average-data`
Returns average sensor metrics from `average_summary.json`.

**Response:**
```json
{
  "average_temperature": 25.4,
  "average_humidity": 58.3,
  "average_battery": 3.65,
  "average_motion": 2.1,
  "total_readings": 9853
}
```

### GET `/api/predict-temperature`
Returns prediction results from `prediction_results.json`.

**Response:**
```json
{
  "test_data": [
    {
      "index": 0,
      "actual": 24.86,
      "predicted": 24.846,
      "trainMean": 25.65
    }
  ],
  "metrics": {
    "test_rmse": 0.0004,
    "test_mae": 0.00001,
    "test_r2": 0.9999,
    "train_mean": 25.65,
    "train_std": 1.33,
    "data_mean": 25.40,
    "data_std": 1.24,
    "total_samples": 9853,
    "train_samples": 6897,
    "val_samples": 1478,
    "test_samples": 1478,
    "temp_min": 0.0,
    "temp_max": 27.7,
    "next_prediction": {
      "current_temp": 26.22,
      "predicted_temp": 26.22,
      "temp_change": 0.00
    }
  }
}
```

### POST `/api/run-prediction`
Executes Python prediction model.

**Response:**
```json
{
  "success": true,
  "message": "Prediction completed successfully"
}
```

### GET `/api/download-forecast-image`
Downloads temperature forecast PNG.

**Response:** Binary PNG file

### GET `/api/download-prediction-report`
Generates and downloads PDF report.

**Response:** Binary PDF file

---

## Machine Learning Model

### Model: `sensor_data/sensor/prediction_model.py`

#### Architecture
- **Algorithm**: Ridge Regression (α=0.001) / Lasso Regression
- **Training Split**: 70% Train, 15% Validation, 15% Test
- **Features**: 13 engineered features

#### Feature Engineering

1. **Cyclical Time Features**
   - `hour_sin`, `hour_cos`: Hour of day (0-23)
   - `day_sin`, `day_cos`: Day of week (0-6)

2. **Lag Features**
   - `temp_lag_1`, `temp_lag_2`, `temp_lag_3`, `temp_lag_6`
   - Previous temperature readings

3. **Rolling Statistics**
   - `temp_ma_3`: 3-period moving average
   - `temp_ma_6`: 6-period moving average

4. **Difference Features**
   - `temp_diff_1`: First-order difference

5. **Seasonal Averages**
   - `hourly_avg`: Average temperature by hour
   - `daily_avg`: Average temperature by day

#### Model Selection Process
```python
Models Tested:
- Baseline (Mean)
- Ridge (α = 0.001, 0.01, 0.1, 1.0, 10.0)
- Lasso (α = 0.001, 0.01, 0.1)

Selection Criteria:
- Lowest validation RMSE
- Best R² score
- Minimal overfitting gap
```

#### Performance Metrics

**Interpretation Thresholds:**
- R² > 0.95: **Excellent** predictions
- R² > 0.85: **Good** predictions
- R² > 0.40: **Moderate** predictions
- R² > 0.20: **Weak** predictions
- R² > 0.00: **Very weak** predictions
- R² ≤ 0.00: **Poor** predictions

#### Output Files
1. **`prediction_results.json`**: Metrics and test data
2. **`temperature_forecast.png`**: Visualization (4 subplots)

---

## Data Flow

### 1. Data Collection Flow
```
IoT Sensor (LoRa)
    ↓
The Things Network (TTN)
    ↓
MQTT Broker (eu1.cloud.thethings.network)
    ↓
temp_humidity_motion_sensor_data_lora.py
    ↓
    ├→ ThingSpeak API (Entry ID generation)
    ├→ Supabase Database (Primary storage)
    └→ CSV File (Local backup)
    ↓
average_summary.py (Auto-triggered)
    ↓
average_summary.json
```

### 2. Real-time Monitoring Flow
```
fetch_supabase_data.py (30s interval)
    ↓
Supabase Database
    ↓
Console Output (New entries detected)
```

### 3. Dashboard Data Flow
```
Frontend Component
    ↓
API Route (/api/sensor-data)
    ↓
Supabase Client
    ↓
Database Query
    ↓
JSON Response
    ↓
Recharts Visualization
```

### 4. Prediction Workflow
```
User clicks "Run Prediction"
    ↓
Frontend → /api/run-prediction
    ↓
Execute Python script (prediction_model.py)
    ↓
Fetch data from Supabase
    ↓
Feature Engineering (13 features)
    ↓
Model Training & Validation
    ↓
Generate prediction_results.json
    ↓
Generate temperature_forecast.png
    ↓
Return success response
    ↓
Frontend fetches /api/predict-temperature
    ↓
Display results & charts
```

### 5. Startup Flow (npm run dev)
```
npm run dev
    ↓
Concurrently starts:
    ├→ next dev (Port 3000)
    ├→ temp_humidity_motion_sensor_data_lora.py
    ├→ fetch_supabase_data.py
    └→ average_summary.py
```

---

## User Guide

### Starting the System

1. **Activate Python Environment:**
```bash
venv\Scripts\activate  # Windows
```

2. **Start All Services:**
```bash
npm run dev
```

This automatically starts:
- Next.js frontend (http://localhost:3000)
- MQTT sensor data collector
- Database monitor
- Average calculator

### Using the Dashboard

1. **View Real-time Data:**
   - Navigate to homepage
   - View summary cards (Temperature, Humidity, Battery, Motion)
   - Scroll to see historical charts

2. **Run Temperature Prediction:**
   - Click "Temperature Prediction" tab
   - Click "Run Prediction" button
   - Wait for model training (30-60 seconds)
   - View results and metrics

3. **Download Reports:**
   - Click "Download PDF Report" for full metrics
   - Click "Download Forecast Image" for PNG chart

### Monitoring Data Collection

**Console Output:**
```
Connected to TTN MQTT broker!
Subscribed to topic: v3/bd-test-app2@ttn/devices/lht65n-01-temp-humidity-sensor/up
[2025-01-10T12:00:00Z] Real-time - Temp: 25.5°C, Humidity: 60.2%, Battery: 3.7V, Motion: 1
Data sent to ThingSpeak successfully! Entry ID: 11260
Data stored in Supabase successfully! Entry ID: 11260
Data appended to CSV file! Entry ID: 11260
```

---

## Troubleshooting

### Issue: Python scripts not starting
**Solution:**
- Ensure virtual environment is activated
- Check `.env` file has correct credentials
- Verify Python packages installed: `pip install -r requirements.txt`

### Issue: MQTT connection failed
**Solution:**
- Check TTN credentials in script
- Verify network connectivity
- Ensure broker URL is correct

### Issue: Supabase connection error
**Solution:**
- Verify `.env` has both `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_URL`
- Check Supabase project is active
- Verify API keys are correct

### Issue: ThingSpeak rate limit
**Solution:**
- Script has 15-second delay between updates
- Free ThingSpeak accounts limited to 1 update per 15 seconds

### Issue: Prediction model fails
**Solution:**
- Ensure sufficient data in database (minimum 100 records)
- Check `prediction_model.py` has database access
- Verify all Python ML libraries installed

### Issue: Unicode error in Windows console
**Solution:**
- Already fixed: Checkmark characters replaced with `[OK]`
- If persists, run: `chcp 65001` in terminal

---

## File Structure

```
IoT_Mini_Project_Group_H/
├── app/
│   ├── api/
│   │   ├── sensor-data/
│   │   ├── average-data/
│   │   ├── predict-temperature/
│   │   ├── run-prediction/
│   │   ├── download-forecast-image/
│   │   └── download-prediction-report/
│   ├── temperature-predictor/
│   ├── globals.css
│   ├── layout.js
│   └── page.jsx
├── components/
│   ├── charts/
│   │   ├── dashboard_summary.jsx
│   │   ├── sensor_charts.jsx
│   │   └── data_graph_card.jsx
│   ├── ui/
│   ├── header.jsx
│   └── temperature-predictor.jsx
├── sensor_data/sensor/
│   ├── temp_humidity_motion_sensor_data_lora.py
│   ├── fetch_supabase_data.py
│   ├── average_summary.py
│   └── prediction_model.py
├── .env
├── package.json
├── requirements.txt
├── average_summary.json
├── prediction_results.json
├── temperature_forecast.png
└── thingspeak_historical_data.csv
```

---

## Performance Metrics

### System Capabilities
- **Data Collection Rate**: Real-time (MQTT push)
- **Database Monitoring**: 30-second intervals
- **Prediction Time**: 30-60 seconds
- **Data Storage**: Unlimited (Supabase)
- **Historical Data**: 8000 records (ThingSpeak free tier)

### Model Performance (Typical)
- **RMSE**: < 0.001°C
- **MAE**: < 0.0001°C
- **R² Score**: > 0.999 (Excellent)
- **Training Time**: 20-40 seconds

---

## Security Considerations

1. **Environment Variables**: All credentials in `.env` file
2. **API Keys**: Never commit to version control
3. **Database**: Row-level security enabled in Supabase
4. **MQTT**: Authenticated connection to TTN
5. **Frontend**: API routes validate requests

---

## Future Enhancements

- [ ] Add user authentication
- [ ] Implement data export to multiple formats
- [ ] Add email/SMS alerts for anomalies
- [ ] Implement predictive maintenance
- [ ] Add multi-sensor support
- [ ] Create mobile app
- [ ] Add weather API integration
- [ ] Implement anomaly detection

---

## Support & Contact

For issues or questions:
- Check [Troubleshooting](#troubleshooting) section
- Review console logs for error messages
- Verify all environment variables are set
- Ensure all services are running

---

**Last Updated:** January 2025
**Version:** 1.0.0
