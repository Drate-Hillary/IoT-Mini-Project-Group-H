from django.shortcuts import render
from django.http import JsonResponse
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

def index(request):
    return render(request, 'react_index.html')

def sensor_data_api(request):
    try:
        SUPABASE_URL = os.getenv("SUPABASE_URL") 
        SUPABASE_KEY = os.getenv("SUPABASE_KEY")
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        result = supabase.table("sensor_data").select("*").order("entry_id", desc=True).limit(1).execute()
        
        if result.data:
            return JsonResponse(result.data[0])
        else:
            return JsonResponse({'error': 'No data found'})
    except Exception as e:
        return JsonResponse({'error': str(e)})