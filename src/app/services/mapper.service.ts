import { Injectable } from '@angular/core';
import {IAvgTempPerRegion, ITemperature, RegionRain, Station} from '../models/data';
import { IWeather } from '../models/dataFromServeur';

@Injectable({
  providedIn: 'root',
})
export class MapperService {
  constructor() {}

  weatherToTemperature(weatherJson: IWeather): ITemperature[] {
    const temperatures: ITemperature[] = [];
    if (weatherJson.results.bindings) {
      for (const binding of weatherJson.results.bindings) {
        const temperature: ITemperature = {
          region: binding.StationName.value,
          temp_avg: binding.temp_avg.value,
          stationName:  null,
          station: binding.Nstation.value,
          date: binding.date.value,
        };
        temperatures.push(temperature);
      }
    }

    return temperatures;
  }

  weatherToStation(weatherJson: IWeather): Station[] {
    let stations: Station[] = [];
    if (weatherJson.results.bindings) {
      for (let binding of weatherJson.results.bindings) {
        let nom = binding.StationName ? binding.StationName.value : null;
        let latitude = binding.latitude ? binding.latitude.value : null;
        let longitude = binding.long ? binding.long.value : null;
        let temp_avg = binding.temp_avg ? binding.temp_avg.value : null;
        let rain = binding.rain ? binding.rain.value : null;
        let speed = binding.speed ? binding.speed.value : null;
        let angle = binding.angle ? binding.angle.value: null;
        let humidity = binding.humidity ? binding.humidity.value: null;

        let data: Station = {
          nom: nom as string,
          latitude: latitude as number,
          longitude: longitude as number,
          temp_avg: temp_avg as number,
          rain: rain as number,
          speed: speed as number,
          angle: angle as number,
          humidity: humidity as number
        };
        stations.push(data);
      }
    }
    return stations;
  }

  weatherToAvgTempPerRegion(weatherJson: IWeather): IAvgTempPerRegion[] {
    const temperatures: IAvgTempPerRegion[] = [];
    if (weatherJson.results.bindings) {
      for (const binding of weatherJson.results.bindings) {
        const temperature: IAvgTempPerRegion = {
          region: binding.label.value,
          temp_avg: binding.temp_avg.value,
          isee: binding.insee.value
        };
        temperatures.push(temperature);
      }
    }

    return temperatures;
  }

  weatherToRainPerRegion(weatherJson: IWeather): RegionRain[] {
    const regionRains: RegionRain[] = [];
    if (weatherJson.results.bindings) {
      for (const binding of weatherJson.results.bindings) {
        const regionRain: RegionRain = {
          insee: binding.insee.value,
          label: binding.label.value,
          rain: binding.rain.value,
        };
        regionRains.push(regionRain);
      }
    }
    return regionRains;
  }

}
