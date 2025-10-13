# IoT Temperature Prediction System - Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Features](#features)
5. [Installation & Setup](#installation--setup)
6. [System Components](#system-components)
7. [API Endpoints](#api-endpoints)
8. [Machine Learning Model](#machine-learning-model)
9. [Data Flow](#data-flow)
10. [User Guide](#user-guide)
11. [Troubleshooting](#troubleshooting)

---

## System Overview

The IoT Temperature Prediction System is a full-stack web application that collects, visualizes, and predicts temperature data from IoT sensors. The system uses machine learning (Ridge/Lasso regression) to forecast future temperature readings with high accuracy.

### Key Capabilities
- Real-time sensor data visualization
- Temperature prediction using ML models
- Historical data analysis
- Downloadable reports (PDF/PNG)
- Responsive design for all devices

---

## Architecture

```
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
                ┌───────────┴───────────┐
                ↓                       ↓
┌──────────────────────────┐  ┌──────────────────────────┐
│   Supabase Database      │  │  Python ML Model         │
│  - sensor_data table     │  │  - Ridge Regression      │
│  - Real-time updates     │  │  - Feature Engineering   │
└──────────────────────────┘  └──────────────────────────┘
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15.5.4 (React 19)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: React Icons
- **Notifications**: Sonner

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **PDF Generation**: jsPDF

### Machine Learning
- **Language**: Python 3.x
- **Libraries**:
  - pandas (data manipulation)
  - numpy (numerical operations)
  - scikit-learn (ML models)
  - matplotlib (visualization)
- **Models**: Ridge Regression, Lasso Regression

---

## Features

### 1. Dashboard
- Real-time sensor metrics (Temperature, Humidity, Battery, Motion)
- Summary cards with average values
- Responsive grid layout

### 2. Data Visualization
- Area charts with gradient fills
- Line charts for sensor data
- Interactive tooltips
- Responsive chart sizing

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

### 5. Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop full-feature experience

---

## Installation & Setup

### Prerequisites
```bash
- Node.js 18+ 
- Python 3.8+
- npm or yarn
- Supabase account
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
cd sensor_data/sensor
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Unix/Mac
pip install pandas numpy scikit-learn matplotlib python-dotenv supabase
```

### Step 3: Environment Configuration

Create `.env` file in root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Database Setup

Create Supabase table:
```sql
CREATE TABLE sensor_data (
  entry_id SERIAL PRIMARY KEY,
  temperature FLOAT,
  humidity FLOAT,
  battery FLOAT,
  motion INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Step 5: Run Application
```bash
npm run dev
```

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
    "battery": 3.7,
    "motion": 1,
    "timestamp": "2025-01-10T12:00:00Z"
  }
]
```

### GET `/api/average-data`
Returns average sensor metrics.

**Response:**
```json
{
  "average_temperature": 25.4,
  "average_humidity": 58.3,
  "average_battery": 3.65,
  "total_readings": 9853
}
```

### GET `/api/predict-temperature`
Returns prediction results from JSON file.

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

### 1. Data Collection
```
IoT Sensor → Supabase → API → Frontend Dashboard
```

### 2. Prediction Workflow
```
User clicks "Run Prediction"
    ↓
Frontend calls /api/run-prediction
    ↓
API spawns Python process
    ↓
Python fetches data from Supabase
    ↓
Feature engineering & model training
    ↓
Predictions saved to JSON
    ↓
Frontend fetches results
    ↓
Display charts & metrics
```

### 3. Report Generation
```
User clicks "Download PDF"
    ↓
Frontend calls /api/download-prediction-report
    ↓
API reads prediction_results.json
    ↓
jsPDF generates PDF document
    ↓
Browser downloads file
```

---

## User Guide

### Running a Prediction

1. Navigate to the Temperature Predictor page
2. Click **"Run Prediction"** button
3. Wait for model to train (loading toast appears)
4. View results:
   - Summary cards update with latest metrics
   - Chart displays actual vs predicted temperatures
   - Quality badge shows prediction accuracy
   - More Info card shows detailed metrics

### Understanding Metrics

- **Test RMSE**: Root Mean Square Error (lower is better)
- **Test MAE**: Mean Absolute Error (average prediction error)
- **Test R²**: Coefficient of determination (closer to 1 is better)
- **Train Mean**: Average temperature in training set
- **Predicted Temperature**: Next forecasted reading

### Downloading Reports

**PNG Chart:**
1. Click "Download PNG" button
2. File saves as `temperature_forecast.png`
3. Contains 4 subplots: predictions, comparison, residuals, model comparison

**PDF Report:**
1. Click "Download PDF" button
2. File saves as `temperature_prediction_report.pdf`
3. Includes: Data overview, sample sizes, performance metrics, interpretation, next prediction

---

## Troubleshooting

### Issue: "Prediction failed" error
**Solution:**
- Ensure Python virtual environment is activated
- Check Supabase credentials in `.env`
- Verify database has sufficient data (>100 records recommended)

### Issue: Charts not displaying
**Solution:**
- Run prediction first to generate data
- Check browser console for errors
- Verify `prediction_results.json` exists in `sensor_data/sensor/`

### Issue: 500 Error on `/api/average-data`
**Solution:**
- Check if `average_summary.json` exists
- API now returns default values if file missing
- Run `average_summary.py` to generate file

### Issue: PDF download fails
**Solution:**
- Ensure `jspdf` package is installed: `npm install jspdf`
- Check if prediction has been run first
- Verify `prediction_results.json` contains valid data

### Issue: Mobile layout issues
**Solution:**
- Clear browser cache
- Ensure viewport meta tag is present
- Check Tailwind CSS responsive classes are applied

---

## File Structure

```
IoT_Mini_Project_Group_H/
├── app/
│   ├── api/
│   │   ├── average-data/route.js
│   │   ├── download-forecast-image/route.js
│   │   ├── download-prediction-report/route.js
│   │   ├── predict-temperature/route.js
│   │   ├── run-prediction/route.js
│   │   └── sensor-data/route.js
│   ├── layout.js
│   └── page.jsx
├── components/
│   ├── charts/
│   │   ├── dashboard_summary.jsx
│   │   ├── sensor_charts.jsx
│   │   └── data_graph_card.jsx
│   ├── temperature-predictor.jsx
│   └── ui/ (shadcn components)
├── sensor_data/
│   └── sensor/
│       ├── prediction_model.py
│       ├── prediction_results.json
│       ├── temperature_forecast.png
│       └── average_summary.json
├── .env
├── package.json
└── DOCUMENTATION.md
```

---

## Performance Optimization

### Frontend
- Lazy loading for charts
- Memoization of expensive calculations
- Debounced API calls
- Responsive image loading

### Backend
- Efficient database queries
- JSON file caching
- Minimal data transfer
- Error handling with graceful fallbacks

### ML Model
- Feature selection (13 most important features)
- Efficient data preprocessing
- Model caching between runs
- Optimized hyperparameters

---

## Security Considerations

1. **Environment Variables**: Sensitive keys stored in `.env`
2. **API Rate Limiting**: Consider implementing for production
3. **Input Validation**: Validate all user inputs
4. **Database Security**: Use Supabase Row Level Security (RLS)
5. **CORS**: Configure for production domains

---

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live data
2. **User Authentication**: Multi-user support with auth
3. **Alert System**: Notifications for anomalies
4. **Historical Comparison**: Compare predictions across time periods
5. **Model Versioning**: Track model performance over time
6. **Advanced Analytics**: Seasonal decomposition, trend analysis
7. **Mobile App**: Native iOS/Android applications
8. **API Documentation**: Swagger/OpenAPI integration

---

## Support & Contact

For issues, questions, or contributions:
- Create an issue in the repository
- Contact the development team
- Review the troubleshooting section

---

## License

[Specify your license here]

---

## Version History

- **v1.0.0** (Current): Initial release with core features
  - Temperature prediction
  - Dashboard visualization
  - PDF/PNG export
  - Responsive design

---

**Last Updated**: January 2025
