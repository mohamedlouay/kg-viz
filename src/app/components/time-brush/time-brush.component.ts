import { Component } from '@angular/core';

@Component({
  selector: 'app-time-brush',
  templateUrl: './time-brush.component.html',
  styleUrls: ['./time-brush.component.css']
})
export class TimeBrushComponent {

ngOnInit() {
    document.getElementById("#flat-slider")?.getAttribute   !.style.color = 'white';
}

$.extend( $.ui.slider.prototype.options, { 
    animate: 300
});

$("#flat-slider")
    .slider({
        max: 50,
        min: 0,
        range: true,
        values: [15, 35]
    })
    .slider("pips", {
        first: "pip",
        last: "pip"
    });

$("#flat-slider-vertical-1")
    .slider({
        max: 25,
        min: 0,
        range: "min",
        value: 25,
        orientation: "vertical"
    });

    $("#flat-slider-vertical-2")
    .slider({
        max: 25,
        min: 0,
        range: "max",
        value: 12,
        orientation: "vertical"
    });

$("#flat-slider-vertical-3")
    .slider({
        max: 25,
        min: 0,
        range: "min",
        value: 0,
        orientation: "vertical"
    });

    $("#flat-slider-vertical-1, #flat-slider-vertical-2, #flat-slider-vertical-3")
    .slider("pips", {
        first: "pip",
        last: "pip"
    })
    .slider("float");              

}