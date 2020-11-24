import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishPreviewComponent } from './publish-preview.component';

describe('PublishPreviewComponent', () => {
  let component: PublishPreviewComponent;
  let fixture: ComponentFixture<PublishPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
