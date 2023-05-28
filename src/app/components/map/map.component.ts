import {Component, Input, Output, SimpleChanges} from '@angular/core';
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
import {IAvgTempPerRegion, Station} from '../../models/data';
import { Observable, Subscriber } from 'rxjs';
import { ParameterFilterComponent } from '../parameter-filter/parameter-filter.component';
import {VisualisationPageComponent} from "../visualisation-page/visualisation-page.component";

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
  stationsData: Station[] = [];
  regionLayer: any;
  mymap: any;
  protected readonly console = console;
  @Input() layerSelected: string | undefined;
  @Input() parameterSelected!:string;
  @Output() colors : string[] | undefined;

  private hexbinOptions!: HexbinLayerConfig;

  constructor(private dialog: MatDialog, private dataService: DataService, private mapperService: MapperService) {
    this.colors = ['white', 'yellow', 'orange', 'red'];}

  /**
   *
   */
  ngOnInit(): void {
    this.dataService.getAvgTempPerRegion().subscribe(()=>{
      this.createMap();
    })

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


        // Création d'une couche GeoJSON pour les régions
        var regionLayer = L.geoJSON(data, {
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
            layer.on('click', () => {
              this.openModal(feature);
            });
            layer.bindTooltip(
              feature.properties.nom,
              {
                permanent: false,
                direction: 'center',
                className: 'regionLabel'
              }
            );
          },
        });
        // Ajout de la couche à la carte
        this.regionLayer.addTo(this.mymap);
      }).then(() => {

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

        this.hexLayer = L.hexbinLayer(this.hexbinOptions);
      this.hexLayer.colorRange(['white', 'yellow', 'orange', 'red']);
      this.getData().then((data) => {
        console.log("temp data: ", data);
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

      this.hexLayerRain.colorRange(['white', '#7DF9FF', '#ADD8E6', '#0000FF', '#00008B']);

      this.getRainData().then((data) => {
        this.hexLayerRain._data = data;
        console.log("rain data: ", this.hexLayerRain._data);
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
          console.log('rain ? ', parseInt(String(parseFloat(d[0]['o'][2]) * 10)));
          return parseInt(String(parseFloat(d[0]['o'][2]) * 10));
        })
        .radiusValue(function (d: any[]) {
          return parseInt(d[0]['o'][2]);
        });
      this.combineWindSpeedDirection().then((data) => {
        console.log("wind data: ", data);
      });

      //this.regionLayer.addTo(this.layerGroup);
      //this.hexLayer.addTo(this.layerGroup);
      //this.createRainLayer(this.stationsData, mymap);
    });

    this.switchLayer();
  }

  /**
   *
   */
  async addRegionLayer() {
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


  async getData() {
    let data: any[][] = [];
    this.dataService.getTemperaturePerStation().subscribe((weather) => {
      this.stationsData = this.mapperService.weatherToStation(weather);
      this.stationsData.forEach((station) => {
        data.push([station.longitude, station.latitude, station.temp_avg]);
      });
    });
    return data;
  }

  /**
   *
   */
  async getRainData(){
    let data: any[][] = [];
    this.dataService.getRainPerStation().subscribe((weather) => {
      this.stationsData = this.mapperService.weatherToStation(weather);
      this.stationsData.forEach((station) => {
        data.push([station.longitude, station.latitude, station.rain]);
      });
    });
    return data;
  }

  /**
   *
   */
  async getWindData(){
    let data: any[][] = [];
    let tempData : Station[];

    this.dataService.getWindPerStation().subscribe((weather) => {
      tempData = this.mapperService.weatherToStation(weather);
      tempData.forEach((station) => {
          data.push([station.longitude, station.latitude, station.speed]);
        }
      )}
    );

    return data;
  };

  /**
   *
   */
  async getWindDirectionData(){
    let data: any[][] = [];
    let tempData : Station[];

    this.dataService.getWindDirectionPerStation().subscribe((weather) => {
      tempData = this.mapperService.weatherToStation(weather);
      tempData.forEach((station) => {
        data.push([station.angle]);
      }) });
    return data;
  }


  async combineWindSpeedDirection(){
    let data: any[][] = [];
    setTimeout(() => {

      this.getWindData().then( speed => {
        console.log("here ? ", speed);

        console.log("here ? ", speed.at(0));
        speed.forEach(value => console.log("ssd ", value));

        this.getWindDirectionData().then( direction => {
          direction.forEach(value => console.log("directtt ", value));

          for (let i = 0; i < speed.length; i++){

            console.log("speed ? " , speed[i][2]);
            console.log("direct ? " , direction[i][0]);

            data.push([speed[i][0], speed[i][1], speed[i][2], direction[i][0]]);
          }
        })
      });
      console.log(" combine ? ", data);
      return data;   }, 2000);
  }


  ngOnChanges() {
    this.switchLayer();
  }


  switchLayer() {
    console.log(this.layerSelected)
    switch (this.layerSelected) {
      case 'station':
        this.colors = ['white', 'yellow', 'orange', 'red'];
        if(this.mymap.hasLayer(this.hexLayerRain)){
          this.mymap.removeLayer(this.hexLayerRain);
        }
        if(this.mymap.hasLayer(this.regionLayer)){
          this.mymap.removeLayer(this.regionLayer);
        }
        if(this.mymap.hasLayer(this.hexLayer)){
          this.mymap.removeLayer(this.hexLayer);
        }
        if(this.parameterSelected == 'temperature'){
          this.colors = ['white', 'yellow', 'orange', 'red'];
          this.mymap.addLayer(this.hexLayer);
        }
        if(this.parameterSelected == 'rain'){
          this.colors = ['white', '#7DF9FF', '#ADD8E6', '#0000FF',  '#00008B'];
          this.mymap.addLayer(this.hexLayerRain);
        }
        //this.switchParameter(this.parameterSelected);
        break;

      case 'région':
        if(this.mymap.hasLayer(this.hexLayerRain)){
          this.mymap.removeLayer(this.hexLayerRain);
        }
        if(this.mymap.hasLayer(this.hexLayer)){
          this.mymap.removeLayer(this.hexLayer);
        }
        if(this.mymap.hasLayer(this.regionLayer)){
          this.mymap.removeLayer(this.regionLayer);
        }
        if(this.parameterSelected == 'temperature'){
          this.colors = ['white', 'yellow', 'orange', 'red'];
          this.mymap.addLayer(this.regionLayer);
        }
        if(this.parameterSelected == 'rain'){
          this.colors = ['white', '#7DF9FF', '#ADD8E6', '#0000FF',  '#00008B'];
          this.mymap.addLayer(this.hexLayerRain);
        }
        //this.switchParameter(this.parameterSelected);
        break;

    }
  }


  /**
   *
   * @param stations
   * @param mymap
   */
  async createRainLayer(stations: any[], mymap: L.Map) {
    var stationsCoordinates: Station[];
    this.dataService.getRainPerStation().subscribe((weather) => {
      this.stationsData = this.mapperService.weatherToStation(weather);
      this.stationsData.forEach((station) => {
        /*  var marker = L.marker([station.latitude, station.longitude]).bindTooltip(
            station.nom,
            {
              permanent: false,
              direction: 'center',
            }
          );
          marker.setIcon(
            L.icon({
              iconUrl: 'assets/rains.png',
              iconSize: [station.rain * 3, station.rain * 4],
            })
          );
          marker.addTo(this.mymap);
        });
        */

      });
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

  colorMapByTemperature(isee: string) {

    let temperatureData: IAvgTempPerRegion[] = this.dataService.initAvgTempPerRegionData!;
    // Calculate the average temperature
    let averageTemperature = temperatureData.reduce((sum, data) => sum  + Number(data.temp_avg), 0) / temperatureData.length;

    // Calculate the standard deviation of temperatures
    const standardDeviation = Math.sqrt(temperatureData.reduce((sum, data) => sum + Math.pow(data.temp_avg - averageTemperature, 2), 0) / temperatureData.length);

    // Define the color scale
    const colorScale = d3.scaleLinear<string>()
      .domain([averageTemperature - standardDeviation, averageTemperature, averageTemperature + standardDeviation])
      .range([ "#f7ff00","#ff2f00"]);

    let temperature = temperatureData.find(region => region.isee === isee)!.temp_avg;
    // return the color
    return colorScale(temperature);
  }
}
