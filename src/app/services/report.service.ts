import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service'

@Injectable()
export class ReportService extends CommonService{

  constructor(protected http: HttpClient) {
    super(http);
    this.url += "reports/";
  }

}
