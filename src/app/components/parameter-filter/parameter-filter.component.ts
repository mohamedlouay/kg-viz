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

  selectParameter(parameter: string) {
    console.log("clicked on: ", parameter);
    //var color = document.getElementById(parameter)!.style.setProperty('color','red');// .color;
    document.body.style.background = 'yellow';
    for (const param in this.parameterList) {
      if(this.parameterList[param] != parameter) {
        document.getElementById(parameter)!.style.color = 'white';
      }
    }
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
