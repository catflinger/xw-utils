import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CluesPreviewComponent } from './clues-preview.component';

describe('CluesPreviewComponent', () => {
  let component: CluesPreviewComponent;
  let fixture: ComponentFixture<CluesPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CluesPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CluesPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
