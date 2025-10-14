import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase credentials');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    
    // If limit is specified, fetch only recent records
    if (limitParam) {
      const limit = parseInt(limitParam);
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .order('entry_id', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return NextResponse.json(data.reverse());
    }
    
    // Otherwise fetch all data (for table view)
    let allData = [];
    let from = 0;
    const batchLimit = 1000;
    
    while (true) {
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .order('entry_id', { ascending: true })
        .range(from, from + batchLimit - 1);
      
      if (error) throw error;
      if (!data || data.length === 0) break;
      
      allData = [...allData, ...data];
      if (data.length < batchLimit) break;
      from += batchLimit;
    }
    
    return NextResponse.json(allData);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
