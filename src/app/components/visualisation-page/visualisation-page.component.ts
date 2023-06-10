import {Component, EventEmitter, Input, Output} from '@angular/core';
import {active} from "d3";

@Component({
  selector: 'app-visualisation-page',
  templateUrl: './visualisation-page.component.html',
  styleUrls: ['./visualisation-page.component.css']
})
export class VisualisationPageComponent {
  @Output() activeLayer!: string;
  @Output() parameterSelected = new EventEmitter<string>();
  @Output() layerSelected = new EventEmitter<string>();
  @Output() legendScaleTest = new EventEmitter<number>();
  @Output() color1: string = '';
  @Output() color2: string = '';
  @Output() color3: string = '';
  @Output() color4: string = '';
  @Output() color5: string = '';
  @Output() scale1!: number;
  @Output() scale2!: number;
  @Output() scale3!: number;
  @Output() scale4!: number;
  @Output() scale5!: number;
  @Output() parameterChosen!: string;
  @Input() legendScale!: number[];
  @Output() legendScaleTestValue!: number[];
  legend: string = "";
  scaleUnit: string = "";
  link: string = "";
  disabled: boolean = false;


  ngOnInit() {
    this.switchParameter("temperature");
    this.switchActiveButton("region");
  }

  ngOnChanges() {
    this.switchParameter(this.activeLayer);
    this.getLegendScale([0, 1, 2, 3, 4]);
    this.switchActiveButton(this.activeLayer);
    console.log("activelayer,", this.activeLayer);
  }

  /**
   * Send event when parameter selected is changed
   * and get the color corresponding
   * @param $event
   */
  switchParameter($event: string) {
    this.parameterChosen = $event;
    this.parameterSelected.emit(this.parameterChosen);
    this.legendColorGetter(this.parameterChosen);
  }


  switchActiveButton(layerSelected: string) {
    if (layerSelected == "station") {
      this.disabled = false;
    }
    if (layerSelected == "région") {
      this.disabled = true;
    }
  }

  /**
   * Get the corresponding color according to the parameter selected
   * and send it to the css variable of the parameter-filter component
   * @param activeLayerParameter
   */
  legendColorGetter(activeLayerParameter: string) {
    if (activeLayerParameter == 'rain') {
      this.legend = "Cumulative rainfall";
      this.link = "http://weakg.i3s.unice.fr/ontology/#http://ns.inria.fr/meteo/vocab/weatherproperty/precipitationAmount";
      this.scaleUnit = "mm";
      this.color5 = 'white';
      this.color4 = '#ADD8E6';
      this.color3 = '#7DF9FF';
      this.color2 = '#0000FF';
      this.color1 = '#00008B'
    }

    if (activeLayerParameter == 'temperature') {
      this.legend = "Mean Air Temperature "
      this.link = "http://weakg.i3s.unice.fr/ontology/#http://ns.inria.fr/meteo/vocab/weatherproperty/airTemperature";
      this.scaleUnit = "°C";
      this.color5 = '#fed976';
      this.color4 = '#feb24c';
      this.color3 = '#fd8d3c';
      this.color2 = '#f03b20';
      this.color1 = '#bd0327'
    }

    if (activeLayerParameter == 'humidity') {
      this.legend = "Mean Air Humidity"
      this.scaleUnit = "%";
      this.color5 = '#E6E6FA';
      this.color4 = '#E0B0FF';
      this.color3 = '#E0B0FF';
      this.color2 = '#DA70D6';
      this.color1 = '#800080';
    }
    if (activeLayerParameter == 'wind') {
      this.legend = "Wind Average Speed"
      this.link = "http://weakg.i3s.unice.fr/ontology/#http://ns.inria.fr/meteo/vocab/weatherproperty/windSpeed";
      this.scaleUnit = "m/s"
      this.color5 = '#ECFFDC';
      this.color4 = '#C1E1C1';
      this.color3 = '#93C572';
      this.color2 = '#93C572';
      this.color1 = '#008000';
    }
  }

  /**
   * send event when the filter parameter selected is changed
   * @param $event
   */
  switchLayer($event: string) {
    console.log("activelayer,", this.activeLayer);
    this.activeLayer = $event;
    this.layerSelected.emit(this.activeLayer);
    this.switchActiveButton(this.activeLayer);
  }

  /**
   * Adding the value scale of the map legend component
   * @param $event
   */
  getLegendScale($event: number[]) {
    this.legendScaleTestValue = $event;
    this.scale1 = this.legendScaleTestValue[0];
    this.scale2 = this.legendScaleTestValue[1];
    this.scale3 = this.legendScaleTestValue[2];
    this.scale4 = this.legendScaleTestValue[3];
    this.scale5 = this.legendScaleTestValue[4];

  }
}

