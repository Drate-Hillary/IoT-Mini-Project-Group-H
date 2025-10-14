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
    
    console.log('Calling prediction service:', `${apiUrl}/predict`);
    
    const response = await fetch(`${apiUrl}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Prediction service error:', errorText);
      return NextResponse.json({ 
        success: false, 
        error: `Prediction service failed: ${response.status}`,
        details: errorText
      }, { status: 500 });
    }

    const result = await response.json();
    
    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        error: result.error || 'Prediction failed'
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Prediction completed successfully',
      data: result.data
    });
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
