import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'sensor_data', 'sensor', 'average_summary.json')
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        average_temperature: 0,
        average_humidity: 0,
        average_battery: 0,
        average_motion: 0,
      })
    }
    
    const fileData = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileData)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading average data:', error)
    return NextResponse.json({
      average_temperature: 0,
      average_humidity: 0,
      average_battery: 0,
      average_motion: 0,
    })
  }
}
