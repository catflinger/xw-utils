import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishGridComponent } from './publish-grid.component';

describe('PublishGridComponent', () => {
  let component: PublishGridComponent;
  let fixture: ComponentFixture<PublishGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
