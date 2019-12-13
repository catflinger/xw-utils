import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CluesEditorComponent } from './clues-editor.component';

describe('CluesEditorComponent', () => {
  let component: CluesEditorComponent;
  let fixture: ComponentFixture<CluesEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CluesEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CluesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
