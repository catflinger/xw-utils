import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorControlComponent } from './color-control.component';

describe('ColorControlComponent', () => {
  let component: ColorControlComponent;
  let fixture: ComponentFixture<ColorControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
