import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import Ridge, Lasso
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import os
from dotenv import load_dotenv
from supabase import create_client, Client

def create_features_smart(df, is_train=True, train_stats=None):
    df_features = df.copy()
    
    # Basic time features (no NaN created)
    df_features['hour'] = df_features.index.hour
    df_features['dayofweek'] = df_features.index.dayofweek
    
    # Cyclical encoding
    df_features['hour_sin'] = np.sin(2 * np.pi * df_features['hour'] / 24)
    df_features['hour_cos'] = np.cos(2 * np.pi * df_features['hour'] / 24)
    df_features['day_sin'] = np.sin(2 * np.pi * df_features['dayofweek'] / 7)
    df_features['day_cos'] = np.cos(2 * np.pi * df_features['dayofweek'] / 7)
    
    # Lag features - use bfill() instead of fillna(method='bfill')
    for lag in [1, 2, 3, 6]:
        df_features[f'temp_lag_{lag}'] = df_features['temperature'].shift(lag)
        # Use bfill() instead of fillna with method
        df_features[f'temp_lag_{lag}'] = df_features[f'temp_lag_{lag}'].bfill()
    
    # Rolling average - assign directly instead of inplace
    temp_mean = df_features['temperature'].mean()
    
    df_features['temp_ma_3'] = df_features['temperature'].shift(1).rolling(window=3, min_periods=1).mean()
    df_features['temp_ma_3'] = df_features['temp_ma_3'].fillna(temp_mean)
    
    df_features['temp_ma_6'] = df_features['temperature'].shift(1).rolling(window=6, min_periods=1).mean()
    df_features['temp_ma_6'] = df_features['temp_ma_6'].fillna(temp_mean)
    
    # Difference features
    df_features['temp_diff_1'] = df_features['temperature'].diff(1)
    df_features['temp_diff_1'] = df_features['temp_diff_1'].fillna(0)  # First value has no change
    
    # Seasonal averages (computed from training data only)
    if is_train:
        hourly_stats = df_features.groupby('hour')['temperature'].agg(['mean', 'std'])
        daily_stats = df_features.groupby('dayofweek')['temperature'].agg(['mean', 'std'])
        
        df_features['hourly_avg'] = df_features['hour'].map(hourly_stats['mean'])
        df_features['hourly_std'] = df_features['hour'].map(hourly_stats['std']).fillna(1)
        df_features['daily_avg'] = df_features['dayofweek'].map(daily_stats['mean'])
        
        return df_features, {'hourly': hourly_stats, 'daily': daily_stats}
    else:
        df_features['hourly_avg'] = df_features['hour'].map(train_stats['hourly']['mean'])
        df_features['hourly_std'] = df_features['hour'].map(train_stats['hourly']['std']).fillna(1)
        df_features['daily_avg'] = df_features['dayofweek'].map(train_stats['daily']['mean'])
        
        return df_features, train_stats


