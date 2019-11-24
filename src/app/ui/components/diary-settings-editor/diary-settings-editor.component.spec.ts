import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiarySettingsEditorComponent } from './diary-settings-editor.component';

describe('DiarySettingsEditorComponent', () => {
  let component: DiarySettingsEditorComponent;
  let fixture: ComponentFixture<DiarySettingsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiarySettingsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiarySettingsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
