import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-time-brush',
  templateUrl: './time-brush.component.html',
  styleUrls: ['./time-brush.component.css'],
})
export class TimeBrushComponent implements OnInit {
  @Output() rangeChanged = new EventEmitter<Date[]>();

  @Input() startDate = 0;

  @Input() endDate = 0;
  sliderValues: number[] = [];

  constructor() {}

  ngOnInit(): void {
    console.log([this.startDate, this.endDate]);
    this.sliderValues = [this.startDate, this.endDate];
  }

  onSliderChange() {
    const startDate = new Date(this.sliderValues[0]);
    const endDate = new Date(this.sliderValues[1]);

    this.rangeChanged.emit([startDate, endDate]);
  }

  display(value: number) {
    const date = new Date(value);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
