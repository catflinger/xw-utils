import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenPuzzleComponent } from './open-puzzle.component';

describe('OpenPuzzleComponent', () => {
  let component: OpenPuzzleComponent;
  let fixture: ComponentFixture<OpenPuzzleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenPuzzleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenPuzzleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
