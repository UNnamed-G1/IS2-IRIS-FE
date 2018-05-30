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

  searchByName(name: string, page: number) {
    return this.applyRequestPath(this.get, 'search/events?keywords=' + name + '&' + 'page=' + page);
  }

  getInvitedUsers(id: number) {
    return this.applyRequestPath(this.get, 'events/' + id + '/invited_users');
  }

  getAttendees(id: number) {
    return this.applyRequestPath(this.get, 'events/' + id + '/attendees');
  }

  getAuthors(id: number) {
    return this.applyRequestPath(this.get, 'events/' + id + '/authors');
  }

  availableUsers(id: number, keywords: string = '') {
    return this.applyRequestPath(this.get, 'events/' + id + '/available_users?keywords=' + keywords);
  }

  inviteUsers(id: number, users: any) {
    return this.applyRequestPath(this.create, 'events/' + id + '/invite_users', [users])
  }

  removeInvitation(id: number, userId: number) {
    return this.applyRequestPath(this.create, 'events/' + id + '/remove_invitation', [{ user_id: id }]);
  }

  getAllEditable(page: number) {
    return this.applyRequestPath(this.get, 'users/current/editable_events?page=' + page);
  }

}
