import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ChartModalComponent } from './components/chart-modal/chart-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MapComponent } from './components/map/map.component';
import { VisualisationPageComponent } from './components/visualisation-page/visualisation-page.component';
import { ParameterFilterComponent } from './components/parameter-filter/parameter-filter.component';
import { InformationLayerComponent } from './components/information-layer/information-layer.component';
import { LeafletD3Module } from '@asymmetrik/ngx-leaflet-d3';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { TimeBrushComponent } from './components/time-brush/time-brush.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatInputModule} from "@angular/material/input";
import {MatSliderModule} from "@angular/material/slider";
import {FormsModule} from "@angular/forms";
import {LegendColorChartComponent} from "./components/legent-color-chart/legend-color-chart.component";
import { NpnSliderModule } from 'npn-slider';
import { Ng5SliderModule } from 'ng5-slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ServiceWorkerModule } from '@angular/service-worker';
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [
    AppComponent,
    ChartModalComponent,
    MapComponent,
    VisualisationPageComponent,
    ParameterFilterComponent,
    InformationLayerComponent,
    TimeBrushComponent,
    LegendColorChartComponent,
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatDialogModule,
        FlexLayoutModule,
        LeafletD3Module,
        LeafletModule,
        MatTooltipModule,
        MatInputModule,
        MatSliderModule,
        FormsModule,
        MatButtonToggleModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        MatSelectModule,
        MatIconModule
    ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
