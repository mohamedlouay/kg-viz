import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MapComponent} from "../map/map.component";

@Component({
  selector: 'app-visualisation-page',
  templateUrl: './visualisation-page.component.html',
  styleUrls: ['./visualisation-page.component.css']
})
export class VisualisationPageComponent {
 @Output() activeLayer!: string;
  @Output() layerSelected = new EventEmitter<string>();
 @Input() colors: string[] | undefined;
constructor(
) {
}
  switchLayer($event: string) {
    this.activeLayer = $event;
    this.layerSelected.emit(this.activeLayer);
  }
}

