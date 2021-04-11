import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClueOptionsFormComponent } from './clue-options-form.component';

describe('ClueOptionsFormComponent', () => {
  let component: ClueOptionsFormComponent;
  let fixture: ComponentFixture<ClueOptionsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClueOptionsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClueOptionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
