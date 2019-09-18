import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClueEditorComponent } from './clue-editor.component';

describe('ClueEditorComponent', () => {
  let component: ClueEditorComponent;
  let fixture: ComponentFixture<ClueEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClueEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClueEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
