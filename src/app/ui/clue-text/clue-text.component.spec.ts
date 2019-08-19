import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClueTextComponent } from './clue-text.component';

describe('ClueTextComponent', () => {
  let component: ClueTextComponent;
  let fixture: ComponentFixture<ClueTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClueTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClueTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
