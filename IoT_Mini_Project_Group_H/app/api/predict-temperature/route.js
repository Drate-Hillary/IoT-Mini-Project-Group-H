import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = process.env.PREDICTION_API_URL;
    
    if (!apiUrl) {
      return NextResponse.json({ 
        error: 'Prediction service not configured' 
      }, { status: 500 });
    }
    
    // Add https:// if missing
    let predictionUrl = apiUrl;
    if (!predictionUrl.startsWith('http://') && !predictionUrl.startsWith('https://')) {
      predictionUrl = `https://${predictionUrl}`;
    }
    
    const response = await fetch(`${predictionUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      return NextResponse.json({ 
        error: 'Failed to fetch prediction results' 
      }, { status: 500 });
    }

    const result = await response.json();
    
    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || 'Prediction failed' 
      }, { status: 500 });
    }
    
    return NextResponse.json(result.data);
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to load prediction results',
      details: error.message 
    }, { status: 500 });
  }
}
