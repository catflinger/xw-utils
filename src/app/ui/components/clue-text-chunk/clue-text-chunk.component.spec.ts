import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClueTextChunkComponent } from './clue-text-chunk.component';

describe('ClueTextChunkComponent', () => {
  let component: ClueTextChunkComponent;
  let fixture: ComponentFixture<ClueTextChunkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClueTextChunkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClueTextChunkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
