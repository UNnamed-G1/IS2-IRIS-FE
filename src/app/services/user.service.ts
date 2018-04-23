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
    return this.applyRequestPath(this.get, 'user_by_username?username=' + username);
  }

  public getCurrentUser() {
    return this.applyRequestPath(this.get, 'users/current/');
  }

  public getCurrFollowing() {
    return this.applyRequestPath(this.get, 'curr_following');
  }

  public getFollowing(page: number, id?: number) {
    if (id) {
      return this.applyRequestPath(this.get, 'following?id=' + id + '&page=' + page);
    }
    return this.applyRequestPath(this.get, 'following?page=' + page);
  }

  public getFollowers(page: number, id?: number) {
    if (id) {
      return this.applyRequestPath(this.get, 'followers?id=' + id + '&page=' + page);
    }
    return this.applyRequestPath(this.get, 'followers?page=' + page);
  }

  public follow(id: number) {
    return this.applyRequestPath(this.create, 'follow ', [{ id_followed: id }]);
  }

  public unfollow(id: number) {
    return this.applyRequestPath(this.create, 'unfollow ', [{ id_followed: id }]);
  }

}
