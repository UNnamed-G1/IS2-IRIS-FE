import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveCommentsComponent } from './leave-comments.component';

describe('LeaveCommentsComponent', () => {
  let component: LeaveCommentsComponent;
  let fixture: ComponentFixture<LeaveCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
