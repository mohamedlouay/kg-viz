import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-legent-color-chart',
  templateUrl: './legend-color-chart.component.html',
  styleUrls: ['./legend-color-chart.component.css']
})
export class LegendColorChartComponent {
  @Input() scale1: string | undefined;
  @Input() scale2: string | undefined;
  @Input() scale3: string | undefined;
  @Input() scale4: string | undefined;
  @Input() scale5: string | undefined;
  @Input() color1!: string;
  @Input() color2!: string;
  @Input() color3!: string;
  @Input() color4!: string;
  @Input() color5!: string;

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
      this.indicators[x].setAttribute("style", "top:"+topValue);
      this.counter += barHeight / numberOfIndicators + 3;
      console.log("counter: ",this.counter);
    }

    //changing gradient colors
    document.documentElement.style.setProperty('--color1', this.color1+''); //suffix may be px or ''
    document.documentElement.style.setProperty('--color2', this.color2+''); //suffix may be px or ''
    document.documentElement.style.setProperty('--color3', this.color3+''); //suffix may be px or ''
    document.documentElement.style.setProperty('--color4', this.color4+''); //suffix may be px or ''
    document.documentElement.style.setProperty('--color5', this.color5+''); //suffix may be px or ''

  }


}
