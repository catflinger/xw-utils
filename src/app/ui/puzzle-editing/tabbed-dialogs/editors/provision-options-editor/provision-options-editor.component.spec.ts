import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionOptionsEditorComponent } from './provision-options-editor.component';

describe('ProvisionOptionsEditorComponent', () => {
  let component: ProvisionOptionsEditorComponent;
  let fixture: ComponentFixture<ProvisionOptionsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisionOptionsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionOptionsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
