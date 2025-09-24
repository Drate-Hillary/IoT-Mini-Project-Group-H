import paho.mqtt.client as mqtt
import json
from datetime import datetime, timedelta
import time
import os
from dotenv import load_dotenv
import requests
from supabase import create_client, Client
import csv

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env"))

# Configuration
broker = "eu1.cloud.thethings.network"  # The MQTT Broker URL
port = 1883  # Use 1883 for unencrypted, 8883 for TLS
username = "bd-test-app2@ttn"  # The TTN application ID
password = "NNSXS.NGFSXX4UXDX55XRIDQZS6LPR4OJXKIIGSZS56CQ.6O4WUAUHFUAHSTEYRWJX6DDO7TL2IBLC7EV2LS4EHWZOOEPCEUOA"  # The TTN API key
device_id = "lht65n-01-temp-humidity-sensor"  # The sensor

# Store last sent values to avoid duplicates
last_sent_data = {'field1': None, 'field3': None, 'field4': None, 'field5': None}

# ThingSpeak Configuration
THINGSPEAK_API_KEY = "GDNDTI8C2SCM8KRK"
THINGSPEAK_URL = "https://api.thingspeak.com/update"
THINGSPEAK_CHANNEL_ID = "3085407"

# Supabase Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL") 
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Function to check if data has changed significantly
def data_has_changed(field1, field3, field4, field5, threshold=0.1):
    """Check if sensor data has changed significantly from last sent values"""
    global last_sent_data
    
    # Always send if this is the first reading
    if last_sent_data['field1'] is None:
        return True
    
    # Check for significant changes (temperature/humidity threshold, any motion change)
    temp_change = abs(field5 - last_sent_data['field5']) > threshold if last_sent_data['field5'] else True
    humidity_change = abs(field3 - last_sent_data['field3']) > threshold if last_sent_data['field3'] else True
    motion_change = field4 != last_sent_data['field4']
    battery_change = abs(field1 - last_sent_data['field1']) > 0.05 if last_sent_data['field1'] else True
    
    return temp_change or humidity_change or motion_change or battery_change

# Function to send data to ThingSpeak
def send_to_thingspeak(field1, field3, field4, field5):
    """
    Send sensor data to ThingSpeak channel
    field1: Battery Voltage
    field3: Humidity
    field4: Motion Counts
    field5: Temperature (in Celsius)
    """
    params = {
        'api_key': THINGSPEAK_API_KEY,
        'field1': field1,
        'field3': field3,
        'field4': field4,
        'field5': field5
    }
    
    try:
        response = requests.get(THINGSPEAK_URL, params=params)
        if response.status_code == 200:
            entry_id = int(response.text.strip())
            print(f"Data sent to ThingSpeak successfully! Entry ID: {entry_id}")
            return entry_id
        else:
            print(f"Error sending to ThingSpeak. Status code: {response.status_code}")
            return None
    except Exception as e:
        print(f"Exception occurred while sending to ThingSpeak: {e}")
        return False

