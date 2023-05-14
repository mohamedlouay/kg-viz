import { Component } from '@angular/core';
import {Options} from "ng5-slider";

@Component({
  selector: 'app-time-brush',
  templateUrl: './time-brush.component.html',
  styleUrls: ['./time-brush.component.css']
})
export class TimeBrushComponent {
  private currentValues: number[] | undefined;
  value: number = 40;
  highValue: number = 60;
  options: Options = {
    floor: 0,
    ceil: 100
  };
  /*Method to listen for onChange event from slider*/

  onSliderChange(selectedValues: number[]) {
    this.currentValues = selectedValues;
  }
}
