import { Injectable } from '@angular/core';
import { CommonService } from '../common.service'

@Injectable()
export class FacultyService {

  constructor(private commonService: CommonService) { }

  public getAll() {
    return this.commonService.get("faculties/")
  }

}
