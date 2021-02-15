import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridImageComponent } from './grid-image.component';

describe('GridImageComponent', () => {
  let component: GridImageComponent;
  let fixture: ComponentFixture<GridImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
