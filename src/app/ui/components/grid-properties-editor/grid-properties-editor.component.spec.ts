import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridPropertiesEditorComponent } from './grid-properties-editor.component';

describe('GridPropertiesEditorComponent', () => {
  let component: GridPropertiesEditorComponent;
  let fixture: ComponentFixture<GridPropertiesEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridPropertiesEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridPropertiesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
