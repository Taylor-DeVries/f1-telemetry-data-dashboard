# F1 Telemetry Dashboard

A full-stack web application telemetry analysis dashboard with realistic demo data, interactive visualizations, and comprehensive race engineering tools.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Now-green?style=for-the-badge)](https://f1-telemetry-dashboard.vercel.app/)

## 🌟 Features

### Core Functionality
- ✅ **Realistic Demo Data**: Generate authentic F1 telemetry with 2025 drivers and tracks
- ✅ **Interactive Gauges**: Speedometer and RPM dials with manual controls
- ✅ **Live Mode Simulation**: Real-time telemetry updates with 10Hz sampling
- ✅ **Sector Timing Analysis**: Detailed performance breakdown by track sectors
- ✅ **Lap Comparison**: Side-by-side driver analysis with delta time calculations
- ✅ **Track Integration**: Real F1 circuits (Silverstone, Monza, Monaco, Singapore)

### Analysis Features
- 📊 Multi-channel telemetry visualization
- 🏁 Sector timing breakdown with points and percentages
- ⚡ Manual gauge controls with live mode integration
- 🎯 Driver-specific performance characteristics
- 🔧 Customizable car parameters (speed, RPM, lap time, driving style)
- 📈 Interactive charts with Plotly.js

## 🛠️ Tech Stack

### Full-Stack Application
- **Framework**: Next.js 15.5 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **Charts**: Plotly.js & react-plotly.js
- **API Routes**: Next.js API routes 
- **Data Processing**: Native JavaScript/TypeScript
- **Deployment**: Vercel 

## 📊 Demo Data Generator

### Built-in Realistic Data Generation
The application includes a comprehensive demo data generator that creates authentic F1 telemetry:

- **Driver Selection**: Choose from current F1 drivers with team-specific characteristics
- **Track Configuration**: Real F1 circuits with accurate sector breakdowns
- **Vehicle Parameters**: Max speed (200-400 km/h), RPM (10k-20k), lap times
- **Driving Styles**: Aggressive, balanced, or smooth driving characteristics
- **Realistic Physics**: Cornering forces, tire temperature buildup, gear shifting

### Generated Telemetry Channels
- `speed`: Vehicle speed (km/h)
- `rpm`: Engine RPM
- `throttle`: Throttle position (0-100%)
- `brake`: Brake pressure (0-100%)
- `gear`: Current gear (1-8)
- `tire_pressure`: Tire pressure monitoring
- `fuel_load`: Fuel level tracking
- `brake_bias`: Brake balance settings
- `differential`: Differential settings

## 📖 Usage Guide

### 1. Single Driver Analysis
- Click "Single Driver Analysis" on the home page
- Select your preferred F1 driver and track
- Customize car parameters (speed, RPM, lap time, driving style)
- Generate realistic telemetry data
- Explore the interactive dashboard with live mode simulation

### 2. Lap Comparison
- Click "Lap Comparison" on the home page
- Select two different drivers and a track
- Configure individual driving styles for each driver
- Generate comparison data
- Analyze side-by-side performance with delta time calculations

### 3. Interactive Dashboard Features
- **Live Mode**: Toggle real-time telemetry simulation
- **Manual Controls**: Adjust speed and RPM with interactive buttons
- **Sector Analysis**: View detailed timing breakdown by track sectors
- **Channel Selection**: Choose which telemetry channels to display
- **Track Map**: Visual track representation with sector markers

### 4. Data Analysis
- **Sector Timing**: Points and percentage completion for each sector
- **Performance Metrics**: Speed, RPM, throttle, and brake analysis
- **Driver Comparison**: Side-by-side lap analysis with delta times
- **Interactive Charts**: Zoom, pan, and hover for detailed inspection

## 🚀 Quick Start

### Live Demo
Visit the live application: **[https://f1-telemetry-dashboard.vercel.app/](https://f1-telemetry-dashboard.vercel.app/)**
