export interface IWeather {
  head: Head;
  results: Results;
}
interface Head {
  link?: null[] | null;
  vars?: string[] | null;
}
interface Results {
  distinct: boolean;
  ordered: boolean;
  bindings?: BindingsEntity[] | null;
}
interface BindingsEntity {
  date: Date;
  Nstation: Nstation;
  temp_avg: TempAvg;
  label: Label;
  insee: Insee;
  long: longitude;
  latitude: latitude;
  rain: rain;
  speed: number;
  angle: number;
  humidity: number;
}
interface nom {
  type: string;
  datatype: string;
  value: string;
}

interface longitude {
  type: string;
  datatype: string;
  value: number;
}

interface rain {
  type: string;
  datatype: string;
  value: number;
}
interface latitude {
  type: string;
  datatype: string;
  value: number;
}
interface TempAvg {
  type: string;
  datatype: string;
  value: number;
}

interface speed {
  type: string;
  datatype: string;
  value: number;
}
interface angular {
  type: string;
  datatype: string;
  value: number;
}
interface latitude {
  type: string;
  datatype: string;
  value: number;
}
interface Date {
  type: string;
  datatype: string;
  value: string;
}
interface Nstation {
  type: string;
  value: string;
}
interface Insee {
  type: string;
  value: string;
}
interface Label {
  type: string;
  'xml:lang': string;
  value: string;
}
