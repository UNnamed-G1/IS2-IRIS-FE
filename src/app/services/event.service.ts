import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable()
export class EventService extends CommonService {

  constructor(protected http: HttpClient) {
    super(http);
    this.url += 'events/';
  }

  public getNews() {
    return this.applyRequestPath(this.get, 'events_news');
  }
  public getInvitedUsers(id: number){
    return this.applyRequestPath(this.get, 'events/invited_users?id=' +id);
  }
  public sendInvitationEvent(id: number, ids=[]){
    return this.applyRequestPath(this.create, 'events/invite_users', [id , [ids]]);
  }
  public getAllEditable(page: number) {
    return this.applyRequestPath(this.get, 'events_by_editable?page=' + page);
  }

}
