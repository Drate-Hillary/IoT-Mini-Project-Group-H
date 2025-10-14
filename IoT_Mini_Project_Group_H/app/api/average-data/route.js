import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        average_temperature: 0,
        average_humidity: 0,
        average_battery: 0,
        average_motion: 0,
      })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const { data, error } = await supabase
      .from('sensor_data')
      .select('temperature, humidity, battery_voltage, motion_counts')
      .order('entry_id', { ascending: false })
      .limit(1000)

    if (error || !data || data.length === 0) {
      return NextResponse.json({
        average_temperature: 0,
        average_humidity: 0,
        average_battery: 0,
        average_motion: 0,
      })
    }

    const temps = data.filter(d => d.temperature != null).map(d => parseFloat(d.temperature))
    const humidities = data.filter(d => d.humidity != null).map(d => parseFloat(d.humidity))
    const batteries = data.filter(d => d.battery_voltage != null).map(d => parseFloat(d.battery_voltage))
    const motions = data.filter(d => d.motion_counts != null).map(d => parseInt(d.motion_counts))

    const avg_temp = temps.length > 0 ? temps.reduce((a, b) => a + b, 0) / temps.length : 0
    const avg_humidity = humidities.length > 0 ? humidities.reduce((a, b) => a + b, 0) / humidities.length : 0
    const avg_battery = batteries.length > 0 ? batteries.reduce((a, b) => a + b, 0) / batteries.length : 0
    const avg_motion = motions.length > 0 ? motions.reduce((a, b) => a + b, 0) / motions.length : 0

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      average_temperature: parseFloat(avg_temp.toFixed(2)),
      average_humidity: parseFloat(avg_humidity.toFixed(2)),
      average_battery: parseFloat(avg_battery.toFixed(2)),
      average_motion: parseFloat(avg_motion.toFixed(2)),
    })
  } catch (error) {
    console.error('Error calculating averages:', error)
    return NextResponse.json({
      average_temperature: 0,
      average_humidity: 0,
      average_battery: 0,
      average_motion: 0,
    })
  }
}
