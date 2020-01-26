import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavLogComponent } from './nav-log.component';

describe('NavLogComponent', () => {
  let component: NavLogComponent;
  let fixture: ComponentFixture<NavLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
