import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { ChartModalComponent } from './components/chart-modal/chart-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from "@angular/material/dialog";
import {FlexLayoutModule} from "@angular/flex-layout";
import { MapComponent } from './components/map/map.component';
import { VisualisationPageComponent } from './components/visualisation-page/visualisation-page.component';
import { ParameterFilterComponent } from './components/parameter-filter/parameter-filter.component';
import { InformationLayerComponent } from './components/information-layer/information-layer.component';
import {DropDownButtonModule} from "@syncfusion/ej2-angular-splitbuttons";
import { TimeBrushComponent } from './components/time-brush/time-brush.component';
import {NpnSliderModule} from "npn-slider";

@NgModule({
  declarations: [
    AppComponent,
    ChartModalComponent,
    MapComponent,
    VisualisationPageComponent,
    ParameterFilterComponent,
    InformationLayerComponent,
    TimeBrushComponent
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatDialogModule,
        FlexLayoutModule,
        DropDownButtonModule,
        NpnSliderModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
