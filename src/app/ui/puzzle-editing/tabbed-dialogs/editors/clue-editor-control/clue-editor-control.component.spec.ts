import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClueEditorControlComponent } from './clue-editor-control.component';

describe('ClueEditorControlComponent', () => {
  let component: ClueEditorControlComponent;
  let fixture: ComponentFixture<ClueEditorControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClueEditorControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClueEditorControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
