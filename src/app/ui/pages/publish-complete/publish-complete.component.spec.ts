import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishCompleteComponent } from './publish-complete.component';

describe('PublishCompleteComponent', () => {
  let component: PublishCompleteComponent;
  let fixture: ComponentFixture<PublishCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
