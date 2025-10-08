import time
import os
import json
import sys
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env"))

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def count_db_entries():
    try:
        response = supabase.table("sensor_data").select("*", count="exact").execute()
        return response.count
    except Exception as e:
        return None

def get_max_entry_id():
    try:
        response = supabase.table("sensor_data").select("entry_id").order("entry_id", desc=True).limit(1).execute()
        return response.data[0]['entry_id'] if response.data else None
    except Exception as e:
        return None

def fetch_all_db_data():
    try:
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
        
        print(f"Total entries fetched: {len(all_data)}")
        return all_data
    except Exception as e:
        return None

def monitor_db_updates(interval=30):
    print(f"Monitoring database for updates every {interval} seconds...")
    last_count = 0
    
    while True:
        data = fetch_all_db_data()
        
        if data is not None:
            current_count = len(data)
            if current_count != last_count:
                print(f"\n✓ Data updated! New total: {current_count} records")
                print(f"Latest entry: {data[-1]}")
                last_count = current_count
        
        time.sleep(interval)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == '--json':
        data = fetch_all_db_data()
        if data is not None:
            print(json.dumps(data))
    elif len(sys.argv) > 1 and sys.argv[1] == '--count':
        count = count_db_entries()
        max_id = get_max_entry_id()
        if count is not None:
            print(f"Total entries in database: {count}")
            print(f"Highest entry_id: {max_id}")
            print(f"Missing entries: {max_id - count if max_id else 0}")
    else:
        monitor_db_updates()
