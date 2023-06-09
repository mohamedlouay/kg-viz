import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-time-brush',
  templateUrl: './time-brush.component.html',
  styleUrls: ['./time-brush.component.css'],
})
export class TimeBrushComponent implements OnInit {
  public tooltip: Object = {placement: 'After', isVisible: true, showOn: 'Always',};
  @Output() rangeChanged = new EventEmitter<Date[]>();
  @Input() startDate = 0;
  @Input() endDate = 0;
  sliderValues: number[] = [];
  readonly stepOneDay = 86400000 * 30;
  readonly stepTenDays = 86400000 * 30;
  readonly oneMonth = 86400000 * 30;
  step: number;

  constructor() {
    this.step = this.oneMonth;
  }

  ngOnInit(): void {
    console.log([this.startDate, this.endDate]);
    this.sliderValues = [this.startDate, this.endDate];
  }

  /**
   * Get the value of the time period given the time brush
   * each time the slider is moved
   */
  onSliderChange() {
    const startDate = new Date(this.sliderValues[0]);
    const endDate = new Date(this.sliderValues[1]);
    this.updateStep();
    this.rangeChanged.emit([startDate, endDate]);
  }

  /**
   * Used to get the time value displayed in the tooltip of the timebrush
   * @param value
   */
  display(value: number) {
    const date = new Date(value);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Update the step of the time line optimaly
   * @private
   */
  private updateStep() {
    if (this.sliderValues[1] - this.sliderValues[0] < this.oneMonth) {
      this.step = this.stepOneDay;
    } else {
      this.step = this.stepTenDays;
    }
  }
}
