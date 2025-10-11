import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const imagePath = path.join(process.cwd(), 'sensor_data', 'sensor', 'temperature_forecast.png');
    
    if (!fs.existsSync(imagePath)) {
      return NextResponse.json({ 
        error: 'Image not found. Please run prediction first.' 
      }, { status: 404 });
    }

    const imageBuffer = fs.readFileSync(imagePath);
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="temperature_forecast.png"',
      },
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to download image',
      details: error.message 
    }, { status: 500 });
  }
}
