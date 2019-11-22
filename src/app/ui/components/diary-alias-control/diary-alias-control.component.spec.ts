import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaryAliasControlComponent } from './diary-alias-control.component';

describe('DiaryAliasControlComponent', () => {
  let component: DiaryAliasControlComponent;
  let fixture: ComponentFixture<DiaryAliasControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiaryAliasControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiaryAliasControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
