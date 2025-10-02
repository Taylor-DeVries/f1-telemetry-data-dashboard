from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from typing import Optional

app = FastAPI()

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://frontend-ijxmi38ez-taylor-devries-projects.vercel.app",  # Your current Vercel URL
        "https://frontend-beta-mauve-dxt0are2i4.vercel.app",  # Your production Vercel URL
        "https://*.vercel.app"  # Allow all Vercel deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

class CarParameters(BaseModel):
    max_speed: int = 320  # km/h
    max_rpm: int = 15000
    num_gears: int = 8
    lap_time: float = 90.0  # seconds
    track_name: str = "Demo Track"
    driver_style: str = "balanced"  # aggressive, balanced, smooth

@app.get("/")
def root():
    return {"message": "F1 Telemetry API running!"}

@app.post("/upload")
async def upload_csv(file: UploadFile):
    df = pd.read_csv(file.file)
    return {
        "columns": df.columns.tolist(),
        "head": df.head(50).to_dict(),
        "full_data": df.to_dict()
    }

@app.post("/generate-demo")
async def generate_demo_data(params: CarParameters):
    """Generate realistic demo telemetry data based on car parameters"""
    
    # Calculate number of data points (10Hz sampling rate)
    num_points = int(params.lap_time * 10)
    time = np.linspace(0, params.lap_time, num_points)
    
    # Generate track profile with corners and straights
    # Create a realistic lap with 3 sectors
    sector_points = num_points // 3
    
    # Driver style multipliers
    style_factors = {
        "aggressive": {"brake_late": 0.9, "throttle_early": 1.1, "speed_var": 1.2},
        "balanced": {"brake_late": 1.0, "throttle_early": 1.0, "speed_var": 1.0},
        "smooth": {"brake_late": 1.1, "throttle_early": 0.9, "speed_var": 0.8}
    }
    style = style_factors.get(params.driver_style, style_factors["balanced"])
    
    # Speed profile with corners
    speed = np.zeros(num_points)
    for i in range(num_points):
        # Create realistic speed profile with corners
        lap_progress = i / num_points
        corner_factor = 1 - 0.5 * abs(np.sin(lap_progress * 12))  # 4 corners per sector * 3 sectors
        speed[i] = params.max_speed * corner_factor * (0.3 + 0.7 * corner_factor)
        # Add some noise
        speed[i] += np.random.normal(0, 2 * style["speed_var"])
    
    speed = np.clip(speed, 50, params.max_speed)
    
    # Throttle and brake based on speed changes
    throttle = np.zeros(num_points)
    brake = np.zeros(num_points)
    
    for i in range(1, num_points):
        speed_change = speed[i] - speed[i-1]
        if speed_change > 0:
            throttle[i] = min(1.0, (speed_change + 2) / 10 * style["throttle_early"])
            brake[i] = 0
        else:
            brake[i] = min(1.0, abs(speed_change) / 15 * style["brake_late"])
            throttle[i] = max(0, 0.3 - brake[i])
    
    throttle = np.clip(throttle, 0, 1)
    brake = np.clip(brake, 0, 1)
    
    # Gear calculation based on speed
    gear = np.zeros(num_points, dtype=int)
    for i in range(num_points):
        gear_raw = 1 + (speed[i] / params.max_speed) * (params.num_gears - 1)
        gear[i] = int(np.clip(gear_raw, 1, params.num_gears))
    
    # RPM based on gear and speed
    rpm = np.zeros(num_points)
    for i in range(num_points):
        rpm_base = (speed[i] / params.max_speed) * params.max_rpm
        gear_factor = gear[i] / params.num_gears
        rpm[i] = rpm_base / (gear_factor + 0.3)
        rpm[i] += np.random.normal(0, 100)
    
    rpm = np.clip(rpm, 1000, params.max_rpm)
    
    # Tire temperatures (increase with speed and braking)
    tire_temp_base = 80
    tire_fl = tire_temp_base + np.cumsum(brake * 0.5 + speed / 100) % 40
    tire_fr = tire_temp_base + np.cumsum(brake * 0.5 + speed / 100) % 40 + np.random.normal(0, 2, num_points)
    tire_rl = tire_temp_base + np.cumsum(brake * 0.4 + speed / 100) % 35
    tire_rr = tire_temp_base + np.cumsum(brake * 0.4 + speed / 100) % 35 + np.random.normal(0, 2, num_points)
    
    # Create sector markers
    sector = np.ones(num_points, dtype=int)
    sector[sector_points:2*sector_points] = 2
    sector[2*sector_points:] = 3
    
    # Create DataFrame
    df = pd.DataFrame({
        'time': time,
        'speed': speed,
        'throttle': throttle,
        'brake': brake,
        'gear': gear,
        'rpm': rpm,
        'tire_temp_front_left': tire_fl,
        'tire_temp_front_right': tire_fr,
        'tire_temp_rear_left': tire_rl,
        'tire_temp_rear_right': tire_rr,
        'sector': sector
    })
    
    return {
        "columns": df.columns.tolist(),
        "head": df.head(50).to_dict(),
        "full_data": df.to_dict(),
        "metadata": {
            "track_name": params.track_name,
            "max_speed": params.max_speed,
            "lap_time": params.lap_time,
            "driver_style": params.driver_style
        }
    }
