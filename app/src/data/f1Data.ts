export interface F1Driver {
  id: string;
  name: string;
  team: string;
  teamColor: string;
  teamSecondaryColor: string;
  number: number;
  nationality: string;
}

export interface F1Track {
  id: string;
  name: string;
  country: string;
  sectors: number;
  length: number; 
  turns: number;
  description: string;
  firstGP?: number;
  laps?: number;
  lapRecord?: string;
  layout?: string;
}

export const F1_DRIVERS: F1Driver[] = [
  // Red Bull Racing
  { id: 'verstappen', name: 'Max VERSTAPPEN', team: 'RED BULL RACING', teamColor: '#3671C6', teamSecondaryColor: '#1E41A3', number: 1, nationality: 'NED' },
  
  // Ferrari
  { id: 'hamilton', name: 'Lewis HAMILTON', team: 'FERRARI', teamColor: '#DC143C', teamSecondaryColor: '#B22222', number: 44, nationality: 'GBR' },
  
  // McLaren
  { id: 'norris', name: 'Lando NORRIS', team: 'MCLAREN', teamColor: '#FF8700', teamSecondaryColor: '#E67E00', number: 4, nationality: 'GBR' },
  { id: 'piastri', name: 'Oscar PIASTRI', team: 'MCLAREN', teamColor: '#FF8700', teamSecondaryColor: '#E67E00', number: 81, nationality: 'AUS' },
  
  // Williams
  { id: 'sainz', name: 'Carlos SAINZ', team: 'WILLIAMS', teamColor: '#005AFF', teamSecondaryColor: '#0047CC', number: 55, nationality: 'ESP' },
  
  // Aston Martin
  { id: 'alonso', name: 'Fernando ALONSO', team: 'ASTON MARTIN', teamColor: '#006F62', teamSecondaryColor: '#005A4F', number: 14, nationality: 'ESP' },
];

export const F1_TRACKS: F1Track[] = [
  { 
    id: 'silverstone', 
    name: 'SILVERSTONE', 
    country: 'United Kingdom', 
    sectors: 3, 
    length: 5.891, 
    turns: 18, 
    description: 'High-speed circuit with fast sweeping corners and long straights',
    firstGP: 1950,
    laps: 52,
    lapRecord: '1:27.097 (Verstappen 2020)'
  },
  { 
    id: 'monza', 
    name: 'MONZA', 
    country: 'Italy', 
    sectors: 3, 
    length: 5.793, 
    turns: 11,  
    description: 'Temple of Speed with long straights and high-speed chicanes',
    firstGP: 1950,
    lapRecord: '1:21.046 (Barrichello 2004)'
  },
  { 
    id: 'monaco', 
    name: 'MONACO', 
    country: 'Monaco', 
    sectors: 3, 
    length: 3.337, 
    turns: 19, 
    description: 'Tight street circuit with narrow sections and elevation changes',
    laps: 78,
    lapRecord: '1:14.260 (Verstappen 2018)'
  },
  { 
    id: 'singapore', 
    name: 'SINGAPORE', 
    country: 'Singapore', 
    sectors: 3, 
    length: 4.927, 
    turns: 19, 
    description: 'Marina Bay street circuit with tight corners and nighttime lighting',
    laps: 62,
    lapRecord: '1:33.808 (Hamilton 2025)'
  }
];

export const getDriverById = (id: string): F1Driver | undefined => {
  return F1_DRIVERS.find(driver => driver.id === id);
};

export const getTrackById = (id: string): F1Track | undefined => {
  return F1_TRACKS.find(track => track.id === id);
};
