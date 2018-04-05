import { TestBed, inject } from '@angular/core/testing';

import { ResearchGroupService } from './research-group.service';

describe('ResearchGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResearchGroupService]
    });
  });

  it('should be created', inject([ResearchGroupService], (service: ResearchGroupService) => {
    expect(service).toBeTruthy();
  }));
});
