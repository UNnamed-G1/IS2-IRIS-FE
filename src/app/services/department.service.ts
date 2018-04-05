import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable()
export class DepartmentService extends CommonService {

  constructor(protected http: HttpClient) {
    super(http);
    this.url += "departments/";
  }

  public getByFaculty(facId: number) {
    return this.applyRequestPath(this.get, "depts_by_faculty%23fac_id=" + facId)
  }

}
