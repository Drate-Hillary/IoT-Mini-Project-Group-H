import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'sensor_data', 'sensor', 'average_summary.json')
    const fileData = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileData)
    
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read average data' },
      { status: 500 }
    )
  }
}
