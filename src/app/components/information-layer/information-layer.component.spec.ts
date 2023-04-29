import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationLayerComponent } from './information-layer.component';

describe('InformationLayerComponent', () => {
  let component: InformationLayerComponent;
  let fixture: ComponentFixture<InformationLayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformationLayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformationLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
