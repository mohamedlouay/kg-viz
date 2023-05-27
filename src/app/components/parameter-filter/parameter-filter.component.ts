import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-parameter-filter',
  templateUrl: './parameter-filter.component.html',
  styleUrls: ['./parameter-filter.component.css']
})
export class ParameterFilterComponent {
  @Output() activeButton: string = "";
  @Output() parameterSelected = new EventEmitter<string>();
  @Output() layerSelected = new EventEmitter<string>();

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
    this.loadTemperature();
    this.getButtonClass('temperature');
    this.layerType = "région";
    this.activeButton = 'temperature';
    this.regionStation('région');
  }

  getButtonClass(name: string) {
    return {
      'active': this.activeButton === name
    };
  }

  regionStation(input: string) {
    this.layerSelected.emit(input);
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
