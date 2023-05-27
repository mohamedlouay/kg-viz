import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import * as d3 from 'd3';
import * as hexbin from 'd3-hexbin';
import * as L from 'leaflet';
import {HexbinLayerConfig} from 'leaflet';
import {ChartModalComponent} from '../chart-modal/chart-modal.component';
import {DataService} from '../../services/data.service';
import {MapperService} from '../../services/mapper.service';
import {IAvgTempPerRegion, Station} from '../../models/data';

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

  private hexbinOptions!: HexbinLayerConfig;

  constructor(
    private dialog: MatDialog,
    private dataService: DataService,
    private mapperService: MapperService
  ) {}

  ngOnInit(): void {
    const hexLayout = hexbin.hexbin();
    this.hexbinOptions = {
      radius: 10,
      opacity: 0.7,
      duration: 500,
    };

    // Création de la carte centrée sur la
    var mymap = L.map('map').setView([46.227638, 2.213749], 6);

    // Ajout du fond de carte OpenStreetMap
    const layer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }
    ).addTo(mymap);

    //ajustement de la luminosité de la map
    layer.getContainer()!.style.filter = 'brightness(75%)';
    // Chargement des données des régions
    fetch(
      'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions.geojson'
    )
      .then((response) => response.json())
      .then((data) => {


        // Création d'une couche GeoJSON pour les régions avec une couleur de remplissage basée sur la densité de population
        var regionLayer = L.geoJSON(data, {
          style: (feature) => {
            var regionIsee = feature!.properties.code;
            return {
              fillColor:this.colorMapByTemperature(regionIsee),
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
        regionLayer.addTo(mymap);
      })
      .catch((error) => console.error(error));

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
      /*
    var map = L.map("map", {
      maxBounds: franceBounds, // Set maximum bounds of the map
      maxBoundsViscosity: 1.0, // Make sure the user cannot drag the map out of bounds
    }).setView([47, 2], 5);
    */
      this.colorScale = d3
        .scaleLinear()
        .domain([5, 15, 18, 28])
        .range([0, 5, 10, 30]);

      this.hexLayer = L.hexbinLayer(this.hexbinOptions);
    this.hexLayer
      .colorScale(this.colorScale);
    this.hexLayer.colorRange(["white", "yellow", "orange", "red", "darkred"]);

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
        return parseInt(d[0]["o"][2]);
      })
      .radiusValue(function (d: any[]) {
        return parseInt(d[0]["o"][2]);
      });
    this.createRainLayer(this.stationsData, mymap);

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

  async createRainLayer(stations: any[], mymap:L.Map ){
   var stationsCoordinates : Station[];

    this.dataService.getTemperaturePerStation().subscribe((weather) => {
      stationsCoordinates = this.mapperService.weatherToStation(weather);
      this.dataService.getRainPerStation().subscribe((weather) => {
        this.stationsData = this.mapperService.weatherToStation(weather);
        stationsCoordinates.forEach((st) => {
        this.stationsData.forEach((station) => {
          L.marker([st.latitude, st.longitude], {
            icon: L.icon({
              iconUrl: 'assets/rains.png',
              iconSize: [station.rain * 3, station.rain* 4],
            })
          }).addTo(mymap)
        });})
      });
    });
  }
  private openModal<G, P>(feature: any) {
    const dialogRef = this.dialog.open(ChartModalComponent, {
      data: {
        regionCode: feature.properties.code,
      },
      position: { bottom: '0px' },
      panelClass: 'full-width-dialog'
    });
  }

  protected readonly console = console;


 colorMapByTemperature(isee: string) {

   let temperatureData: IAvgTempPerRegion[] = this.dataService.initAvgTempPerRegionData!;
   console.log(temperatureData);
   // Calculate the average temperature
   let averageTemperature = temperatureData.reduce((sum, data) => sum  + Number(data.temp_avg), 0) / temperatureData.length;
   console.log(averageTemperature);
   averageTemperature = 24 ;

   // Calculate the standard deviation of temperatures
   const standardDeviation = Math.sqrt(temperatureData.reduce((sum, data) => sum + Math.pow(data.temp_avg - averageTemperature, 2), 0) / temperatureData.length);

   // Define the color scale
   const colorScale = d3.scaleLinear<string>()
     .domain([averageTemperature - standardDeviation, averageTemperature, averageTemperature + standardDeviation])
     .range([ "#fed976", "#fd8d3c"]);

   let temperature = temperatureData.find(region => region.isee === isee)!.temp_avg;
   console.log(colorScale(temperature));
   // return the color
   return colorScale(temperature);
 }



}
