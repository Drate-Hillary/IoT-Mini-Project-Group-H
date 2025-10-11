import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const resultsPath = path.join(process.cwd(), 'sensor_data', 'sensor', 'prediction_results.json');
    
    if (!fs.existsSync(resultsPath)) {
      return NextResponse.json({ 
        error: 'Prediction results not found. Please run prediction_model.py first.' 
      }, { status: 404 });
    }

    const data = fs.readFileSync(resultsPath, 'utf8');
    const results = JSON.parse(data);
    
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to load prediction results',
      details: error.message 
    }, { status: 500 });
  }
}
