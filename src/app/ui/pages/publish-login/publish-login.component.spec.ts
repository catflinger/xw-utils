import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishLoginComponent } from './publish-login.component';

describe('PublishLoginComponent', () => {
  let component: PublishLoginComponent;
  let fixture: ComponentFixture<PublishLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
