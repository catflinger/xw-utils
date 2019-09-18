import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClueTextControlComponent } from './clue-text-control.component';

describe('ClueTextComponent', () => {
  let component: ClueTextControlComponent;
  let fixture: ComponentFixture<ClueTextControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClueTextControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClueTextControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
