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

  acceptJoinRequest(id: number, user_id: number): any {
    return this.applyRequestPath(this.update, 'research_groups/' + id + '/accept_request?user_id=', [user_id]);
  }

  rejectJoinRequest(id: number, user_id: number): any {
    return this.applyRequestPath(this.delete, 'research_groups/' + id + '/reject_request?user_id=', [user_id]);
  }

  requestJoin(id: any): any {
    return this.applyRequestPath(this.create, 'users/current/request_join_research_group', [id]);
  }

  cancelJoinRequest(id: any): any {
    return this.applyRequestPath(this.delete, 'users/current/cancel_request?id=', [id]);
  }

  leaveGroup(id: any): any {
    return this.applyRequestPath(this.create, 'research_groups/leave', [id]);
  }
  searchRGByName(name: string, page:number){
    return this.applyRequestPath(this.get, 'search/research_groups?keywords=' + name + '&'+ 'page=' + page);
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
