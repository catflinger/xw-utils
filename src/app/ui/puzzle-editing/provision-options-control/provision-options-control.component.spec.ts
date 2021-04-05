import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionOptionsControlComponent } from './provision-options-control.component';

describe('ProvisionOptionsControlComponent', () => {
  let component: ProvisionOptionsControlComponent;
  let fixture: ComponentFixture<ProvisionOptionsControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisionOptionsControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionOptionsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
