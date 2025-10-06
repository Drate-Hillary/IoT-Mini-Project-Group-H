import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock data - replace with actual Supabase integration
    const sensorData = {
      temperature: 24.5,
      humidity: 68,
      battery_voltage: 3.07,
      motion_counts: 155,
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(sensorData)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sensor data' }, { status: 500 })
  }
}