import { Injectable } from '@angular/core';
import { MapperService } from './mapper.service';
import { DataJson } from '../constants/fake';
import { QueryBuilderService } from './query-builder.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IWeather } from '../models/dataFromServeur';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'https://weakg.i3s.unice.fr/sparql';

  constructor(
    private mapperService: MapperService,
    private queryBuilderService: QueryBuilderService,
    private http: HttpClient
  ) {}

  getData() {
    return this.mapperService.weatherToTemperature(DataJson);
  }

  getTemperaturePerRegion(ResgionCode: number) {
    const query = this.queryBuilderService.buildQuery_slices(ResgionCode);
    const url = `${this.apiUrl}?query=${encodeURIComponent(query)}`;
    return this.http.get<IWeather>(url);
  }
  getTemperaturePerStation() {
    const query = this.queryBuilderService.buildQuery_getAllStationsAvgTemp();
    const url = `${this.apiUrl}?query=${encodeURIComponent(query)}`;
    return this.http.get<IWeather>(url);
  }
  QueryObservationsByDate(insee: number, date: string) {
    const query = this.queryBuilderService.QueryObservationsByDate(insee, date);
    const url = `${this.apiUrl}?query=${encodeURIComponent(query)}`;
    return this.http.get<IWeather>(url);
  }
}
