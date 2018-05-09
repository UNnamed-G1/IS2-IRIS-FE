import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable()
export class UserService extends CommonService {

  constructor(protected http: HttpClient) {
    super(http);
    this.url += 'users/';
  }

  getByUsername(username: string): any {
    return this.applyRequestPath(this.get, 'users/get_user/' + username);
  }

  getCurrentUser() {
    return this.applyRequestPath(this.get, 'users/current/');
  }

  getCurrentUserRGS() {
    return this.applyRequestPath(this.get, 'users/current/research_groups');
  }

  /*
   *  Follows
   */
  getCurrFollowing() {
    return this.applyRequestPath(this.get, 'users/current/following');
  }

  getFollowing(page: number, id?: number) {
    return this.applyRequestPath(this.get, 'users/' + id + '/following?page=' + page);
  }

  getFollowers(page: number, id?: number) {
    return this.applyRequestPath(this.get, 'users/' + id + '/followers?page=' + page);
  }

  follow(id: number) {
    return this.applyRequestPath(this.create, 'users/current/follow', [{ id_followed: id }]);
  }

  unfollow(id: number) {
    return this.applyRequestPath(this.create, 'users/current/unfollow', [{ id_followed: id }]);
  }

  /*
   *  Statistics
   */
  publicationsByUserAndType(id: number) {
    return this.applyRequestPath(this.get, 'statistics/users/' + id + '/num_publications_by_type');
  }

  publicationsLastPeriod(id: number) {
    return this.applyRequestPath(this.get, 'statistics/users/' + id + '/num_publications_in_a_period');
  }
}
