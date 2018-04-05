import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service'

@Injectable()
export class EventService extends CommonService {

  constructor(protected http: HttpClient) {
    super(http);
    this.url += "";
  }

  public getEvents() {
    return this.applyRequestPath(this.get, "events");
  }

  public getNews() {
    return this.applyRequestPath(this.get, "events_news");
  }

}
