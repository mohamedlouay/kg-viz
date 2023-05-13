import { Component } from '@angular/core';

@Component({
  selector: 'app-time-brush',
  templateUrl: './time-brush.component.html',
  styleUrls: ['./time-brush.component.css']
})
export class TimeBrushComponent {
  private currentValues: number[] | undefined;

  /*Method to listen for onChange event from slider*/

  onSliderChange(selectedValues: number[]) {
    this.currentValues = selectedValues;
  }
}
