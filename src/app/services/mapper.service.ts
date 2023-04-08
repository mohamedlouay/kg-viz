import {Injectable} from '@angular/core';
import {ITemperature} from "../models/data";
import {IWeather} from "../models/dataFromServeur";

@Injectable({
  providedIn: 'root'
})
export class MapperService {

  constructor() {
  }

  weatherToTemperature(weatherJson: IWeather): ITemperature[] {
    const temperatures: ITemperature[] = [];
    if (weatherJson.results.bindings) {
      for (const binding of weatherJson.results.bindings) {
        const temperature: ITemperature = {
          region: binding.label.value,
          temp_avg: binding.temp_avg.value,
          station: binding.Nstation.value,
          date: binding.date.value
        };


        temperatures.push(temperature)

      }
    }

    return temperatures

  }


}
