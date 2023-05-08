import { Component } from '@angular/core';
import { ItemModel } from '@syncfusion/ej2-angular-splitbuttons';

@Component({
  selector: 'app-information-layer',
  templateUrl: './information-layer.component.html',
  styleUrls: ['./information-layer.component.css']
})
export class InformationLayerComponent {
// Initialize content.
  public items: ItemModel[] = [
    {
      text: 'The recent trend of adopting linked-data principles to integrate and publish\n' +
        '      semantically described open data using W3C standards has led to a large amount\n' +
        '      of available resources. In particular, meteorological sensor data have been uplifted\n' +
        '      into public weather-focused RDF graphs, such as WeKG-MF which offers access to a large\n' +
        '      set of meteorological variables described through spatial and temporal dimensions. Nevertheless,\n' +
        '      these resources include huge numbers of raw observations that are tedious to explore by lay users.\n' +
        '      In this article, we aim at providing them with visual exploratory "tours", benefiting from RDF data\n' +
        '      cubes to present high-level aggregated views together with on-demand fine-grained details through a\n' +
        '      unified Web interface.'
    }
    ];

}
