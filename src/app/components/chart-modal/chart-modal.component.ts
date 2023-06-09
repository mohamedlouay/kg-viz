import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as d3 from 'd3';
import { ITemperature } from '../../models/data';
import { DataService } from '../../services/data.service';
import { MapperService } from '../../services/mapper.service';
import { rgb, scaleOrdinal, schemeCategory10 } from 'd3';

@Component({
  selector: 'app-chart-modal',
  templateUrl: './chart-modal.component.html',
  styleUrls: ['./chart-modal.component.css'],
})
export class ChartModalComponent implements OnInit {
  @ViewChild('chart', { static: false })
  private chartContainer!: ElementRef;
  regionDataFromServer!: ITemperature[];
  regionData!: ITemperature[];
  listStations!: string[];
  message = '';

  startDate = 0;
  endDate = 0;

  // Set the dimensions of the chart
  margin = { top: 20, right: 80, bottom: 20, left: 80 };
  width = 1150 - this.margin.left - this.margin.right;
  height = 300 - this.margin.top - this.margin.bottom;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
    private mapperService: MapperService
  ) {
    this.dataService
      .getTemperaturePerRegion(data.regionCode)
      .subscribe((weather) => {
        this.regionDataFromServer =
          this.mapperService.weatherToTemperature(weather);
        this.regionData = this.regionDataFromServer;
        [this.startDate, this.endDate] = this.getMinMaxDate(this.regionData);
        this.listStations = this.extractListStation();
        this.createLineChart();
      });
  }

  ngOnInit() {}

  private createLineChart(): void {
    // Append the SVG to the chart container
    const svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // Set the scales
    const x = d3.scaleTime().range([0, this.width]);
    const y = d3.scaleLinear().range([this.height, 0]);
    const legendScale = scaleOrdinal()
      .domain(this.listStations)
      .range(schemeCategory10);

    // Define the line function
    // @ts-ignore
    const line = d3
      .line<ITemperature>()
      .x((d) => x(new Date(d.date)))
      .y((d) => y(d.temp_avg));

    // Map the data to x and y values
    x.domain(
      d3.extent(this.regionData, (d: ITemperature) => new Date(d.date)) as [
        Date,
        Date
      ]
    );
    // y.domain([0, (d3.max(this.datas, (d: ITemperature) => d.temp_avg ))] as [number, number]);
    y.domain(this.getMinMaxTemperatures(this.regionData) as [number, number]);

    // Append the x axis
    svg
      .append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(x));

    // Append the y axis
    svg.append('g').call(d3.axisLeft(y));

    // Append the line path
    const colorScale = scaleOrdinal(schemeCategory10);

    for (const station of this.listStations) {
      const color = rgb(colorScale(station));
      svg
        .append('path')
        .datum(this.regionData.filter((d) => d.station === station))
        .attr('fill', 'none')
        .attr('stroke', color.toString())
        .attr('stroke-width', 1)
        .attr('d', line);
    }

    this.addLegend();
  }

  private extractListStation() {
    const listStation = this.regionData.map((item) => item.station);
    return Array.from(new Set(listStation));
  }

  private addLegend() {
    console.log("liste des stations:", this.listStations);
    const svg = d3.select(this.chartContainer.nativeElement).select('svg');

    const legendGroup = svg
      .append('g')
      .style('fill', 'white')
      .attr('class', 'legend')
      .attr(
        'transform',
        `translate(${this.width - 50}, ${this.margin.top - 20})`
      );

    const legendItems = legendGroup
      .selectAll('.legend-item')
      .data(this.listStations)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    console.log("legend items list:", legendItems);

    legendItems
      .append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', (d) =>
        rgb(schemeCategory10[this.listStations.indexOf(d)]).toString()
      );

    legendItems
      .append('text')
      .style("font-size", "0.70em")
      .attr('x', 17)
      .attr('y', 5)
      .attr('dy', '0.3em')
      .text((d) => d);
  }

  handleRangeChangedEvent(range: Date[]) {
    this.regionData = this.filterDataByDateRange(range[0], range[1]);
    this.reCreateLineChart();
  }

  private filterDataByDateRange(startDate: Date, endDate: Date) {
    return this.regionDataFromServer.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  private reCreateLineChart() {
    d3.select(this.chartContainer.nativeElement).select('svg').remove();
    this.createLineChart();
  }
  private getMinMaxTemperatures(datas: ITemperature[]): [number, number] {
    const temperatureValues = datas.map((item) => item.temp_avg);

    const minTemp = Math.min(...temperatureValues);

    const maxTemp = Math.max(...temperatureValues);

    return [minTemp, maxTemp];
  }

  private getMinMaxDate(datas: ITemperature[]) {
    const DateValues = datas.map((item) => new Date(item.date).getTime());

    const startDate = Math.min(...DateValues);

    const endDate = Math.max(...DateValues);
    console.log('getMinMaxDate');
    console.log([startDate, endDate]);
    return [startDate, endDate];
  }
}
