import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendColorChartComponent } from './legend-color-chart.component';

describe('LegentColorChartComponent', () => {
  let component: LegendColorChartComponent;
  let fixture: ComponentFixture<LegendColorChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegendColorChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegendColorChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