# Function to fetch all ThingSpeak data and save to CSV
def fetch_thingspeak_to_csv():
    try:
        url = f"https://api.thingspeak.com/channels/{THINGSPEAK_CHANNEL_ID}/feeds.json?results=8000"
        response = requests.get(url, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            feeds = data.get('feeds', [])
            
            print(f"Found {len(feeds)} historical entries in ThingSpeak")
            
            # Write to CSV file
            with open('thingspeak_historical_data.csv', 'w', newline='') as csvfile:
                fieldnames = ['entry_id', 'timestamp', 'battery_voltage', 'humidity', 'motion_counts', 'temperature']
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                
                writer.writeheader()
                
                for feed in feeds:
                    writer.writerow({
                        'entry_id': feed['entry_id'],
                        'timestamp': feed['created_at'],
                        'battery_voltage': feed['field1'] or 0,
                        'humidity': feed['field3'] or 0,
                        'motion_counts': feed['field4'] or 0,
                        'temperature': feed['field5'] or 0
                    })
            
            print("All ThingSpeak historical data saved to thingspeak_historical_data.csv")
            return True
        else:
            print(f"Error fetching ThingSpeak data: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"Error saving ThingSpeak data to CSV: {e}")
        return False

# Function to fetch all historical data from ThingSpeak
def fetch_thingspeak_to_supabase():
    try:
        # Get all data from ThingSpeak (8000 entries max per request)
        url = f"https://api.thingspeak.com/channels/{THINGSPEAK_CHANNEL_ID}/feeds.json?results=8000"
        response = requests.get(url, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            feeds = data.get('feeds', [])
            
            print(f"Found {len(feeds)} historical entries in ThingSpeak")
            
            for feed in feeds:
                entry_id = int(feed['entry_id'])
                battery_voltage = float(feed['field1']) if feed['field1'] else 0
                humidity = float(feed['field3']) if feed['field3'] else 0
                motion_counts = int(feed['field4']) if feed['field4'] else 0
                temperature = float(feed['field5']) if feed['field5'] else 0
                timestamp = feed['created_at']
                
                # Store in Supabase
                store_in_supabase(entry_id, battery_voltage, humidity, motion_counts, temperature, timestamp, "historical")
                
            print("All ThingSpeak historical data transferred to Supabase")
            return True
        else:
            print(f"Error fetching ThingSpeak data: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"Error transferring ThingSpeak data: {e}")
        return False

# Function to store data in Supabase with Entry ID as primary key
def store_in_supabase(entry_id, battery_voltage, humidity, motion_counts, temperature, timestamp, data_type="real-time"):
    try:
        data = {
            "entry_id": entry_id,
            "battery_voltage": battery_voltage,
            "humidity": humidity,
            "motion_counts": motion_counts,
            "temperature": temperature,
            "timestamp": timestamp,
            "data_type": data_type
        }
        
        result = supabase.table("sensor_data").upsert(data).execute()
        print(f"Data stored in Supabase successfully! Entry ID: {entry_id}")
        return True
    except Exception as e:
        print(f"Error storing data in Supabase: {e}")
        return False

# Fetch Historical Data and send to ThingSpeak
def get_historical_sensor_data():
    app_id = "bd-test-app2"
    api_key = "NNSXS.NGFSXX4UXDX55XRIDQZS6LPR4OJXKIIGSZS56CQ.6O4WUAUHFUAHSTEYRWJX6DDO7TL2IBLC7EV2LS4EHWZOOEPCEUOA"
    url = f"https://{broker}/api/v3/as/applications/{app_id}/devices/{device_id}/packages/storage/uplink_message"

    # Set authorization header
    headers = {"Authorization": f"Bearer {api_key}"}
    params = {
        "last": "48h"  # get maximum historical data (48 hours)
    }
    
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        try:
            # Clean the response text and try to parse JSON
            response_text = response.text.strip()
            
            # Save raw response to file for debugging
            with open("message_history.json", "w") as f:
                f.write(response_text)
            
            # Try to parse JSON - handle potential multiple JSON objects
            lines = response_text.split('\n')
            if lines:
                # Take only the first line if multiple JSON objects exist
                first_json_line = lines[0]
                response_data = json.loads(first_json_line)
            else:
                response_data = json.loads(response_text)
                
        except json.JSONDecodeError as e:
            print(f"JSON decode error: {e}")
            print(f"Response text (first 500 chars): {response.text[:500]}")
            return None
        
        # Process and send historical data to ThingSpeak
        # Parse each line as a separate JSON object
        lines = response_text.split('\n')
        for line in lines:
            line = line.strip()
            if not line:
                continue
            try:
                line_data = json.loads(line)
                if 'result' in line_data:
                    reading = line_data['result']
                    
                    # Extract sensor data from the reading
                    uplink_message = reading.get('uplink_message', {})
                    decoded_payload = uplink_message.get('decoded_payload', {})
                    
                    # Extract fields
                    battery_voltage = decoded_payload.get('field1', 0)
                    humidity = decoded_payload.get('field3', 0)
                    motion_counts = decoded_payload.get('field4', 0)
                    temperature = decoded_payload.get('field5', 0)
                    
                    # Store all historical data in Supabase
                    if any([battery_voltage, humidity, motion_counts, temperature]):
                        timestamp = reading.get('received_at', datetime.now().isoformat())
                        print(f"[{timestamp}] Historical - Temp: {temperature}°C, Humidity: {humidity}%, Battery: {battery_voltage}V, Motion: {motion_counts}")
                        
                        # Send to ThingSpeak and get Entry ID
                        entry_id = send_to_thingspeak(battery_voltage, humidity, motion_counts, temperature)
                        
                        if entry_id:
                            # Store in Supabase with Entry ID as primary key
                            store_in_supabase(entry_id, battery_voltage, humidity, motion_counts, temperature, timestamp, "historical")
                        
                        time.sleep(15)  # ThingSpeak rate limit
                        
            except Exception as e:
                print(f"Error processing historical reading: {e}")
        
        print("Historical data processed and sent to ThingSpeak")
        return True
    else:
        print("Error:", response.status_code, response.text)
        return None

# Fetch all historical data from ThingSpeak to CSV
print("Fetching all historical data from ThingSpeak to CSV...")
fetch_thingspeak_to_csv()

# Listen for instant notifications
topic = f"v3/{username}/devices/{device_id}/up"  # Topic for uplink messages automatically create by TTN for each sensor/device in your app

# Callback: When connected to broker
def on_connect(client, userdata, flags, reasonCode, properties):
    if reasonCode == 0:
        print("Connected to TTN MQTT broker!")
        client.subscribe(topic)  # Subscribe to uplink topic
        # Reset retry delay on successful connection
        client.retry_delay = 5
    else:
        print(f"Failed to connect, return code {reasonCode}")
        retry_delay = getattr(client, 'retry_delay', 5)
        print(f"Reconnect failed, retrying in {retry_delay} seconds...")
        time.sleep(retry_delay)
        # Exponential backoff with max 300 seconds (5 minutes)
        client.retry_delay = min(retry_delay * 2, 300)

# Callback: When a message is received
def on_message(client, userdata, msg):
    print(f"Message received on topic {msg.topic}")
    
    payload = json.loads(msg.payload.decode())
    
    # Save raw message to file
    with open("message.json", "w") as f:
        f.write(json.dumps(payload, indent=4))
    
    try:
        # Extract sensor data from the payload
        uplink_message = payload.get('uplink_message', {})
        decoded_payload = uplink_message.get('decoded_payload', {})
        
        # Extract the specific fields (adjust field names based on your actual payload)
        battery_voltage = decoded_payload.get('field1', 0)
        humidity = decoded_payload.get('field3', 0)
        motion_counts = decoded_payload.get('field4', 0)
        temperature = decoded_payload.get('field5', 0)
        
        timestamp = datetime.now().isoformat()
        print(f"[{timestamp}] Real-time - Temp: {temperature}°C, Humidity: {humidity}%, Battery: {battery_voltage}V, Motion: {motion_counts}")
        
        # Send to ThingSpeak and get Entry ID
        entry_id = send_to_thingspeak(battery_voltage, humidity, motion_counts, temperature)
        
        if entry_id:
            # Store in Supabase with Entry ID as primary key
            store_in_supabase(entry_id, battery_voltage, humidity, motion_counts, temperature, timestamp, "real-time")
            print("Real-time data sent to ThingSpeak and stored in Supabase successfully!")
        else:
            print("Failed to send real-time data to ThingSpeak")
            
    except Exception as e:
        print(f"Error processing real-time message: {e}")

# Set up MQTT client
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.username_pw_set(username, password)
client.on_connect = on_connect
client.on_message = on_message

# Connect to broker and start loop
try:
    client.connect(broker, port, 60)
    print("Starting MQTT client loop...")
    client.loop_forever()
except KeyboardInterrupt:
    print("Disconnecting from MQTT broker...")
    client.disconnect()
except Exception as e:
    print(f"Error in MQTT connection: {e}")