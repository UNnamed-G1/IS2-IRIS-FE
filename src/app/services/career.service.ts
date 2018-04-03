import { Injectable } from '@angular/core';
import { CommonService } from '../common.service'

@Injectable()
export class CareerService {

  constructor(private commonService: CommonService) { }

  public getAll() {
    return this.commonService.get("careers/")
  }

  public getByDepartment(depId) {
    return this.commonService.get("careers_by_department/" + depId)
  }

}
