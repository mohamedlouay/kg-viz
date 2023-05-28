import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MapComponent} from "../map/map.component";

@Component({
  selector: 'app-visualisation-page',
  templateUrl: './visualisation-page.component.html',
  styleUrls: ['./visualisation-page.component.css']
})
export class VisualisationPageComponent {
  @Output() activeLayer!: string;
  @Output() parameterSelected = new EventEmitter<string>();
  @Output() layerSelected = new EventEmitter<string>();
  @Output() legendScaleEvent = new EventEmitter<string>();

  @Output() color1: string = '#7DF9FF';
  @Output() color2: string = '#7DF9FF';
  @Output() color3: string = '#7DF9FF';
  @Output() color4: string = '#7DF9FF';
  @Output() color5: string = '#7DF9FF';
  @Output() parameterChosen!: string;
  @Input() legendScale!:number[];

 constructor() {}

  ngOnInit(){
   this.switchParameter("temperature");
  }

  ngOnChanges(){
   this.switchParameter(this.activeLayer);
  }

  switchParameter($event: string) {
    this.parameterChosen = $event;
    this.parameterSelected.emit(this.parameterChosen);
    this.legendColorGetter(this.parameterChosen);
  }

  legendColorGetter(activeLayerParameter: string){
   if(activeLayerParameter == 'rain'){
     this.color5 = 'white';
     this.color4 = '#ADD8E6';
     this.color3 = '#7DF9FF';
     this.color2 = '#0000FF';
     this.color1 = '#00008B'
   }

   if(activeLayerParameter == 'temperature'){
     this.color5 = '#fed976';
     this.color4 = '#feb24c';
     this.color3 = '#fd8d3c';
     this.color2 = '#f03b20';
     this.color1 = '#bd0327'
   }

    if(activeLayerParameter == 'humidity'){
      this.color5 = '#E6E6FA';
      this.color4 = '#E0B0FF';
      this.color3 = '#E0B0FF';
      this.color2 = '#DA70D6';
      this.color1 = '#800080';
    }
    if(activeLayerParameter == 'wind'){
      this.color5 = '#ECFFDC';
      this.color4 = '#C1E1C1';
      this.color3 = '#93C572';
      this.color2 = '#93C572';
      this.color1 = '#008000';
    }
  }

  switchLayer($event: string) {
    this.activeLayer = $event;
    console.log(this.activeLayer)
    this.layerSelected.emit(this.activeLayer);
   // this.legendColorGetter(this.parameterChosen);
  }
}

