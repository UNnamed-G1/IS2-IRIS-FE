import { Injectable } from '@angular/core';
import { ResponseContentType, Http, Response, Headers, RequestOptions } from '@angular/http';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service'
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class PublicationService extends CommonService {

  constructor(protected http: HttpClient) {
    super(http);
    this.url += 'publications/';
  }
}
