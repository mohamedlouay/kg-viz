import {Component, OnInit, ElementRef, ViewChild, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import * as d3 from 'd3';
import {ITemperature} from "../../models/data";
import {DataService} from "../../services/data.service";
import {MapperService} from "../../services/mapper.service";
import {rgb, scaleOrdinal, schemeCategory10} from "d3";




@Component({
  selector: 'app-chart-modal',
  templateUrl: './chart-modal.component.html',
  styleUrls: ['./chart-modal.component.css']
})
export class ChartModalComponent implements OnInit {
  @ViewChild('chart', { static: false })
  private chartContainer!: ElementRef ;
  regionData!: ITemperature[] ;
  listStations !: string[];
  message = '';


  // Set the dimensions of the chart
   margin = {top: 20, right: 80, bottom: 20, left: 30};
   width = 1500 - this.margin.left - this.margin.right;
   height = 300 - this.margin.top - this.margin.bottom;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dataService: DataService,
              private mapperService: MapperService,
              ) {

    this.dataService.getTemperaturePerRegion(data.regionCode).subscribe((weather) => {
      this.regionData =this.mapperService.weatherToTemperature(weather);
      this.listStations = this.extractListStation();
      this.createLineChart();
    })



  }
  ngOnInit() {


  }

  private createLineChart(): void {


    // Append the SVG to the chart container
    const svg = d3.select(this.chartContainer.nativeElement).append('svg')
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
    const line = d3.line<ITemperature>()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.temp_avg));

    // Map the data to x and y values
    x.domain(d3.extent(this.regionData, (d: ITemperature) => new Date(d.date)) as [Date, Date]);
    // y.domain([0, (d3.max(this.datas, (d: ITemperature) => d.temp_avg ))] as [number, number]);
    y.domain(this.getMinMaxTemperatures(this.regionData) as [number, number]);


    // Append the x axis
    svg.append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(x));

    // Append the y axis
    svg.append('g')
      .call(d3.axisLeft(y));

    // Append the line path
    const colorScale = scaleOrdinal(schemeCategory10);

    for (const station of this.listStations) {
      const color = rgb(colorScale(station));
      svg.append('path')
        .datum(this.regionData.filter(d => d.station === station))
        .attr('fill', 'none')
        .attr('stroke', color.toString())
        .attr('stroke-width', 1)
        .attr('d', line);
    }

    this.addLegend();

  }

  getMinMaxTemperatures( datas: ITemperature[]): [number, number] {
    const temperatureValues = datas.map(item => item.temp_avg);

    const minTemp = Math.min(...temperatureValues) ;

    const maxTemp =  Math.max(...temperatureValues) ;

    return [minTemp, maxTemp];
  }


  private extractListStation() {
    const listStation = this.regionData.map(item => item.station);
    return  Array.from(new Set(listStation));
  }

  private addLegend() {
    const svg = d3.select(this.chartContainer.nativeElement).select('svg');

    const legendGroup = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${this.width - 100}, ${this.margin.top})`);

    const legendItems = legendGroup.selectAll('.legend-item')
      .data(this.listStations)
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legendItems.append('rect')
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', d => rgb(schemeCategory10[this.listStations.indexOf(d)]).toString());

    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 5)
      .attr('dy', '1.5em')
      .text(d => d);
  }



}
