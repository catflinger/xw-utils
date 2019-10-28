import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndyComponent } from './indy.component';

describe('IndyComponent', () => {
  let component: IndyComponent;
  let fixture: ComponentFixture<IndyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
