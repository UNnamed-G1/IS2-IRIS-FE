import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericSwalComponent } from './generic-swal.component';

describe('GenericSwalComponent', () => {
  let component: GenericSwalComponent;
  let fixture: ComponentFixture<GenericSwalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericSwalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericSwalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
