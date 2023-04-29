import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualisationPageComponent } from './visualisation-page.component';

describe('VisualisationPageComponent', () => {
  let component: VisualisationPageComponent;
  let fixture: ComponentFixture<VisualisationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualisationPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualisationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
