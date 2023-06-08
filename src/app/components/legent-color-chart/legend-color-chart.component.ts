import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-legend-color-chart',
  templateUrl: './legend-color-chart.component.html',
  styleUrls: ['./legend-color-chart.component.css']
})
export class LegendColorChartComponent {
  @Input() scale1: number | undefined;
  @Input() scale2: number | undefined;
  @Input() scale3: number | undefined;
  @Input() scale4: number | undefined;
  @Input() scale5: number | undefined;
  @Input() color1!: string;
  @Input() color2!: string;
  @Input() color3!: string;
  @Input() color4!: string;
  @Input() color5!: string;
  @Input() colors!: string[];

  gradientBar! : HTMLElement;
  indicators! : HTMLCollectionOf<Element>;
  counter!: number;

  ngOnInit() {
    this.gradientBar = document.getElementById("gradient-bar")!;
    this.indicators = document.getElementsByClassName("indicator")!;
    let barHeight = this.gradientBar.offsetHeight;
    let numberOfIndicators = this.indicators.length;
    this.counter = 0;
    //creating space between each indicator text legend
    for (let x = 0; x < numberOfIndicators; x++) {
      let topValue = this.counter + "px";
      this.indicators[x].setAttribute("style", "top:" + topValue);
      this.counter += barHeight / numberOfIndicators + 0;
      console.log("counter: ", this.counter);
    }
    this.changeColor();
  }

  ngOnChanges(){
    this.changeColor();
  }
    //changing gradient colors
  changeColor(){
      document.documentElement.style.setProperty('--color1', this.color1+'');
      document.documentElement.style.setProperty('--color2', this.color2+'');
      document.documentElement.style.setProperty('--color3', this.color3+'');
      document.documentElement.style.setProperty('--color4', this.color4+'');
      document.documentElement.style.setProperty('--color5', this.color5+'');
  }


}
