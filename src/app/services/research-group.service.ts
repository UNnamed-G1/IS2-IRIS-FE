import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service'

@Injectable()
export class ResearchGroupService extends CommonService {

  constructor(protected http: HttpClient) {
    super(http);
    this.url += "research_groups/";
  }

  public getCurrentGroup() {
    return this.applyRequestPath(this.get, "research_groups/1");
  }
  public getNews() {
    return this.applyRequestPath(this.get, "research_groups_news");
  }

}
