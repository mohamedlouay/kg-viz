import {Component, Input, SimpleChanges} from '@angular/core';
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
import { Station } from '../../models/data';
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
  //mymap: L.Map;

  regionLayer: any;

  mymap: any;

  @Input() layer: string | undefined;

  private hexbinOptions!: HexbinLayerConfig;

  constructor(
    private dialog: MatDialog,
    private dataService: DataService,
    private mapperService: MapperService
  ) {
  }

  ngOnInit(): void {

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
            layer.bindTooltip(
              feature.properties.nom,
              {
                permanent:false,
                direction:'center',
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

      this.hexLayerRain.colorRange(['white', '#7DF9FF', '#ADD8E6', '#0000FF',  '#00008B']);

      this.getRainData().then((data) => {
        this.hexLayerRain._data = data;
        console.log("rain data: " ,this.hexLayerRain._data);
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
      //this.regionLayer.addTo(this.layerGroup);
      //this.hexLayer.addTo(this.layerGroup);
      //this.createRainLayer(this.stationsData, mymap);
    });

  }
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
  ngOnChanges() {
      this.switchLayer();
  }
  switchLayer() {
    switch (this.layer) {
      case 'station':
        if(this.mymap.hasLayer(this.hexLayerRain)){
          this.mymap.removeLayer(this.hexLayerRain);
        }
        if(this.mymap.hasLayer(this.regionLayer)){
          this.mymap.removeLayer(this.regionLayer);
        }
        this.mymap.addLayer(this.hexLayer);
        break;
      case 'temperature':
        if(this.mymap.hasLayer(this.hexLayerRain)){
          this.mymap.removeLayer(this.hexLayerRain);
        }
        if(this.mymap.hasLayer(this.regionLayer)){
          this.mymap.removeLayer(this.regionLayer);
        }
        this.mymap.addLayer(this.hexLayer);
        break;
      case 'région':
        if(this.mymap.hasLayer(this.hexLayerRain)){
          this.mymap.removeLayer(this.hexLayerRain);
        }
        if(this.mymap.hasLayer(this.hexLayer)){
          this.mymap.removeLayer(this.hexLayer);
        }
        this.mymap.addLayer(this.regionLayer);
        break;
      case 'rain':
        if(this.mymap.hasLayer(this.regionLayer)){
          this.mymap.removeLayer(this.regionLayer);
        }
        if(this.mymap.hasLayer(this.hexLayer)){
          this.mymap.removeLayer(this.hexLayer);
        }
        this.mymap.addLayer(this.hexLayerRain);
        break;
    }
  }
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

  protected readonly console = console;
}
