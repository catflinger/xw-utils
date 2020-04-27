import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemoveClueComponent } from './add-remove-clue.component';

describe('AddRemoveClueComponent', () => {
  let component: AddRemoveClueComponent;
  let fixture: ComponentFixture<AddRemoveClueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemoveClueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveClueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
