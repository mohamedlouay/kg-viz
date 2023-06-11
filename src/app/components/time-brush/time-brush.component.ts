import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation} from '@angular/core';

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
  @Output() selectedYearChanged = new EventEmitter<number>();
  sliderValues: number[] = [];
  readonly stepOneDay = 86400000 * 30;
  readonly stepTenDays = 86400000 * 30;
  readonly oneMonth = 86400000 * 30;
  step: number;
  years: number[] = [2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012];
  selectedYear = 2022;


  constructor() {
    this.step = this.oneMonth;
  }

  ngOnInit(): void {
    this.sliderValues = [this.startDate, this.endDate];
  }

  /**
   * Check if the 'startDate' input property has changed
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['startDate']) {
      this.sliderValues = [this.startDate, this.endDate];

    }
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

  /**
   * this method is use to emit an event with the value of the year selected on the time brush
   */
  onYearChanged() {
    this.selectedYearChanged.emit(this.selectedYear);
  }
}
