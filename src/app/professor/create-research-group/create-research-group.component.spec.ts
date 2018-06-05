import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateResearchGroupComponent } from './create-research-group.component';

describe('CreateResearchGroupComponent', () => {
  let component: CreateResearchGroupComponent;
  let fixture: ComponentFixture<CreateResearchGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateResearchGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateResearchGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
