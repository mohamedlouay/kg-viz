export interface ITemperature {
  date: string;
  station: string;
  temp_avg: number;
  region: string;
}

export interface IAvgTempPerRegion {
  isee: string;
  temp_avg: number;
  region: string;
}


export interface Station {
  longitude: number;
  latitude: number;
  temp_avg: number;
  rain: number;
}
