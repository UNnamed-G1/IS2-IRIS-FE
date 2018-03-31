import { TestBed, inject } from '@angular/core/testing';

import { ResearchGroupsService } from './research-groups.service';

describe('ResearchGroupsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResearchGroupsService]
    });
  });

  it('should be created', inject([ResearchGroupsService], (service: ResearchGroupsService) => {
    expect(service).toBeTruthy();
  }));
});
