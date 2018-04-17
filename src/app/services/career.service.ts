import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable()
export class CareerService extends CommonService {

  constructor(protected http: HttpClient) {
    super(http);
    this.url += 'careers/';
  }

  public getByDepartment(depId: number) {
    return this.applyRequestPath(this.get, 'careers_by_dept?dept_id=' + depId);
  }

}
