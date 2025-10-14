import json
import os
import time
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env"))

def calculate_and_save_averages():
    try:
        supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
        supabase_key = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
        
        if not supabase_url or not supabase_key:
            print("Error: Supabase credentials not found")
            return None
        
        supabase: Client = create_client(supabase_url, supabase_key)
        response = supabase.table('sensor_data').select('*').order('timestamp', desc=True).limit(8000).execute()
        
        feeds = response.data
        
        if not feeds:
            print("No data available")
            return None
        
        # Calculate averages
        temps = [float(f['temperature']) for f in feeds if f.get('temperature') is not None]
        humidities = [float(f['humidity']) for f in feeds if f.get('humidity') is not None]
        batteries = [float(f['battery_voltage']) for f in feeds if f.get('battery_voltage') is not None]
        motions = [int(f['motion_counts']) for f in feeds if f.get('motion_counts') is not None]  
        
        avg_temp = sum(temps) / len(temps) if temps else 0
        avg_humidity = sum(humidities) / len(humidities) if humidities else 0
        avg_battery = sum(batteries) / len(batteries) if batteries else 0
        avg_motion = sum(motions) / len(motions) if motions else 0
        
        # Save to file
        summary = {
            'timestamp': datetime.now().isoformat(),
            'average_temperature': round(avg_temp, 2),
            'average_humidity': round(avg_humidity, 2),
            'average_battery': round(avg_battery, 2),
            'average_motion': round(avg_motion, 2)
        }
        
        with open('average_summary.json', 'w') as f:
            json.dump(summary, f, indent=2)
        
        print(f"Averages calculated and saved:")
        print(f"Temperature: {avg_temp:.2f}C")
        print(f"Humidity: {avg_humidity:.2f}%")
        print(f"Battery: {avg_battery:.2f}V")
        print(f"Motion: {avg_motion:.2f}")
        
        return summary
            
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    print("Starting average summary calculator...")
    print("Calculating averages every 60 seconds...")
    
    while True:
        calculate_and_save_averages()
        time.sleep(60)  # Update every 60 seconds

