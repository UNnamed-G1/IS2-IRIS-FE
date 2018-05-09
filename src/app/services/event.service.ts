import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable()
export class EventService extends CommonService {

  constructor(protected http: HttpClient) {
    super(http);
    this.url += 'events/';
  }

  getNews() {
    return this.applyRequestPath(this.get, 'events/news');
  }

  getInvitedUsers(id: number) {
    return this.applyRequestPath(this.get, 'events/' + id + '/invited_users');
  }

  sendInvitationEvent(id: number, ids = []) {
    return this.applyRequestPath(this.create, 'events/' + id + '/invite_users', [ids]);
  }

  getAllEditable(page: number) {
    return this.applyRequestPath(this.get, 'users/current/editable_events?page=' + page);
  }

}
