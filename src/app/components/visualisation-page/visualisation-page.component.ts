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
  @Output() color1: string = '#7DF9FF';
  @Output() color2: string = '#7DF9FF';
  @Output() color3: string = '#7DF9FF';
  @Output() color4: string = '#7DF9FF';
  @Output() color5: string = '#7DF9FF';
  @Output() parameterChosen!: string;

 constructor() {}

  ngOnInit(){
   this.switchParameter("temperature");
  }

  ngOnChanges(){
   this.switchParameter(this.activeLayer);
  }

  switchParameter($event: string) {
    this.parameterChosen = $event;
    console.log(this.parameterChosen)
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
  }

  switchLayer($event: string) {
    this.activeLayer = $event;
    console.log(this.activeLayer)
    this.layerSelected.emit(this.activeLayer);
   // this.legendColorGetter(this.parameterChosen);
  }
}

