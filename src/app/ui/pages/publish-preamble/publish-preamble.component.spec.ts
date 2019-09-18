import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishPreambleComponent } from './publish-preamble.component';

describe('PublishPreambleComponent', () => {
  let component: PublishPreambleComponent;
  let fixture: ComponentFixture<PublishPreambleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishPreambleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishPreambleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