def optimize_forecasting_model():
    """
    Optimized forecasting that uses ALL available data
    """
    # Load data from Supabase
    load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env"))
    SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Error: Supabase credentials not found in .env file")
        return None
    
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    print("Fetching data from Supabase...")
    all_data = []
    page_size = 1000
    offset = 0
    
    while True:
        response = supabase.table("sensor_data").select("*").order("entry_id", desc=False).range(offset, offset + page_size - 1).execute()
        if not response.data:
            break
        all_data.extend(response.data)
        if len(response.data) < page_size:
            break
        offset += page_size
    
    print(f"Fetched {len(all_data)} records from Supabase")
    
    df = pd.DataFrame(all_data)
    df['timestamp'] = pd.to_datetime(df['timestamp'] if 'timestamp' in df.columns else df['created_at'], format='ISO8601')
    df.set_index('timestamp', inplace=True)
    
    # Check for missing values
    missing_before = df['temperature'].isna().sum()
    
    # Use ALL data without resampling
    df_resampled = df.copy()
    df_resampled['temperature'] = df_resampled['temperature'].interpolate(method='linear')
    df_resampled = df_resampled.ffill().bfill()
    
    missing_after = df_resampled['temperature'].isna().sum()
    
    print("="*70)
    print("DATA OVERVIEW")
    print("="*70)
    print(f"Total samples after resampling: {len(df_resampled)}")
    print(f"Missing values before interpolation: {missing_before}")
    print(f"Missing values after interpolation: {missing_after}")
    print(f"Date range: {df_resampled.index[0]} to {df_resampled.index[-1]}")
    print(f"Temperature range: {df_resampled['temperature'].min():.1f}°C to {df_resampled['temperature'].max():.1f}°C")
    print(f"Temperature mean: {df_resampled['temperature'].mean():.1f}°C")
    print(f"Temperature std: {df_resampled['temperature'].std():.2f}°C")

    # Split data: 70% train, 15% val, 15% test
    n = len(df_resampled)
    train_end = int(n * 0.70)
    val_end = int(n * 0.85)
    
    df_train = df_resampled.iloc[:train_end]
    df_val = df_resampled.iloc[train_end:val_end]
    df_test = df_resampled.iloc[val_end:]
    
    print(f"\nSplit sizes:")
    print(f"  Train: {len(df_train)} samples ({df_train.index[0]} to {df_train.index[-1]})")
    print(f"  Val:   {len(df_val)} samples ({df_val.index[0]} to {df_val.index[-1]})")
    print(f"  Test:  {len(df_test)} samples ({df_test.index[0]} to {df_test.index[-1]})")

    # Create features separately for each split
    df_train_features, train_stats = create_features_smart(df_train, is_train=True)
    df_val_features, _ = create_features_smart(df_val, is_train=False, train_stats=train_stats)
    df_test_features, _ = create_features_smart(df_test, is_train=False, train_stats=train_stats)
    
    # Check for any remaining NaN values
    train_nan = df_train_features.isna().sum().sum()
    val_nan = df_val_features.isna().sum().sum()
    test_nan = df_test_features.isna().sum().sum()
    
    print(f"\nNaN values after feature engineering:")
    print(f"  Train: {train_nan}")
    print(f"  Val:   {val_nan}")
    print(f"  Test:  {test_nan}")
    
    # Only drop rows if absolutely necessary
    if train_nan > 0:
        before = len(df_train_features)
        df_train_features = df_train_features.dropna()
        print(f"  Dropped {before - len(df_train_features)} training rows with NaN")
    
    if val_nan > 0:
        before = len(df_val_features)
        df_val_features = df_val_features.dropna()
        print(f"  Dropped {before - len(df_val_features)} validation rows with NaN")
    
    if test_nan > 0:
        before = len(df_test_features)
        df_test_features = df_test_features.dropna()
        print(f"  Dropped {before - len(df_test_features)} test rows with NaN")
    
    print(f"\nFinal sample sizes:")
    print(f"  Train: {len(df_train_features)} samples")
    print(f"  Val:   {len(df_val_features)} samples")
    print(f"  Test:  {len(df_test_features)} samples")

    # Feature selection - use features that capture patterns
    selected_features = [
        'hour_sin', 'hour_cos', 'day_sin', 'day_cos',
        'temp_lag_1', 'temp_lag_2', 'temp_lag_3', 'temp_lag_6',
        'temp_ma_3', 'temp_ma_6',
        'temp_diff_1',
        'hourly_avg', 'daily_avg'
    ]
    
    # Verify all features exist
    available_features = [f for f in selected_features if f in df_train_features.columns]
    print(f"\nUsing {len(available_features)} features:")
    for feat in available_features:
        print(f"  - {feat}")
    
    target = 'temperature'
    X_train = df_train_features[available_features]
    y_train = df_train_features[target]
    X_val = df_val_features[available_features]
    y_val = df_val_features[target]
    X_test = df_test_features[available_features]
    y_test = df_test_features[target]

    # Scale features (fit on training only)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_val_scaled = scaler.transform(X_val)
    X_test_scaled = scaler.transform(X_test)

    # Test multiple models
    print("\n" + "="*70)
    print("MODEL COMPARISON")
    print("="*70)
    print(f"{'Model':<25} | {'Train RMSE':>10} | {'Val RMSE':>10} | {'Val R²':>10} | {'Gap':>8}")
    print("-"*70)
    
    models = {
        'Baseline (Mean)': None,
        'Ridge a=0.001': Ridge(alpha=0.001, max_iter=10000),
        'Ridge a=0.01': Ridge(alpha=0.01, max_iter=10000),
        'Ridge a=0.1': Ridge(alpha=0.1, max_iter=10000),
        'Ridge a=1.0': Ridge(alpha=1.0, max_iter=10000),
        'Ridge a=10.0': Ridge(alpha=10.0, max_iter=10000),
        'Lasso a=0.001': Lasso(alpha=0.001, max_iter=10000),
        'Lasso a=0.01': Lasso(alpha=0.01, max_iter=10000),
        'Lasso a=0.1': Lasso(alpha=0.1, max_iter=10000),
    }
    
    results = []
    best_val_rmse = float('inf')
    best_model = None
    best_model_name = None
    
    for name, model in models.items():
        if name == 'Baseline (Mean)':
            train_pred = np.full(len(y_train), y_train.mean())
            val_pred = np.full(len(y_val), y_train.mean())
        else:
            model.fit(X_train_scaled, y_train)
            train_pred = model.predict(X_train_scaled)
            val_pred = model.predict(X_val_scaled)
        
        train_rmse = np.sqrt(mean_squared_error(y_train, train_pred))
        val_rmse = np.sqrt(mean_squared_error(y_val, val_pred))
        val_r2 = r2_score(y_val, val_pred)
        
        results.append({
            'Model': name,
            'Train RMSE': train_rmse,
            'Val RMSE': val_rmse,
            'Val R²': val_r2,
            'Overfit Gap': val_rmse - train_rmse
        })
        
        print(f"{name:<25} | {train_rmse:10.3f} | {val_rmse:10.3f} | {val_r2:10.4f} | {val_rmse-train_rmse:8.3f}")
        
        if val_rmse < best_val_rmse and model is not None:
            best_val_rmse = val_rmse
            best_model = model
            best_model_name = name
    
    # Check if baseline is better
    baseline_rmse = results[0]['Val RMSE']
    if best_val_rmse >= baseline_rmse:
        print(f"\nWARNING: All models perform worse than baseline!")
        print(f"Using baseline prediction (mean = {y_train.mean():.2f}°C)")
        best_model_name = "Baseline (Mean)"
        train_pred = np.full(len(y_train), y_train.mean())
        test_pred = np.full(len(y_test), y_train.mean())
    else:
        print(f"\n{'='*70}")
        print(f"BEST MODEL: {best_model_name}")
        print(f"{'='*70}")
        
        train_pred = best_model.predict(X_train_scaled)
        test_pred = best_model.predict(X_test_scaled)
    
    # Final evaluation
    test_rmse = np.sqrt(mean_squared_error(y_test, test_pred))
    test_mae = mean_absolute_error(y_test, test_pred)
    test_r2 = r2_score(y_test, test_pred)
    train_rmse = np.sqrt(mean_squared_error(y_train, train_pred))
    
    print(f"\nFINAL TEST SET PERFORMANCE:")
    print(f"  Train RMSE:     {train_rmse:.3f}°C")
    print(f"  Test RMSE:      {test_rmse:.3f}°C")
    print(f"  Test MAE:       {test_mae:.3f}°C")
    print(f"  Test R²:        {test_r2:.4f}")
    print(f"  Overfit Gap:    {test_rmse - train_rmse:.3f}°C")
    print(f"  Mean Temp:      {y_train.mean():.2f}°C")
    print(f"  Temp Std Dev:   {y_train.std():.2f}°C")
    
    # Interpretation
    print(f"\nINTERPRETATION:")
    if test_r2 > 0.95:
        print("  [EXCELLENT] Excellent predictions!")
    elif test_r2 > 0.85:
        print("  [GOOD] Good predictions")
    elif test_r2 > 0.4:
        print("  [MODERATE] Moderate predictions")
    elif test_r2 > 0.2:
        print("  [WEAK] Weak but useful predictions")
    elif test_r2 > 0:
        print("  [WEAK] Very weak predictions (barely better than mean)")
    else:
        print("  [POOR] Poor predictions (worse than predicting mean)")
    
    print(f"\n  On average, predictions are off by ±{test_mae:.2f}°C")
    print(f"  This is {(test_mae/y_train.std())*100:.1f}% of the temperature variation")

    # Visualization
    fig, axes = plt.subplots(2, 2, figsize=(16, 10))
    
    # Plot 1: Test predictions - Line Graph
    ax1 = axes[0, 0]
    ax1.plot(y_test.index, y_test.values, '-', color='blue', label='Actual', 
             alpha=0.8, linewidth=2)
    ax1.plot(y_test.index, test_pred, '-', color='red', label='Predicted', 
             alpha=0.8, linewidth=2)
    ax1.axhline(y=y_train.mean(), color='gray', linestyle='--', linewidth=2, alpha=0.7, label='Train Mean')
    ax1.set_title(f'Temperature Forecast - Test Set\nR²={test_r2:.3f}, RMSE={test_rmse:.2f}°C, MAE={test_mae:.2f}°C', 
                  fontsize=12, fontweight='bold')
    ax1.set_xlabel('Date', fontsize=10)
    ax1.set_ylabel('Temperature (°C)', fontsize=10)
    ax1.legend(fontsize=9, loc='best')
    ax1.grid(True, alpha=0.3)
    ax1.tick_params(axis='x', rotation=45)
    
    # Plot 2: Full timeline - Line Graph
    ax2 = axes[0, 1]
    ax2.plot(y_test.index, y_test.values, '-', color='blue', label='Actual', alpha=0.8, linewidth=2)
    ax2.plot(y_test.index, test_pred, '-', color='red', label='Predicted', alpha=0.8, linewidth=2)
    ax2.axhline(y=y_train.mean(), color='gray', linestyle='--', linewidth=2, alpha=0.7, label='Train Mean')
    ax2.set_title(f'Temperature Prediction Comparison', fontsize=12, fontweight='bold')
    ax2.set_xlabel('Date', fontsize=10)
    ax2.set_ylabel('Temperature (°C)', fontsize=10)
    ax2.legend(fontsize=9, loc='best')
    ax2.grid(True, alpha=0.3)
    ax2.tick_params(axis='x', rotation=45)
    
    # Plot 3: Residuals
    ax3 = axes[1, 0]
    residuals = y_test.values - test_pred
    ax3.scatter(test_pred, residuals, alpha=0.6, s=60, edgecolors='black', linewidth=0.5)
    ax3.axhline(y=0, color='red', linestyle='--', linewidth=2, label='Perfect prediction')
    ax3.axhline(y=residuals.std(), color='orange', linestyle=':', alpha=0.7, 
                label=f'±1 std ({residuals.std():.2f}°C)')
    ax3.axhline(y=-residuals.std(), color='orange', linestyle=':', alpha=0.7)
    ax3.set_title('Residual Plot (Prediction Errors)', fontsize=12, fontweight='bold')
    ax3.set_xlabel('Predicted Temperature (°C)', fontsize=10)
    ax3.set_ylabel('Residual (Actual - Predicted) (°C)', fontsize=10)
    ax3.legend(fontsize=9)
    ax3.grid(True, alpha=0.3)
    
    # Plot 4: Model comparison
    ax4 = axes[1, 1]
    results_df = pd.DataFrame(results)
    x_pos = np.arange(len(results_df))
    width = 0.35
    
    bars1 = ax4.bar(x_pos - width/2, results_df['Train RMSE'], width, 
                    label='Train RMSE', alpha=0.7, color='skyblue')
    bars2 = ax4.bar(x_pos + width/2, results_df['Val RMSE'], width, 
                    label='Val RMSE', alpha=0.7, color='salmon')
    
    ax4.set_title('Model Comparison (Lower is Better)', fontsize=12, fontweight='bold')
    ax4.set_ylabel('RMSE (°C)', fontsize=10)
    ax4.set_xlabel('Model', fontsize=10)
    ax4.set_xticks(x_pos)
    ax4.set_xticklabels(results_df['Model'], rotation=45, ha='right', fontsize=8)
    ax4.legend(fontsize=9)
    ax4.grid(True, alpha=0.3, axis='y')
    
    # Highlight best model
    if best_model_name != "Baseline (Mean)":
        best_idx = results_df[results_df['Model'] == best_model_name].index[0]
        ax4.axvline(x=best_idx, color='green', linestyle='--', alpha=0.5, linewidth=3, label='Best')
    
    plt.tight_layout()
    forecast_path = os.path.join(os.path.dirname(__file__), 'temperature_forecast.png')
    plt.savefig(forecast_path, dpi=300, bbox_inches='tight')
    print(f"\n[OK] Visualization saved to '{forecast_path}'")
    
    # Predict next temperature
    print(f"\n{'='*70}")
    print("NEXT TEMPERATURE PREDICTION")
    print(f"{'='*70}")
    
    # Use full dataset to create features, then take the last row
    full_features, _ = create_features_smart(df_resampled, is_train=False, train_stats=train_stats)
    last_features = full_features.iloc[[-1]][available_features]
    last_scaled = scaler.transform(last_features)
    
    if best_model is not None:
        next_temp = best_model.predict(last_scaled)[0]
    else:
        next_temp = y_train.mean()
    
    current_temp = df_resampled['temperature'].iloc[-1]
    temp_change = next_temp - current_temp
    
    print(f"  Current Temperature:  {current_temp:.2f}°C")
    print(f"  Predicted Next Temp:  {next_temp:.2f}°C")
    print(f"  Expected Change:      {temp_change:+.2f}°C")
    print(f"  Prediction Time:      Next reading")
    
    # Save prediction results to JSON
    prediction_results = {
        'test_data': [
            {
                'index': i,
                'actual': float(y_test.iloc[i]),
                'predicted': float(test_pred[i]),
                'trainMean': float(y_train.mean())
            }
            for i in range(len(y_test))
        ],
        'metrics': {
            'test_rmse': float(test_rmse),
            'test_mae': float(test_mae),
            'test_r2': float(test_r2),
            'train_mean': float(y_train.mean()),
            'train_std': float(y_train.std()),
            'data_mean': float(df_resampled['temperature'].mean()),
            'data_std': float(df_resampled['temperature'].std()),
            'total_samples': int(len(df_resampled)),
            'temperature_range': float(df_resampled['temperature'].max() - df_resampled['temperature'].min()),
            'next_prediction': {
                'current_temp': float(current_temp),
                'predicted_temp': float(next_temp),
                'temp_change': float(temp_change)
            }
        }
    }
    
    import json
    results_path = os.path.join(os.path.dirname(__file__), 'prediction_results.json')
    with open(results_path, 'w') as f:
        json.dump(prediction_results, f)
    print(f"\n[OK] Prediction results saved to '{results_path}'")
    
    # Feature importance
    if best_model is not None and hasattr(best_model, 'coef_'):
        print(f"\nFEATURE IMPORTANCE ({best_model_name}):")
        print(f"{'Feature':<20} | {'Coefficient':>12} | {'Abs Value':>12}")
        print("-"*50)
        
        feature_importance = pd.DataFrame({
            'Feature': available_features,
            'Coefficient': best_model.coef_
        })
        feature_importance['Abs_Coef'] = np.abs(feature_importance['Coefficient'])
        feature_importance = feature_importance.sort_values('Abs_Coef', ascending=False)
        
        for idx, row in feature_importance.iterrows():
            print(f"{row['Feature']:<20} | {row['Coefficient']:12.4f} | {row['Abs_Coef']:12.4f}")
    
    return best_model, scaler, results_df

if __name__ == '__main__':
    model, scaler, results = optimize_forecasting_model()