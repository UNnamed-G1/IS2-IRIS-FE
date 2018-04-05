import { Injectable } from '@angular/core';
import { CommonService } from '../common.service'

@Injectable()
export class DepartmentService {

  constructor(private commonService: CommonService) { }

  public getAll() {
    return this.commonService.get("departments/")
  }

  public getByFaculty(facId: number) {
    return this.commonService.get("departments_by_faculty/" + facId)
  }

}
