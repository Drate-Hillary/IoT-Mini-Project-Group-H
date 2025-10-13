import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

supabase: Client = create_client(supabase_url, supabase_key)
response = supabase.table('sensor_data').select('*').limit(1).execute()

if response.data:
    print("Available columns in Supabase:")
    print(response.data[0].keys())
    print("\nSample data:")
    print(response.data[0])
else:
    print("No data found")
