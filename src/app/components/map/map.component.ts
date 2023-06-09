import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import * as d3 from 'd3';
import * as hexbin from 'd3-hexbin';
import { select } from 'd3-selection';
import * as L from 'leaflet';
import * as Ld3 from '@asymmetrik/leaflet-d3';
import { ChartModalComponent } from '../chart-modal/chart-modal.component';
import { GeoJSON, HexbinLayerConfig, Layer } from 'leaflet';
import { DataService } from '../../services/data.service';
import { MapperService } from '../../services/mapper.service';
import { IAvgTempPerRegion, Station } from '../../models/data';
import { Observable, Subscriber } from 'rxjs';
import { ParameterFilterComponent } from '../parameter-filter/parameter-filter.component';
import { VisualisationPageComponent } from '../visualisation-page/visualisation-page.component';
import { RotatedMarker } from 'leaflet-marker-rotation';
import { text } from 'd3';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent {
  franceBounds: any;
  colorScale: any;
  options: any;
  hexLayer: any;
  hexLayerRain: any;
  hexLayerWind: any;
  hexLayerHumidity: any;
  stationsData: Station[] = [];
  regionLayer: any;
  mymap: any;
  startDate: number = 1609459200000;
  endDate: number = 1640908800000;
  start: string = '2021-01-01';
  end: string = '2021-12-31';

  @Input() layerSelected: string | undefined;
  @Input() parameterSelected!: string;
  @Output() colors: string[] | undefined;
  @Output() legendScale: number[] | undefined;
  @Output() legendScaleTest = new EventEmitter<number[]>();

  private hexbinOptions!: HexbinLayerConfig;

  constructor(
    private dialog: MatDialog,
    private dataService: DataService,
    private mapperService: MapperService
  ) {
    this.colors = ['white', 'yellow', 'orange', 'red'];
    this.legendScale = [11, 15, 20, 25];
  }

  /**
   *
   */
  ngOnInit(): void {
    this.dataService.getAvgTempPerRegion().subscribe(() => {
      this.createMap();
    });
  }

  private createMap() {
    this.hexbinOptions = {
      radius: 10,
      opacity: 0.7,
      duration: 500,
    };
    // Création de la carte centrée sur la
    // Ajout du fond de carte OpenStreetMap
    this.mymap = L.map('map').setView([46.227638, 2.213749], 6);
    //this.mymap = mymap;
    var layer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }
    ).addTo(this.mymap);

    //ajustement de la luminosité de la map
    layer.getContainer()!.style.filter = 'brightness(75%)';
    // Chargement des données des régions

    fetch(
      'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions.geojson'
    )
      .then((response) => response.json())
      .then((data) => {
        // Calcul de la valeur maximale de la densité de population

        function getColor(d: number) {
          return '#bd0327';
        }
        // Création d'une couche GeoJSON pour les régions avec une couleur de remplissage basée sur la densité de population
        // Création d'une couche GeoJSON pour les régions
        this.regionLayer = L.geoJSON(data, {
          style: (feature) => {
            var regionIsee = feature!.properties.code;
            return {
              fillColor: this.colorMapByTemperature(regionIsee),
              fillOpacity: 0.75,
              weight: 1,
              color: 'black',
            };
          },
          onEachFeature: (feature, layer) => {
            //this.openModal(feature);
            layer.on('click', () => {
              this.openModal(feature);
            });
            layer.bindTooltip(feature.properties.nom, {
              permanent: false,
              direction: 'center',
              className: 'regionLabel',
            });
          },
        });
        // Ajout de la couche à la carte
        this.regionLayer.addTo(this.mymap);
      })
      .then(() => {
        // ---------------------query test---------------------
        this.options = {
          radius: 10,
          opacity: 0.7,
          duration: 500,
        };
        // @ts-ignore
        (this.franceBounds = L.latLngBounds([
          [41, -5],
          [51, 10],
        ])),
          (this.hexLayer = L.hexbinLayer(this.hexbinOptions));
        this.hexLayer.colorRange(['white', 'yellow', 'orange', 'red']);
        this.getData().then((data) => {
          this.hexLayer._data = data;
        });
        this.hexLayer
          .radiusRange([12, 18, 25, 30])
          .lng(function (d: any[]) {
            return d[0];
          })
          .lat(function (d: any[]) {
            return d[1];
          })
          .colorValue(function (d: any[]) {
            return parseInt(d[0]['o'][2]);
          })
          .radiusValue(function (d: any[]) {
            return parseInt(d[0]['o'][2]);
          });

        this.hexLayerRain = L.hexbinLayer(this.hexbinOptions);

        this.hexLayerRain.colorRange([
          'white',
          '#7DF9FF',
          '#ADD8E6',
          '#0000FF',
          '#00008B',
        ]);

        this.getRainData().then((data) => {
          this.hexLayerRain._data = data;
        });
        this.hexLayerRain
          .radiusRange([15, 18, 20, 24, 28, 32])
          .lng(function (d: any[]) {
            return d[0];
          })
          .lat(function (d: any[]) {
            return d[1];
          })
          .colorValue(function (d: any[]) {
            return parseInt(String(parseFloat(d[0]['o'][2]) * 10));
          })
          .radiusValue(function (d: any[]) {
            return parseInt(d[0]['o'][2]);
          });

        this.hexLayerWind = L.hexbinLayer(this.hexbinOptions);
        this.hexLayerWind.colorRange(['#ECFFDC', '#93C572', '#2E8B57']);

        this.combineWindSpeedDirection().then((data) => {
          this.hexLayerWind._data = data;
          this.createWindDirectionIcons(data, this.mymap);
        });
        this.hexLayerWind
          .radiusRange([15, 18, 20, 24, 28, 32])
          .lng(function (d: any[]) {
            return d[0];
          })
          .lat(function (d: any[]) {
            return d[1];
          })
          .colorValue(function (d: any[]) {
            return parseInt(String(parseFloat(d[0]['o'][2]) * 10));
          })
          .radiusValue(function (d: any[]) {
            return parseInt(d[0]['o'][2]);
          });
      });

    this.hexLayerHumidity = L.hexbinLayer(this.hexbinOptions);
    this.hexLayerHumidity.colorRange([
      '#E6E6FA',
      '#E0B0FF',
      '#E0B0FF',
      '#DA70D6',
      '#800080',
    ]);

    this.getWindHumudityData().then((data) => {
      this.hexLayerHumidity._data = data;
    });
    this.hexLayerHumidity
      .radiusRange([15, 18, 20, 24, 28, 32])
      .lng(function (d: any[]) {
        return d[0];
      })
      .lat(function (d: any[]) {
        return d[1];
      })
      .colorValue(function (d: any[]) {
        return parseInt(String(parseFloat(d[0]['o'][2]) * 10));
      })
      .radiusValue(function (d: any[]) {
        return parseInt(d[0]['o'][2]);
      });

    this.hexLayerHumidity = L.hexbinLayer(this.hexbinOptions);
    this.hexLayerHumidity.colorRange([
      '#E6E6FA',
      '#E0B0FF',
      '#E0B0FF',
      '#DA70D6',
      '#800080',
    ]);

    this.getWindHumudityData().then((data) => {
      this.hexLayerHumidity._data = data;
    });
    this.hexLayerHumidity
      .radiusRange([15, 18, 20, 24, 28, 32])
      .lng(function (d: any[]) {
        return d[0];
      })
      .lat(function (d: any[]) {
        return d[1];
      })
      .colorValue(function (d: any[]) {
        return parseInt(String(parseFloat(d[0]['o'][2]) * 10));
      })
      .radiusValue(function (d: any[]) {
        return parseInt(d[0]['o'][2]);
      });
  }

  /**
   *
   */
  async addHumidityRegionLayer() {
    return fetch(
      'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions.geojson'
    )
      .then((response) => response.json())
      .then((data) => {
        // Calcul de la valeur maximale de la densité de population
        var maxPopulationDensity = 0;
        data.features.forEach((region: any) => {
          var populationDensity = region.properties.code;
          if (populationDensity > maxPopulationDensity) {
            maxPopulationDensity = populationDensity;
          }
        });
        // Création d'une fonction de couleur pour la choropleth map
        function getColor(d: number) {
          return d > maxPopulationDensity * 0.8
            ? '#bd0327'
            : d > maxPopulationDensity * 0.6
            ? '#f03b20'
            : d > maxPopulationDensity * 0.4
            ? '#fd8d3c'
            : d > maxPopulationDensity * 0.2
            ? '#feb24c'
            : '#fed976';
        }

        // Création d'une couche GeoJSON pour les régions avec une couleur de remplissage basée sur la densité de population
        this.regionLayer = L.geoJSON(data, {
          style: function (feature) {
            var populationDensity = feature!.properties.code;
            return {
              fillColor: getColor(populationDensity),
              fillOpacity: 0.75,
              weight: 1,
              color: 'black',
            };
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', () => {
              this.openModal(feature);
            });
          },
        });
        // Ajout de la couche à la carte
        // this.regionLayer.addTo(this.mymap);
      });
  }

  /**
   *
   */

  async getData() {
    return new Promise<any[][]>((resolve, reject) => {
      let data: any[][] = [];
      let tempData: Station[];

      this.dataService.getTemperaturePerStation(this.start, this.end).subscribe(
        (weather) => {
          tempData = this.mapperService.weatherToStation(weather);
          tempData.forEach((station) => {
            data.push([station.longitude, station.latitude, station.temp_avg]);
          });
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  /**
   *
   */
  async getRainData() {
    let data: any[][] = [];
    this.dataService
      .getRainPerStation(this.start, this.end)
      .subscribe((weather) => {
        this.stationsData = this.mapperService.weatherToStation(weather);
        this.stationsData.forEach((station) => {
          data.push([station.longitude, station.latitude, station.rain]);
        });
      });
    console.log(' RAINS ? ', data);
    return data;
  }

  /**
   *
   */
  async getWindData(): Promise<any[][]> {
    return new Promise<any[][]>((resolve, reject) => {
      let data: any[][] = [];
      let tempData: Station[];

      this.dataService.getWindPerStation().subscribe(
        (weather) => {
          tempData = this.mapperService.weatherToStation(weather);
          tempData.forEach((station) => {
            data.push([
              station.longitude,
              station.latitude,
              station.speed,
              station.nom,
            ]);
          });
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  /**
   *
   */
  async getWindDirectionData(): Promise<any[][]> {
    return new Promise<any[][]>((resolve, reject) => {
      let data: any[][] = [];
      let tempData: Station[];

      this.dataService.getWindDirectionPerStation().subscribe(
        (weather) => {
          tempData = this.mapperService.weatherToStation(weather);
          tempData.forEach((station) => {
            data.push([station.angle]);
          });
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async getWindHumudityData(): Promise<any[][]> {
    return new Promise<any[][]>((resolve, reject) => {
      let data: any[][] = [];
      let tempData: Station[];

      this.dataService.getHumidityPerStation().subscribe(
        (weather) => {
          tempData = this.mapperService.weatherToStation(weather);
          tempData.forEach((station) => {
            data.push([station.longitude, station.latitude, station.humidity]);
          });
          resolve(data);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  /**
   *
   */
  async combineWindSpeedDirection(): Promise<any[][]> {
    const speedData = await this.getWindData();
    const directionData = await this.getWindDirectionData();

    const combinedData: any[][] = [];

    for (let i = 0; i < speedData.length; i++) {
      combinedData.push([
        speedData[i][0],
        speedData[i][1],
        speedData[i][2],
        speedData[i][3],
        directionData[i][0],
      ]);
    }

    return combinedData;
  }

  /**
   *
   */
  ngOnChanges() {
    this.switchLayer();
  }

  /**
   *
   */
  switchLayer() {
    switch (this.layerSelected) {
      case 'station':
        this.colors = ['white', 'yellow', 'orange', 'red'];
        if (this.mymap.hasLayer(this.hexLayerRain)) {
          this.mymap.removeLayer(this.hexLayerRain);
        }
        if (this.mymap.hasLayer(this.regionLayer)) {
          this.mymap.removeLayer(this.regionLayer);
        }
        if (this.mymap.hasLayer(this.hexLayer)) {
          this.mymap.removeLayer(this.hexLayer);
        }
        if (this.mymap.hasLayer(this.hexLayerWind)) {
          this.mymap.removeLayer(this.hexLayerWind);
        }
        if (this.mymap.hasLayer(this.hexLayerHumidity)) {
          this.mymap.removeLayer(this.hexLayerHumidity);
        }
        if (this.parameterSelected == 'temperature') {
          this.mymap.eachLayer((layer: any) => {
            if (layer instanceof L.Marker || layer instanceof RotatedMarker) {
              this.mymap.removeLayer(layer);
            }
          });
          this.colors = ['white', 'yellow', 'orange', 'red'];
          this.getData().then((data) => {
            this.hexLayer._data = data;
            this.mymap.addLayer(this.hexLayer);
            this.calculateLegendValues(this.hexLayer._data);
            this.legendScaleTest.emit(this.legendScale);
          });
          //this.createTempValuesMarkers(this.hexLayer._data, this.mymap);
        }
        if (this.parameterSelected == 'rain') {
          this.mymap.eachLayer((layer: any) => {
            if (layer instanceof L.Marker || layer instanceof RotatedMarker) {
              this.mymap.removeLayer(layer);
            }
          });
          this.colors = ['white', '#7DF9FF', '#ADD8E6', '#0000FF', '#00008B'];
          this.getRainData().then((data) => {
            this.hexLayerRain._data = data;
            this.mymap.addLayer(this.hexLayerRain);
            this.calculateLegendValues(this.hexLayerRain._data);
            this.legendScaleTest.emit(this.legendScale);
          });
        }
        if (this.parameterSelected == 'wind') {
          this.colors = ['#ECFFDC', '#93C572', '#2E8B57'];
          this.mymap.addLayer(this.hexLayerWind);
          this.createWindDirectionIcons(this.hexLayerWind._data, this.mymap);
          this.calculateLegendValues(this.hexLayerWind._data);
        }
        if (this.parameterSelected == 'humidity') {
          this.mymap.eachLayer((layer: any) => {
            if (layer instanceof L.Marker || layer instanceof RotatedMarker) {
              this.mymap.removeLayer(layer);
            }
          });
          this.colors = ['#E6E6FA', '#E0B0FF', '#E0B0FF', '#DA70D6', '#800080'];
          this.mymap.addLayer(this.hexLayerHumidity);
          this.calculateLegendValues(this.hexLayerHumidity._data);
          this.legendScaleTest.emit(this.legendScale);
        }
        //this.switchParameter(this.parameterSelected);
        break;

      case 'région':
        this.mymap.eachLayer((layer: any) => {
          if (layer instanceof L.Marker || layer instanceof RotatedMarker) {
            this.mymap.removeLayer(layer);
          }
        });
        if (this.mymap.hasLayer(this.hexLayerRain)) {
          this.mymap.removeLayer(this.hexLayerRain);
        }
        if (this.mymap.hasLayer(this.hexLayer)) {
          this.mymap.removeLayer(this.hexLayer);
        }
        if (this.mymap.hasLayer(this.regionLayer)) {
          this.mymap.removeLayer(this.regionLayer);
        }
        if (this.parameterSelected == 'temperature') {
          this.colors = ['white', 'yellow', 'orange', 'red'];
          this.mymap.addLayer(this.regionLayer);
        }
        if (this.parameterSelected == 'rain') {
          this.colors = ['white', '#7DF9FF', '#ADD8E6', '#0000FF', '#00008B'];
          this.mymap.addLayer(this.hexLayerRain);
        }
        //this.switchParameter(this.parameterSelected);
        break;
    }
  }

  calculateLegendValues(data: any[]) {
    console.log(' LEGEND DATA ? ?? ', data);
    let numbers: number[] = [];
    data.forEach((num) => {
      numbers.push(parseInt(num[2]));
    });
    const minValue = Math.min(...numbers);
    const maxValue = Math.max(...numbers);
    console.log(' MIN ? ', minValue);
    const range = maxValue - minValue;
    const interval = range / 5;
    const legendLabels: number[] = [];
    for (let i = 1; i <= 5; i++) {
      const average = minValue + interval * i;
      legendLabels.push(average);
    }
    this.legendScale = legendLabels;
    console.log(' LEGEND ', this.legendScale);
  }

  createTempValuesMarkers(stations: any[][], mymap: L.Map) {
    stations.forEach((station) => {
      var tooltip = L.tooltip()
        .setLatLng([station[1], station[0]])
        .setContent(String(parseInt(station[2])));

      if (this.parameterSelected === 'temperature') {
        tooltip.addTo(this.mymap);
      }
    });
  }

  createWindDirectionIcons(stations: any[][], mymap: L.Map) {
    stations.forEach((station) => {
      var marker = new RotatedMarker([station[1], station[0]], {
        rotationAngle: station[4],
        rotationOrigin: 'bottom center',
      }).bindTooltip(station[3], {
        permanent: false,
        direction: 'center',
      });

      marker.setIcon(
        L.icon({
          iconUrl: 'assets/arrow.png',
          iconSize: [30, 30],
          iconAnchor: [10, 60],
        })
      );
      if (this.parameterSelected === 'wind') {
        marker.addTo(this.mymap);
      }
    });
  }

  private openModal<G, P>(feature: any) {
    const dialogRef = this.dialog.open(ChartModalComponent, {
      data: {
        regionName: feature.properties.nom,
        regionCode: feature.properties.code,
      },
      position: { bottom: '0px' },
      panelClass: 'full-width-dialog',
    });
  }

  updateDates(range: Date) {
    const date = new Date(range);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  handleRangeChangedEvent(range: Date[]) {
    this.start = this.updateDates(range[0]);
    this.end = this.updateDates(range[1]);
    this.switchLayer();
  }
  colorMapByTemperature(isee: string) {
    let temperatureData: IAvgTempPerRegion[] =
      this.dataService.initAvgTempPerRegionData!;
    // Calculate the average temperature
    let averageTemperature =
      temperatureData.reduce((sum, data) => sum + Number(data.temp_avg), 0) /
      temperatureData.length;

    // Calculate the standard deviation of temperatures
    const standardDeviation = Math.sqrt(
      temperatureData.reduce(
        (sum, data) => sum + Math.pow(data.temp_avg - averageTemperature, 2),
        0
      ) / temperatureData.length
    );

    // Define the color scale
    const colorScale = d3
      .scaleLinear<string>()
      .domain([
        averageTemperature - standardDeviation,
        averageTemperature,
        averageTemperature + standardDeviation,
      ])
      .range(['#f7ff00', '#ff2f00']);

    let temperature = temperatureData.find(
      (region) => region.isee === isee
    )!.temp_avg;

    // return the color
    return colorScale(temperature);
  }
  protected readonly console = console;
}
