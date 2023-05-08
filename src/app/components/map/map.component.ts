import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import * as L from "leaflet";
import {ChartModalComponent} from "../chart-modal/chart-modal.component";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {



  constructor(private dialog: MatDialog) {

  }

  ngOnInit(): void {
    // Création de la carte centrée sur la
    var mymap = L.map('map').setView([46.227638, 2.213749], 6);

    // Ajout du fond de carte OpenStreetMap
    const layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(mymap);

    //ajustement de la luminosité de la map
    layer.getContainer()!.style.filter = 'brightness(75%)';




    // Chargement des données des régions
    fetch(
      'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions.geojson'
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
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
        var regionLayer = L.geoJSON(data, {
          style: function (feature) {
            var populationDensity = feature!.properties.code;
            return {
              fillColor: getColor(populationDensity),
              fillOpacity: 0.75,
              weight: 1,
              color: 'black',
            };
          },
          onEachFeature:  (feature, layer ) => {
            layer.on('click', () => {
              this.openModal(feature);
            });
          }


        });
        // Ajout de la couche à la carte
        regionLayer.addTo(mymap);


      })
      .catch((error) => console.error(error));
  }


  private openModal<G, P>(feature: any) {
    const dialogRef = this.dialog.open(ChartModalComponent, {

      data: {
        regionName: feature.properties.nom,
        regionCode:feature.properties.code
      }
    });
  }
}
