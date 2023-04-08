

import * as d3 from 'd3';
import {Component, ElementRef, OnInit, AfterViewInit,ViewChild} from "@angular/core";
export interface LineData {
  name : string;
  value: number;
}
@Component({
  selector: 'app-bar-chart',
  template: '<svg #chart></svg>',
})
export class BarChartComponent implements OnInit {
  ngOnInit(): void {
  }
  @ViewChild('chart') private chartContainer!: ElementRef;
  private data: any[] = [
    { name: 'Apples', value: 10 },
    { name: 'Oranges', value: 20 },
    { name: 'Bananas', value: 5 },
  ];

  ngAfterViewInit(): void {
    const chartElement = this.chartContainer.nativeElement;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = chartElement.clientWidth - margin.left - margin.right;
    const height = chartElement.clientHeight - margin.top - margin.bottom;

    const svg = d3.select(chartElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1)
      .domain(this.data.map((d:LineData) => d.name));

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(this.data, d => d.value)]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .call(d3.axisLeft(y));

    svg.selectAll('.bar')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.name)!)
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.value));
  }
}

