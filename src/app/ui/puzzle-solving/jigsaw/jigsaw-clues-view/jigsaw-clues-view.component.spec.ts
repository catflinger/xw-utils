import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JigsawCluesViewComponent } from './jigsaw-clues-view.component';

describe('JigsawCluesViewComponent', () => {
  let component: JigsawCluesViewComponent;
  let fixture: ComponentFixture<JigsawCluesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JigsawCluesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JigsawCluesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
