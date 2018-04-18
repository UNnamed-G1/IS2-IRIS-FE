import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchSubjectsComponent } from './research-subjects.component';

describe('ResearchSubjectsComponent', () => {
  let component: ResearchSubjectsComponent;
  let fixture: ComponentFixture<ResearchSubjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchSubjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
