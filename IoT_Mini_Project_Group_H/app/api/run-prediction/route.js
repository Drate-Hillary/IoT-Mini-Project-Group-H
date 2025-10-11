import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST() {
  try {
    const pythonScript = path.join(process.cwd(), 'sensor_data', 'sensor', 'prediction_model.py');
    
    return new Promise((resolve) => {
      const python = spawn('python', [pythonScript]);
      let output = '';
      let errorOutput = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      python.on('close', (code) => {
        if (code !== 0) {
          resolve(NextResponse.json({ 
            success: false, 
            error: 'Python script failed', 
            details: errorOutput 
          }, { status: 500 }));
          return;
        }

        resolve(NextResponse.json({ 
          success: true, 
          message: 'Prediction model executed successfully'
        }));
      });
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to run prediction model'
    }, { status: 500 });
  }
}
