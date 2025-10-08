import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const city = 'Kampala';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    return NextResponse.json({
      temp: data.main.temp,
      humidity: data.main.humidity,
      location: data.name
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json({ temp: 0, humidity: 0, location: 'N/A' }, { status: 500 });
  }
}
