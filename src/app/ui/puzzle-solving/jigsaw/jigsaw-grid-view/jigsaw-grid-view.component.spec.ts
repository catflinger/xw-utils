import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JigsawGridViewComponent } from './jigsaw-grid-view.component';

describe('JigsawGridViewComponent', () => {
  let component: JigsawGridViewComponent;
  let fixture: ComponentFixture<JigsawGridViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JigsawGridViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JigsawGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
