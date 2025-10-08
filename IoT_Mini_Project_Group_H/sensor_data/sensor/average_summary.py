import requests
import json
from datetime import datetime

THINGSPEAK_CHANNEL_ID = "3085407"

def calculate_and_save_averages():
    try:
        url = f"https://api.thingspeak.com/channels/{THINGSPEAK_CHANNEL_ID}/feeds.json?results=8000"
        response = requests.get(url, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            feeds = data.get('feeds', [])
            
            if not feeds:
                print("No data available")
                return
            
            # Calculate averages
            temps = [float(f['field5']) for f in feeds if f.get('field5')]
            humidities = [float(f['field3']) for f in feeds if f.get('field3')]
            batteries = [float(f['field1']) for f in feeds if f.get('field1')]
            
            avg_temp = sum(temps) / len(temps) if temps else 0
            avg_humidity = sum(humidities) / len(humidities) if humidities else 0
            avg_battery = sum(batteries) / len(batteries) if batteries else 0
            
            # Save to file
            summary = {
                'timestamp': datetime.now().isoformat(),
                'total_readings': len(feeds),
                'average_temperature': round(avg_temp, 2),
                'average_humidity': round(avg_humidity, 2),
                'average_battery': round(avg_battery, 2)
            }
            
            with open('average_summary.json', 'w') as f:
                json.dump(summary, f, indent=2)
            
            print(f"Averages calculated and saved:")
            print(f"Temperature: {avg_temp:.2f}°C")
            print(f"Humidity: {avg_humidity:.2f}%")
            print(f"Battery: {avg_battery:.2f}V")
            
            return summary
        else:
            print(f"Error fetching data: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"Error: {e}")
        return None

