# 🏎️ F1 Telemetry Dashboard

A professional-grade full-stack web application for analyzing F1 racing telemetry data with interactive visualizations, lap comparisons, and race strategy insights. Built with Next.js API routes for seamless deployment and optimal performance.

<img width="1241" height="767" alt="Screenshot 2025-10-02 at 10 51 45 PM" src="https://github.com/user-attachments/assets/8e682e27-1d1a-4570-beb8-9b089b160776" />

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Now-green?style=for-the-badge)](https://f1-telemetry-dashboard.vercel.app/)
![F1 Telemetry Dashboard](https://img.shields.io/badge/F1-Telemetry%20Dashboard-red?style=for-the-badge&logo=formula1)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel)

## 🌟 Features

### Core Functionality
- ✅ **CSV Upload & Parsing**: Upload telemetry CSV files with drag-and-drop
- ✅ **Demo Data Generator**: Create realistic F1 telemetry data with custom parameters
- ✅ **Interactive Charts**: Powered by Plotly.js with zoom, pan, and hover capabilities
- ✅ **Multi-Metric Analysis**: Visualize speed, throttle, brake, gear, RPM, tire temperatures, and more
- ✅ **Sector Timing Breakdown**: Analyze lap performance by sectors with detailed metrics
- ✅ **Lap Comparison**: Side-by-side comparison of two laps with overlay charts
- ✅ **Collapsible Analysis Guides**: Comprehensive race strategy and optimization tips
- ✅ **Responsive Design**: Beautiful F1-themed UI that works on all devices

### Analysis Features
- 📊 Multi-channel overlay analysis
- 🏁 Sector timing breakdown
- 🔥 Tire temperature monitoring
- ⚡ RPM and throttle optimization
- 🎯 Braking point identification
- 💡 Pro tips and engineering insights

## 🛠️ Tech Stack

### Full-Stack Application
- **Framework**: Next.js 15.5 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **Charts**: Plotly.js & react-plotly.js
- **API Routes**: Next.js API routes 
- **Data Processing**: Native JavaScript/TypeScript
- **CSV Parsing**: csv-parser library
- **Deployment**: Vercel 

## 📊 Demo Data & Sample Files

### Built-in Demo Data Generator
The application includes a sophisticated demo data generator that creates realistic F1 telemetry data with customizable parameters:
- **Track Configuration**: Custom track names and lap times
- **Vehicle Parameters**: Max speed, RPM, gear count
- **Driver Style**: Aggressive, balanced, or smooth driving characteristics
- **Realistic Physics**: Cornering forces, tire temperature buildup, gear shifting

### Sample Data Format
Upload CSV files with the following columns:
- `time`: Timestamp in seconds
- `speed`: Vehicle speed (km/h)
- `throttle`: Throttle position (0-1)
- `brake`: Brake pressure (0-1)
- `gear`: Current gear (1-8)
- `rpm`: Engine RPM
- `tire_temp_*`: Tire temperatures for all four corners
- `sector`: Track sector (1, 2, or 3)

## 📖 Usage Guide

### 1. Try the Demo Data Generator
- Click "Generate Demo Data" on the home page
- Customize track parameters (speed, RPM, lap time, driver style)
- Generate realistic F1 telemetry data instantly
- Perfect for testing and showcasing the application

### 2. Upload Real Telemetry Data
- Drag and drop a CSV file or click to browse
- File will be uploaded and parsed automatically
- Supports standard telemetry formats

### 3. Analyze Single Lap
- View the dashboard with auto-selected metrics
- Click column tags to add/remove metrics from charts
- Use Plotly tools to zoom, pan, and inspect data points
- Read the collapsible analysis guides for optimization tips
- Explore sector timing breakdown for detailed performance analysis

### 4. Compare Two Laps
- Click "Compare Laps" button
- Upload two different lap CSV files or generate demo data
- Select metrics to compare side-by-side
- Identify differences in braking points, throttle, and speed

### 5. Optimize Race Strategy
- Follow the comprehensive guides in the dashboard:
  1. Identify braking zones and optimal points
  2. Find optimal throttle application timing
  3. Manage RPM in the power band
  4. Balance tire temperatures across sectors
  5. Maintain speed consistency
  6. Optimize gear selection strategy

## 🚀 Quick Start

### Live Demo
Visit the live application: **[https://f1-telemetry-dashboard.vercel.app/](https://f1-telemetry-dashboard.vercel.app/)**

