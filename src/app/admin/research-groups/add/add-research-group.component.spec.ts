import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResearchGroupComponent } from './add-research-group.component';

describe('AddResearchGroupComponent', () => {
  let component: AddResearchGroupComponent;
  let fixture: ComponentFixture<AddResearchGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddResearchGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddResearchGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
