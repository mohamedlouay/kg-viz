export interface ITemperature {
  date: string;
  stationName: string | null;
  station: string;
  temp_avg: number;
  region: string;
}

export interface IAvgTempPerRegion {
  isee: string;
  temp_avg: number;
  region: string;
}

export interface RegionRain {
  label: string;
  insee: string
  rain: number;
}

export interface IAvgTempPerRegion {
  isee: string;
  temp_avg: number;
  region: string;
}
export interface Station {
  nom: string;
  longitude: number;
  latitude: number;
  temp_avg: number;
  rain: number;
  speed: number;
  angle: number;
  humidity: number;
}
