import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClueTextEditorComponent } from './clue-text-editor.component';

describe('ClueTextEditorComponent', () => {
  let component: ClueTextEditorComponent;
  let fixture: ComponentFixture<ClueTextEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClueTextEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClueTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
