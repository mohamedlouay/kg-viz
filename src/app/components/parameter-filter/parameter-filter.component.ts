import { Component } from '@angular/core';

@Component({
  selector: 'app-parameter-filter',
  templateUrl: './parameter-filter.component.html',
  styleUrls: ['./parameter-filter.component.css']
})
export class ParameterFilterComponent {
  activeButton: string ="";

  private parameterList : string[] = [
    'wind',
    'humidity',
    'rain',
    'temperature'
  ]
   public layerType: string | undefined;

  ngOnInit(){
    this.loadRain();
    this.getButtonClass('rain');
    this.layerType = "station";
  }

  getButtonClass(name: string) {
    return {
      'active': this.activeButton === name
    };
  }
  loadTemperature() {
    this.activeButton = 'temperature';
  }

  loadWind() {
    this.activeButton = 'wind';
  }

  loadRain() {
    this.activeButton = 'rain';
  }

  loadHumidity() {
    this.activeButton = 'humidity';
  }

}
