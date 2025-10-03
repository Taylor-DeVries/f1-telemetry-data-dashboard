import { NextRequest, NextResponse } from 'next/server';
import csv from 'csv-parser';
import { Readable } from 'stream';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to stream
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stream = Readable.fromWeb(file.stream() as any);
    
    // Parse CSV
    const results: Record<string, string>[] = [];
    const columns: string[] = [];
    
    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('headers', (headers: string[]) => {
          columns.push(...headers);
        })
        .on('data', (data: Record<string, string>) => {
          results.push(data);
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Convert to the format expected by frontend
    const dataDict: Record<string, Record<string, number>> = {};
    
    // Initialize data structure
    columns.forEach(col => {
      dataDict[col] = {};
    });

    // Fill data
    results.forEach((row, index) => {
      columns.forEach(col => {
        const value = parseFloat(row[col]);
        if (!isNaN(value)) {
          dataDict[col][index.toString()] = value;
        }
      });
    });

    // Get head data (first 50 rows)
    const headData: Record<string, Record<string, number>> = {};
    columns.forEach(col => {
      headData[col] = {};
      for (let i = 0; i < Math.min(50, results.length); i++) {
        const value = parseFloat(results[i][col]);
        if (!isNaN(value)) {
          headData[col][i.toString()] = value;
        }
      }
    });

    return NextResponse.json({
      columns,
      head: headData,
      full_data: dataDict
    });

  } catch (error) {
    console.error('Error processing CSV:', error);
    return NextResponse.json(
      { error: 'Failed to process CSV file' },
      { status: 500 }
    );
  }
}
