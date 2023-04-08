import { Component, OnInit  ,AfterViewInit} from '@angular/core';
import * as L from 'leaflet';
import {DataMockService} from "../services/data-mock.service";
import {DataService} from "../services/data.service";
import {MapperService} from "../services/mapper.service";
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {

  constructor(private dataService : DataService  ,private mapperService : MapperService) {
    this.dataService.getTemperaturePerRegion(93).subscribe((weather)=>{
      console.log(this.mapperService.weatherToTemperature(weather));
    })
  }

  ngOnInit(): void {
    // Création de la carte centrée sur la
    var mymap = L.map('map').setView([46.227638, 2.213749], 6);

    // Ajout du fond de carte OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(mymap);

    // Chargement des données des régions
    fetch(
      'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions.geojson'
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Calcul de la valeur maximale de la densité de population
        var maxPopulationDensity = 0;
        data.features.forEach((region :any) => {
          var populationDensity = region.properties.code;
          if (populationDensity > maxPopulationDensity) {
            maxPopulationDensity = populationDensity;
          }
        });
        // Création d'une fonction de couleur pour la choropleth map
        function getColor(d:number) {
          return d > maxPopulationDensity * 0.8
            ? '#bd0026'
            : d > maxPopulationDensity * 0.6
            ? '#f03b20'
            : d > maxPopulationDensity * 0.4
            ? '#fd8d3c'
            : d > maxPopulationDensity * 0.2
            ? '#feb24c'
            : '#fed976';
        }
        // Création d'une couche GeoJSON pour les régions avec une couleur de remplissage basée sur la densité de population
        var regionLayer = L.geoJSON(data, {
          style: function (feature) {
            var populationDensity = feature!.properties.code;
            return {
              fillColor: getColor(populationDensity),
              fillOpacity: 0.7,
              weight: 1,
              color: 'black'
            };
          },
          onEachFeature: function (feature, layer) {
            // Ajout d'une popup
            layer.bindPopup(
              feature.properties.nom +
                '<br/>' +
                (feature.properties.code *
                  Math.floor(Math.random() * 100) +
                  1) +
                ' habitants au km²'
            );
          }
        });
        // Ajout de la couche à la carte
        regionLayer.addTo(mymap);
        // Ajout de la légende pour la choropleth map
        var legend = L.control.attribution({ position: 'bottomright' });
        legend.onAdd = function () {
          var div = L.DomUtil.create('div', 'info legend');
          var grades = [        0,        maxPopulationDensity * 0.2,        maxPopulationDensity * 0.4,        maxPopulationDensity * 0.6,        maxPopulationDensity * 0.8      ];
          div.innerHTML = '<h4>Densité de population</h4>';
          for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
              '<div class="legend-item"><span style="background-color: ' +
              getColor(grades[i] + 1) +
              '"></span> ' +
              grades[i] +
              (grades[i + 1] ? '–' + grades[i + 1] + ' hab/km²<br/>' : '+ hab/km²</div>');
          }
          return div;
        };
        legend.addTo(mymap);
      })
      .catch((error) => console.error(error));
    }
  }
