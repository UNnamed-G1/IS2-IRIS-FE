import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable()
export class CareerService extends CommonService {

  constructor(protected http: HttpClient) {
    super(http);
    this.url += 'careers/';
  }

  getResearchGroups(id: number) {
    this.applyRequestPath(this.get, 'careers/' + id + '/research_groups');
  }

}
