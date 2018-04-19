import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable()
export class ResearchGroupService extends CommonService {
  constructor(protected http: HttpClient) {
    super(http);
    this.url += 'research_groups/';
  }
  
  public getCurrentGroup() {
    return this.applyRequestPath(this.get, 'research_groups/1');
  }
  public getNews() {
    return this.applyRequestPath(this.get, 'research_groups_news');
  }
  public getEvents(id: number){
    return this.applyRequestPath(this.get, "events_by_rg?id="+id);
  }
  
  public getSubjects(id: number){
    return this.applyRequestPath(this.get, "rs_by_rg?id="+id);
  }

  public getPublications(id: number){
    return this.applyRequestPath(this.get, "publications_by_rg?id="+id);
  }
  
  public requestJoinGroup(id: any): any {
    return this.applyRequestPath(this.create, 'research_groups/join', [id]);
  }

  public leaveGroup(id: any): any {
    return this.applyRequestPath(this.create, 'research_groups/leave', [id]);
  }

}
