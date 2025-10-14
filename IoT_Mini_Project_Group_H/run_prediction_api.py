from flask import Flask, jsonify
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'sensor_data', 'sensor'))

app = Flask(__name__)

@app.route('/predict', methods=['POST', 'GET'])
def predict():
    try:
        from prediction_model import optimize_forecasting_model
        optimize_forecasting_model()
        
        import json
        results_path = os.path.join(os.path.dirname(__file__), 'sensor_data', 'sensor', 'prediction_results.json')
        with open(results_path, 'r') as f:
            results = json.load(f)
        
        return jsonify({'success': True, 'data': results})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
