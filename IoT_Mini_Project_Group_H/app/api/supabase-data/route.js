import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    let allData = [];
    let from = 0;
    const limit = 1000;
    
    while (true) {
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .order('entry_id', { ascending: true })
        .range(from, from + limit - 1);
      
      if (error) throw error;
      if (!data || data.length === 0) break;
      
      allData = [...allData, ...data];
      if (data.length < limit) break;
      from += limit;
    }
    
    return NextResponse.json(allData);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
