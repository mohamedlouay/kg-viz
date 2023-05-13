import {Component, EventEmitter, Output} from '@angular/core';
import {MatSliderChange} from "@angular/material/slider";

@Component({
  selector: 'app-time-brush',
  templateUrl: './time-brush.component.html',
  styleUrls: ['./time-brush.component.css']
})
export class TimeBrushComponent {
  // @Output() rangeChanged = new EventEmitter<Date[]>();
  minValue: number;
  maxValue: number;
  sliderValues: number[] = [];


  constructor() {
    this.minValue = new Date('2023-05-01').getTime();
    this.maxValue = new Date('2023-05-25').getTime();
    // Initialiser les valeurs du curseur (début et fin) avec les valeurs minimales et maximales
    this.sliderValues = [this.minValue, this.maxValue];
  }


  onSliderChange() {
    const startDate = new Date(this.sliderValues[0]);
    const endDate = new Date(this.sliderValues[1]);

    console.log('Début :', this.sliderValues[0]);
    console.log('Fin :', this.sliderValues[1]);

  }


  display(value: number) {
    const date = new Date(value);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

}
