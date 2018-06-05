import { TestBed, inject } from '@angular/core/testing';

import { ResearchSubjectService } from './research-subject.service';

describe('ResearchSubjectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResearchSubjectService]
    });
  });

  it('should be created', inject([ResearchSubjectService], (service: ResearchSubjectService) => {
    expect(service).toBeTruthy();
  }));
});
