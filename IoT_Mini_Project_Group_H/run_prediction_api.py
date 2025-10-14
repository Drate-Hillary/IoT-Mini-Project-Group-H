from flask import Flask, jsonify
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'sensor_data', 'sensor'))

app = Flask(__name__)

@app.route('/predict', methods=['POST', 'GET'])
def predict():
    try:
        from datetime import datetime
        import json
        
        start_time = datetime.now()
        print(f"[{start_time}] Starting prediction...")
        
        from prediction_model import optimize_forecasting_model
        
        print("Running optimization...")
        result = optimize_forecasting_model()
        
        if result is None:
            print("ERROR: Prediction model returned None")
            return jsonify({'success': False, 'error': 'Prediction model returned None'}), 500
        
        results_path = os.path.join(os.path.dirname(__file__), 'sensor_data', 'sensor', 'prediction_results.json')
        
        print(f"Reading results from: {results_path}")
        if not os.path.exists(results_path):
            print(f"ERROR: Results file not found at {results_path}")
            return jsonify({'success': False, 'error': 'Results file not found'}), 500
            
        with open(results_path, 'r') as f:
            results = json.load(f)
        
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        print(f"[{end_time}] Prediction completed successfully in {duration:.2f} seconds")
        print(f"Total samples: {results.get('metrics', {}).get('total_samples', 'N/A')}")
        print(f"Test R²: {results.get('metrics', {}).get('test_r2', 'N/A')}")
        
        # Add timestamp to response
        results['prediction_timestamp'] = end_time.isoformat()
        
        return jsonify({'success': True, 'data': results})
    except Exception as e:
        print(f"ERROR in prediction: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e), 'type': type(e).__name__}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
