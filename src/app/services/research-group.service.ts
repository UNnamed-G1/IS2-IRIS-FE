import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable()
export class ResearchGroupService extends CommonService {
  constructor(protected http: HttpClient) {
    super(http);
    this.url += 'research_groups/';
  }

  getNews() {
    return this.applyRequestPath(this.get, 'research_groups/news');
  }

  requestJoinGroup(id: number): any {
    return this.applyRequestPath(this.create, 'research_groups/'+ id + '/join' );
  }

  leaveGroup(id: any): any {
    return this.applyRequestPath(this.create, 'research_groups/leave', [id]);
  }

  /*
   *  Statistics
   */
  publicationsByRGAndType(id: number) {
    return this.applyRequestPath(this.get, 'statistics/research_groups/' + id + '/num_publications_by_type');
  }

  publicationsLastPeriod(id: number) {
    return this.applyRequestPath(this.get, 'statistics/research_groups/' + id + '/num_publications_in_a_period');
  }

  getOverallPublications(id: number): any {
    return this.applyRequestPath(this.get, 'statistics/research_groups/' + id + '/overall_num_publications_by_members');
  }

}
