import { Injectable } from '@angular/core';
import { MapperService } from './mapper.service';
import { DataJson } from '../constants/fake';
import { QueryBuilderService } from './query-builder.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IWeather } from '../models/dataFromServeur';
import {IAvgTempPerRegion, RegionRain} from "../models/data";
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'https://weakg.i3s.unice.fr/sparql';

  initAvgTempPerRegionData : IAvgTempPerRegion[] | undefined;
  initRainPerRegion : RegionRain[] | undefined;

  constructor(
    private mapperService: MapperService,
    private queryBuilderService: QueryBuilderService,
    private http: HttpClient
  ) {

    this.getAvgTempPerRegion().subscribe(data=>{
      this.initAvgTempPerRegionData = this.mapperService.weatherToAvgTempPerRegion(data);
    });

    this.getRainPerRegion('2021-01-01', '2021-12-31').subscribe(data=>{
      this.initRainPerRegion = this.mapperService.weatherToRainPerRegion(data);
      console.log(' RAIN DATA : ', this.initRainPerRegion);
    });

  }

  getAvgTempPerRegion() {
    const query = this.queryBuilderService.getAvgTempPerRegion();
    const url = `${this.apiUrl}?query=${encodeURIComponent(query)}`;
    return this.http.get<IWeather>(url);
  }
  getRainPerRegion(start: string, end: string) {
    const query = this.queryBuilderService.getAvgRainRegion(start, end);
    const url = `${this.apiUrl}?query=${encodeURIComponent(query)}`;
    return this.http.get<IWeather>(url);
  }
  getTemperaturePerRegion(ResgionCode: number) {
    const query = this.queryBuilderService.buildQuery_slices(ResgionCode);
    const url = `${this.apiUrl}?query=${encodeURIComponent(query)}`;
    return this.http.get<IWeather>(url);
  }
  getTemperaturePerStation(start: string, end: string) {
    const query = this.queryBuilderService.buildQuery_getAllStationsAvgTemp(start, end);
    const url = `${this.apiUrl}?query=${encodeURIComponent(query)}`;
    return this.http.get<IWeather>(url);
  }
  getRainPerStation(start:string, end:string) {
    const query = this.queryBuilderService.buildQuery_avgRainQtyPerStation(start, end);
    const url = `${this.apiUrl}?query=${encodeURIComponent(query)}`;
    return this.http.get<IWeather>(url);
  }

  getWindPerStation() {
    const query = this.queryBuilderService.buildQuery_getAllStationsAvgWindSpeed();
    const url = `${this.apiUrl}?query=${encodeURIComponent(query)}`;
    return this.http.get<IWeather>(url);
  }
  getWindDirectionPerStation(){
    const query = this.queryBuilderService.buildQuery_getAllStationsAvgWindDirection();
    const url = `${this.apiUrl}?query=${encodeURIComponent(query)}`;
    return this.http.get<IWeather>(url);
  }

  getHumidityPerStation(){
    const query = this.queryBuilderService.buildQuery_getAllStationsAvgHumidity();
    const url = `${this.apiUrl}?query=${encodeURIComponent(query)}`;
    return this.http.get<IWeather>(url);
  }
  QueryObservationsByDate(insee: number, date: string) {
    const query = this.queryBuilderService.QueryObservationsByDate(insee, date);
    const url = `${this.apiUrl}?query=${encodeURIComponent(query)}`;
    return this.http.get<IWeather>(url);
  }

}
