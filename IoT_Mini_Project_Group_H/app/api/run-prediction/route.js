import { NextResponse } from 'next/server';

export async function POST() {
  try {
    let apiUrl = process.env.PREDICTION_API_URL;
    
    if (!apiUrl) {
      return NextResponse.json({ 
        success: false, 
        error: 'Prediction service not configured. Set PREDICTION_API_URL in Vercel.' 
      }, { status: 500 });
    }
    
    // Add https:// if missing
    if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
      apiUrl = `https://${apiUrl}`;
    }
    
    const response = await fetch(`${apiUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Prediction service failed');
    }

    const result = await response.json();
    
    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Prediction completed successfully',
      data: result.data
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
