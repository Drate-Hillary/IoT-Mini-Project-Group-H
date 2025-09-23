import paho.mqtt.client as mqtt
import json
from datetime import datetime, timedelta
import time
import os
import requests
import json

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
            entry_id = response.text
            print(f"Data sent to ThingSpeak successfully! Entry ID: {entry_id}")
            return True
        else:
            print(f"Error sending to ThingSpeak. Status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"Exception occurred while sending to ThingSpeak: {e}")
        return False

# Fetch Historical Data and send to ThingSpeak
def get_historical_sensor_data():
    app_id = "bd-test-app2"
    api_key = "NNSXS.NGFSXX4UXDX55XRIDQZS6LPR4OJXKIIGSZS56CQ.6O4WUAUHFUAHSTEYRWJX6DDO7TL2IBLC7EV2LS4EHWZOOEPCEUOA"
    url = f"https://{broker}/api/v3/as/applications/{app_id}/devices/{device_id}/packages/storage/uplink_message"

    # Set authorization header
    headers = {"Authorization": f"Bearer {api_key}"}
    params = {
        "last": "12h"  # get messages from last 12 hours. Max 48 hours. Possible values: 12m (12 minutes)
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
                    
                    # Display data to terminal
                    if any([battery_voltage, humidity, motion_counts, temperature]):
                        timestamp = reading.get('received_at', 'Unknown')
                        print(f"[{timestamp}] Historical - Temp: {temperature}°C, Humidity: {humidity}%, Battery: {battery_voltage}V, Motion: {motion_counts}")
                        send_to_thingspeak(battery_voltage, humidity, motion_counts, temperature)
                        time.sleep(15)  # ThingSpeak free account requires 15 seconds between updates
                        
            except Exception as e:
                print(f"Error processing historical reading: {e}")
        
        print("Historical data processed and sent to ThingSpeak")
        return True
    else:
        print("Error:", response.status_code, response.text)
        return None

# Get historical data (optional - you might want to comment this out if you only want real-time data)
get_historical_sensor_data()

# Listen for instant notifications
topic = f"v3/{username}/devices/{device_id}/up"  # Topic for uplink messages automatically create by TTN for each sensor/device in your app

# Callback: When connected to broker
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to TTN MQTT broker!")
        client.subscribe(topic)  # Subscribe to uplink topic
        # Reset retry delay on successful connection
        client.retry_delay = 5
    else:
        print(f"Failed to connect, return code {rc}")
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
        
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] Real-time - Temp: {temperature}°C, Humidity: {humidity}%, Battery: {battery_voltage}V, Motion: {motion_counts}")
        
        # Send to ThingSpeak
        if send_to_thingspeak(battery_voltage, humidity, motion_counts, temperature):
            print("Real-time data sent to ThingSpeak successfully!")
        else:
            print("Failed to send real-time data to ThingSpeak")
            
    except Exception as e:
        print(f"Error processing real-time message: {e}")

# Set up MQTT client
client = mqtt.Client(callback_api_version=2)
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