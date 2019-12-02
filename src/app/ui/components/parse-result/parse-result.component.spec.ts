import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParseResultComponent } from './parse-result.component';

describe('ParseResultComponent', () => {
  let component: ParseResultComponent;
  let fixture: ComponentFixture<ParseResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParseResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParseResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
