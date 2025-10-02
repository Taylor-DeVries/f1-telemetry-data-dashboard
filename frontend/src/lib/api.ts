import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export interface TelemetryData {
  full_data: any;
  columns: string[];
  head: Record<string, any>;
}

export const api = {
  // Upload CSV file and get parsed data
  uploadTelemetry: async (file: File): Promise<TelemetryData> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Get single lap data (placeholder for future implementation)
  getLapData: async (lapId: string) => {
    const response = await axios.get(`${API_BASE_URL}/lap/${lapId}`);
    return response.data;
  },

  // Compare two laps (placeholder for future implementation)
  compareLaps: async (lap1Id: string, lap2Id: string) => {
    const response = await axios.get(`${API_BASE_URL}/compare/${lap1Id}/${lap2Id}`);
    return response.data;
  },
};
