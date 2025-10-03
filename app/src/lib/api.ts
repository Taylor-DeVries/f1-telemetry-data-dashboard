import axios from 'axios';

export interface TelemetryData {
  full_data: Record<string, Record<string, number>>;
  columns: string[];
  head: Record<string, Record<string, number>>;
  metadata?: {
    track_name: string;
    max_speed: number;
    lap_time: number;
    driver_style: string;
  };
}

export interface CarParameters {
  max_speed: number;
  max_rpm: number;
  num_gears: number;
  lap_time: number;
  track_name: string;
  driver_style: string;
}

export const api = {
  // Upload CSV file and get parsed data
  uploadTelemetry: async (file: File): Promise<TelemetryData> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Generate demo telemetry data
  generateDemoData: async (params: CarParameters): Promise<TelemetryData> => {
    const response = await axios.post('/api/generate-demo', params);
    return response.data;
  },

  // Get single lap data (placeholder for future implementation)
  getLapData: async (lapId: string) => {
    const response = await axios.get(`/api/lap/${lapId}`);
    return response.data;
  },

  // Compare two laps (placeholder for future implementation)
  compareLaps: async (lap1Id: string, lap2Id: string) => {
    const response = await axios.get(`/api/compare/${lap1Id}/${lap2Id}`);
    return response.data;
  },
};
