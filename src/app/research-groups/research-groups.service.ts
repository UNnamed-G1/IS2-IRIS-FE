import { Injectable } from '@angular/core';
import { CommonService } from '../common.service'
import { ResearchGroup } from './research-groups';

@Injectable()
export class ResearchGroupService {

	constructor(private commonService: CommonService){}

  public getResearchGroups(){
    return this.commonService.get("research_groups");
  }

  public getResearchGroup(id: number){
    return this.commonService.get("research_groups/" + id);
  }

  public getResearchGroupsNews(){
    return this.commonService.get("research_groups_news");
  }

  public createResearchGroup(body: any) {
    return this.commonService.post("research_groups",body);
  }

  public deleteReseachGroup(id: number) {
    return this.commonService.delete("research_groups/"+id);
  }

  public update(id: number, body: any) {
    return this.commonService.update("research_groups/"+id, body);
  }
}
