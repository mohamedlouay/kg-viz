import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-parameter-filter',
  templateUrl: './parameter-filter.component.html',
  styleUrls: ['./parameter-filter.component.css']
})
export class ParameterFilterComponent {
  @Output() activeButton: string = "";
  @Output() parameterSelected = new EventEmitter<string>();

  private parameterList : string[] = [
    'wind',
    'humidity',
    'rain',
    'temperature'
  ]
   public layerType: string | undefined;

  constructor() {

  }

  ngOnInit(){
    this.loadRain();
    this.getButtonClass('rain');
    this.layerType = "station";
    this.activeButton = 'region'
  }


  getButtonClass(name: string) {
    return {
      'active': this.activeButton === name
    };
  }
  regionStation(input: string) {
    this.parameterSelected.emit(input);
  }
  loadTemperature() {
    this.activeButton = 'temperature';
    this.parameterSelected.emit(this.activeButton);
  }

  loadWind() {
    this.activeButton = 'wind';
    this.parameterSelected.emit(this.activeButton);
  }

  loadRain() {
    this.activeButton = 'rain';
    this.parameterSelected.emit(this.activeButton);
  }

  loadHumidity() {
    this.activeButton = 'humidity';
    this.parameterSelected.emit(this.activeButton);
  }

}
