import { NgModule } from '@angular/core';
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
import {DropDownButtonModule} from "@syncfusion/ej2-angular-splitbuttons";

@NgModule({
  declarations: [
    AppComponent,
    ChartModalComponent,
    MapComponent,
    VisualisationPageComponent,
    ParameterFilterComponent,
    InformationLayerComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FlexLayoutModule,
    LeafletD3Module,
    LeafletModule,
    TimeBrushComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
