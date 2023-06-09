import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-information-layer',
  templateUrl: './information-layer.component.html',
  styleUrls: ['./information-layer.component.css']
})
export class InformationLayerComponent {
  @Input() linkedPage!: string;
  @Input() informationDisplay: string = "Temperature mean ";

}
