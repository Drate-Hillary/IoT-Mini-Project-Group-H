import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';

export async function GET() {
  try {
    const jsonPath = path.join(process.cwd(), 'sensor_data', 'sensor', 'prediction_results.json');
    
    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json({ error: 'Prediction results not found' }, { status: 404 });
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const metrics = data.metrics;

    const doc = new jsPDF();
    let y = 20;

    // Title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Temperature Prediction Report', 105, y, { align: 'center' });
    y += 15;

    // Data Overview
    doc.setFontSize(14);
    doc.text('DATA OVERVIEW', 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Total samples: ${metrics.total_samples}`, 20, y);
    y += 6;
    doc.text(`Temperature range: ${metrics.temp_min?.toFixed(2)} - ${metrics.temp_max?.toFixed(2)}°C`, 20, y);
    y += 6;
    doc.text(`Temperature mean: ${metrics.data_mean?.toFixed(2)}°C`, 20, y);
    y += 6;
    doc.text(`Temperature std: ${metrics.data_std?.toFixed(2)}°C`, 20, y);
    y += 12;

    // Final Sample Sizes
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('FINAL SAMPLE SIZES', 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Train: ${metrics.train_samples} samples`, 20, y);
    y += 6;
    doc.text(`Val: ${metrics.val_samples} samples`, 20, y);
    y += 6;
    doc.text(`Test: ${metrics.test_samples} samples`, 20, y);
    y += 12;

    // Test Performance
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('FINAL TEST SET PERFORMANCE', 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Test RMSE: ${metrics.test_rmse?.toFixed(4)}°C`, 20, y);
    y += 6;
    doc.text(`Test MAE: ${metrics.test_mae?.toFixed(4)}°C`, 20, y);
    y += 6;
    doc.text(`Test R²: ${metrics.test_r2?.toFixed(4)}`, 20, y);
    y += 6;
    doc.text(`Train Mean: ${metrics.train_mean?.toFixed(2)}°C`, 20, y);
    y += 6;
    doc.text(`Train Std Dev: ${metrics.train_std?.toFixed(2)}°C`, 20, y);
    y += 12;

    // Interpretation
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('INTERPRETATION', 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const r2 = metrics.test_r2;
    let interpretation = '';
    if (r2 > 0.95) interpretation = '[EXCELLENT] Excellent predictions!';
    else if (r2 > 0.85) interpretation = '[GOOD] Good predictions';
    else if (r2 > 0.4) interpretation = '[MODERATE] Moderate predictions';
    else if (r2 > 0.2) interpretation = '[WEAK] Weak but useful predictions';
    else if (r2 > 0) interpretation = '[WEAK] Very weak predictions';
    else interpretation = '[POOR] Poor predictions';
    doc.text(interpretation, 20, y);
    y += 6;
    doc.text(`On average, predictions are off by ±${metrics.test_mae?.toFixed(2)}°C`, 20, y);
    y += 6;
    const variation = ((metrics.test_mae / metrics.train_std) * 100).toFixed(1);
    doc.text(`This is ${variation}% of the temperature variation`, 20, y);
    y += 12;

    // Next Temperature Prediction
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('NEXT TEMPERATURE PREDICTION', 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Current Temperature: ${metrics.next_prediction?.current_temp?.toFixed(2)}°C`, 20, y);
    y += 6;
    doc.text(`Predicted Next Temp: ${metrics.next_prediction?.predicted_temp?.toFixed(2)}°C`, 20, y);
    y += 6;
    const change = metrics.next_prediction?.temp_change >= 0 ? '+' : '';
    doc.text(`Expected Change: ${change}${metrics.next_prediction?.temp_change?.toFixed(2)}°C`, 20, y);

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="temperature_prediction_report.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
