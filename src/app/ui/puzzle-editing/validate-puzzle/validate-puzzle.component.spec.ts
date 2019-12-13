import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatePuzzleComponent } from './validate-puzzle.component';

describe('ValidatePuzzleComponent', () => {
  let component: ValidatePuzzleComponent;
  let fixture: ComponentFixture<ValidatePuzzleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatePuzzleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatePuzzleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
