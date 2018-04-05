import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchGroupsComponent } from './research-groups.component';

describe('ResearchGroupsComponent', () => {
  let component: ResearchGroupsComponent;
  let fixture: ComponentFixture<ResearchGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResearchGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
