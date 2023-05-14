import { Component, Input } from '@angular/core';
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
  stationsData: Station[] = [];
  mymap: L.Map ;
  layer: L.TileLayer;
  regionLayer: any;

  @Input() activeButton: string | undefined;

  private hexbinOptions!: HexbinLayerConfig;

  constructor(
    private dialog: MatDialog,
    private dataService: DataService,
    private mapperService: MapperService
  ) {

   this.mymap = L.map('map').setView([46.227638, 2.213749], 6);
    this.layer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }
    ).addTo(this.mymap);
  }

  ngOnInit(): void {
  console.log("LAYER ", this.layer);
  console.log("mymaponinit", this.mymap);
    this.hexbinOptions = {
      radius: 10,
      opacity: 0.7,
      duration: 500,
    };
    // Création de la carte centrée sur la
    // Ajout du fond de carte OpenStreetMap


    //ajustement de la luminosité de la map
    this.layer.getContainer()!.style.filter = 'brightness(75%)';
    // Chargement des données des régions

    this.addRegionLayer().then( () => {
      console.log('region ', this.regionLayer);

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

      (this.colorScale = d3
        .scaleLinear()
        .domain([5, 15, 18, 28])
        .range([0, 5, 10, 30]));

    this.hexLayer = L.hexbinLayer(this.hexbinOptions);
    this.hexLayer.colorScale(this.colorScale);
    this.hexLayer.colorRange(['white', 'yellow', 'orange', 'red', 'darkred']);

    // Use the getData function to access the fully populated data
    this.getData().then((data) => {
      this.hexLayer._data = data;
    });

    this.hexLayer
      .radiusRange([10, 15, 20, 25, 30])
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
    //this.createRainLayer(this.stationsData, mymap);
    // @ts-ignore
    //this.switchLayer();
    });
  }
  async addRegionLayer(){
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
        this.regionLayer.addTo(this.mymap);
      })
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

  switchLayer($event: string) {
    console.log('event', $event);
    switch ($event) {
      case 'temperature':
        console.log("temp ? : ", this.regionLayer);
       this.mymap = this.mymap.addLayer(this.regionLayer);
    }
  }
  async createRainLayer(stations: any[], mymap: L.Map) {
    var stationsCoordinates: Station[];

    this.dataService.getTemperaturePerStation().subscribe((weather) => {
      stationsCoordinates = this.mapperService.weatherToStation(weather);
      this.dataService.getRainPerStation().subscribe((weather) => {
        this.stationsData = this.mapperService.weatherToStation(weather);
        stationsCoordinates.forEach((st) => {
        this.stationsData.forEach((station) => {
          var marker = L.marker([st.latitude, st.longitude]).bindTooltip(
            "station-name",
              {
                permanent: false,
                direction: 'center'
              });
          marker.setIcon(L.icon({
            iconUrl:'assets/rains.png',
            iconSize:[station.rain * 3, station.rain* 4]
          }));
          marker.addTo(mymap);
        });})
      });
    });
  }
  private openModal<G, P>(feature: any) {
    const dialogRef = this.dialog.open(ChartModalComponent, {
      data: {
        regionName: feature.properties.nom,
        regionCode: feature.properties.code,
      },
      position: { bottom: '0px', top: '20%' },
      panelClass: 'custom-dialog',
    });
  }

  protected readonly console = console;


}
