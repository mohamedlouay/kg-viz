import { Component } from '@angular/core';

@Component({
  selector: 'app-time-brush',
  templateUrl: './time-brush.component.html',
  styleUrls: ['./time-brush.component.css']
})
export class TimeBrushComponent {

ngOnInit() {

// These slider range component was used in my other component:
// https://github.com/yairEO/color-picker

  var settings = {
    visible: 1,
    theme: {
      background: "rgba(0,0,0,.9)",
    },
    CSSVarTarget: document.querySelector('.range-slider'),
    knobs: [
      {
        label: '<h2>These Are Some of The Variables:</h2>',
        render: ' ',
      },
      "Thumb",
      {
        cssVar: ['thumb-size', 'px'],
        label: 'thumb-size',
        type: 'range',
        min: 6, max: 33 //  value: 16,
      },
      {
        cssVar: ['thumb-color'], // alias for the CSS variable
        label: 'thumb-color',
        type: 'color',
      },
      "Value",
      {
        cssVar: ['value-active-color'], // alias for the CSS variable
        label: 'value active color',
        type: 'color',
        value: 'white'
      },
      {
        cssVar: ['value-background'], // alias for the CSS variable
        label: 'value-background',
        type: 'color',
      },
      {
        cssVar: ['value-background-hover'], // alias for the CSS variable
        label: 'value-background-hover',
        type: 'color',
      },
      {
        cssVar: ['primary-color'], // alias for the CSS variable
        label: 'primary-color',
        type: 'color',
      },
      // {
      //   cssVar: ['value-offset-y', 'px'],
      //   label: 'value-offset-y',
      //   type: 'range', value: 5, min: -10, max: 20
      // },
      "Track",
      {
        cssVar: ['track-height', 'px'],
        label: 'track-height',
        type: 'range', value: 8, min: 6, max: 33
      },
      {
        cssVar: ['progress-radius', 'px'],
        label: 'progress-radius',
        type: 'range', value: 20, min: 0, max: 33
      },
      {
        cssVar: ['progress-background'], // alias for the CSS variable
        label: 'progress-background',
        type: 'color',
        value: '#EEEEEE'
      },
      {
        cssVar: ['fill-color'], // alias for the CSS variable
        label: 'fill-color',
        type: 'color',
        value: '#0366D6'
      },
      "Ticks",
      {
        cssVar: ['show-min-max'],
        label: 'hide min max',
        type: 'checkbox',
        value: 'none'
      },
      {
        cssVar: ['ticks-thickness', 'px'],
        label: 'ticks-thickness',
        type: 'range',
        value: 1, min: 0, max: 10
      },
      {
        cssVar: ['ticks-height', 'px'],
        label: 'ticks-height',
        type: 'range',
        value: 5, min: 0, max: 15
      },
      {
        cssVar: ['ticks-gap', 'px'],
        label: 'ticks-gap',
        type: 'range',
        value: 5, min: 0, max: 15
      },
      {
        cssVar: ['min-max-x-offset', '%'],
        label: 'min-max-x-offset',
        type: 'range',
        value: 10, step: 1, min: 0, max: 100
      },
      {
        cssVar: ['min-max-opacity'],
        label: 'min-max-opacity',
        type: 'range', value: .5, step: .1, min: 0, max: 1
      },
      {
        cssVar: ['ticks-color'], // alias for the CSS variable
        label: 'ticks-color',
        type: 'color',
        value: '#AAAAAA'
      },
    ]
  }



}

/*$.extend( $.ui.slider.prototype.options, {
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
    .slider("float");   */

}
