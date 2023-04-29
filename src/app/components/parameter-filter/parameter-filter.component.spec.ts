import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterFilterComponent } from './parameter-filter.component';

describe('ParameterFilterComponent', () => {
  let component: ParameterFilterComponent;
  let fixture: ComponentFixture<ParameterFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParameterFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
