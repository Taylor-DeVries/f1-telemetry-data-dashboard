import { NextRequest, NextResponse } from 'next/server';

interface CarParameters {
  max_speed: number;
  max_rpm: number;
  lap_time: number;
  track_name: string;
  driver_style: string;
  driver_id?: string;
  track_id?: string;
}

export async function POST(request: NextRequest) {
  try {
    const params: CarParameters = await request.json();
    
    // Calculate number of data points (10Hz sampling rate)
    const numPoints = Math.floor(params.lap_time * 10);
    const time = Array.from({ length: numPoints }, (_, i) => (i / (numPoints - 1)) * params.lap_time);
    
    // Driver style multipliers
    const styleFactors = {
      aggressive: { brakeLate: 0.9, throttleEarly: 1.1, speedVar: 1.2 },
      balanced: { brakeLate: 1.0, throttleEarly: 1.0, speedVar: 1.0 },
      smooth: { brakeLate: 1.1, throttleEarly: 0.9, speedVar: 0.8 }
    };
    const style = styleFactors[params.driver_style as keyof typeof styleFactors] || styleFactors.balanced;
    
    // Generate speed profile with corners
    const speed: number[] = [];
    for (let i = 0; i < numPoints; i++) {
      const lapProgress = i / numPoints;
      const cornerFactor = 1 - 0.5 * Math.abs(Math.sin(lapProgress * 12)); // 4 corners per sector * 3 sectors
      let speedValue = params.max_speed * cornerFactor * (0.3 + 0.7 * cornerFactor);
      // Add some noise
      speedValue += (Math.random() - 0.5) * 4 * style.speedVar;
      speed.push(Math.max(50, Math.min(params.max_speed, speedValue)));
    }
    
    // Throttle and brake based on speed changes
    const throttle: number[] = new Array(numPoints).fill(0);
    const brake: number[] = new Array(numPoints).fill(0);
    
    for (let i = 1; i < numPoints; i++) {
      const speedChange = speed[i] - speed[i - 1];
      if (speedChange > 0) {
        throttle[i] = Math.min(1.0, (speedChange + 2) / 10 * style.throttleEarly);
        brake[i] = 0;
      } else {
        brake[i] = Math.min(1.0, Math.abs(speedChange) / 15 * style.brakeLate);
        throttle[i] = Math.max(0, 0.3 - brake[i]);
      }
    }
    
    // Gear calculation based on speed (F1 cars have 8 gears)
    const numGears = 8;
    const gear: number[] = [];
    for (let i = 0; i < numPoints; i++) {
      const gearRaw = 1 + (speed[i] / params.max_speed) * (numGears - 1);
      gear.push(Math.max(1, Math.min(numGears, Math.floor(gearRaw))));
    }
    
    // RPM based on gear and speed
    const rpm: number[] = [];
    for (let i = 0; i < numPoints; i++) {
      const rpmBase = (speed[i] / params.max_speed) * params.max_rpm;
      const gearFactor = gear[i] / numGears;
      let rpmValue = rpmBase / (gearFactor + 0.3);
      rpmValue += (Math.random() - 0.5) * 200;
      rpm.push(Math.max(1000, Math.min(params.max_rpm, rpmValue)));
    }
    
    // Tire temperatures (increase with speed and braking)
    const tireTempBase = 80;
    const tireFl: number[] = [];
    const tireFr: number[] = [];
    const tireRl: number[] = [];
    const tireRr: number[] = [];
    
    let cumulativeBrake = 0;
    let cumulativeSpeed = 0;
    
    for (let i = 0; i < numPoints; i++) {
      cumulativeBrake += brake[i] * 0.5;
      cumulativeSpeed += speed[i] / 100;
      
      tireFl.push(tireTempBase + (cumulativeBrake + cumulativeSpeed) % 40);
      tireFr.push(tireTempBase + (cumulativeBrake + cumulativeSpeed) % 40 + (Math.random() - 0.5) * 4);
      tireRl.push(tireTempBase + (cumulativeBrake * 0.8 + cumulativeSpeed) % 35);
      tireRr.push(tireTempBase + (cumulativeBrake * 0.8 + cumulativeSpeed) % 35 + (Math.random() - 0.5) * 4);
    }
    
    // Create sector markers
    const sectorPoints = Math.floor(numPoints / 3);
    const sector: number[] = [];
    for (let i = 0; i < numPoints; i++) {
      if (i < sectorPoints) {
        sector.push(1);
      } else if (i < 2 * sectorPoints) {
        sector.push(2);
      } else {
        sector.push(3);
      }
    }
    
    // Convert to the format expected by frontend
    const dataDict: Record<string, Record<string, number>> = {
      time: {},
      speed: {},
      throttle: {},
      brake: {},
      gear: {},
      rpm: {},
      tire_temp_front_left: {},
      tire_temp_front_right: {},
      tire_temp_rear_left: {},
      tire_temp_rear_right: {},
      sector: {}
    };
    
    // Fill data
    for (let i = 0; i < numPoints; i++) {
      dataDict.time[i.toString()] = time[i];
      dataDict.speed[i.toString()] = speed[i];
      dataDict.throttle[i.toString()] = throttle[i];
      dataDict.brake[i.toString()] = brake[i];
      dataDict.gear[i.toString()] = gear[i];
      dataDict.rpm[i.toString()] = rpm[i];
      dataDict.tire_temp_front_left[i.toString()] = tireFl[i];
      dataDict.tire_temp_front_right[i.toString()] = tireFr[i];
      dataDict.tire_temp_rear_left[i.toString()] = tireRl[i];
      dataDict.tire_temp_rear_right[i.toString()] = tireRr[i];
      dataDict.sector[i.toString()] = sector[i];
    }
    
    // Get head data (first 50 rows)
    const headData: Record<string, Record<string, number>> = {};
    const columns = Object.keys(dataDict);
    columns.forEach(col => {
      headData[col] = {};
      for (let i = 0; i < Math.min(50, numPoints); i++) {
        headData[col][i.toString()] = dataDict[col][i.toString()];
      }
    });
    
    return NextResponse.json({
      columns,
      head: headData,
      full_data: dataDict,
      metadata: {
        track_name: params.track_name,
        max_speed: params.max_speed,
        lap_time: params.lap_time,
        driver_style: params.driver_style,
        driver_id: params.driver_id,
        track_id: params.track_id
      }
    });

  } catch (error) {
    console.error('Error generating demo data:', error);
    return NextResponse.json(
      { error: 'Failed to generate demo data' },
      { status: 500 }
    );
  }
}
