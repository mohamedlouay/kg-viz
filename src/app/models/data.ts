export interface ITemperature {
  date: string;
  station: string;
  temp_avg: number;
  region: string;
}

export interface Station {
  nom: string;
  longitude: number;
  latitude: number;
  temp_avg: number;
  rain: number;
}
