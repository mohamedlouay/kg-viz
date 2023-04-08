import {Injectable} from '@angular/core';
import {DataJson} from "../constants/fake";
import {MapperService} from "./mapper.service";

@Injectable({
  providedIn: 'root'
})
export class DataMockService {

  constructor(private mapperService : MapperService) { }

  getData(){
    return this.mapperService.weatherToTemperature(DataJson);
  }

}
