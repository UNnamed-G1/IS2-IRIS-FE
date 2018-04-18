import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service'

@Injectable()
export class UserService extends CommonService {

  constructor(protected http: HttpClient) {
    super(http);
    this.url += 'users/';
  }

  public getCurrentUser() {
    return this.applyRequestPath(this.get, 'users/current/');
  }

  public getFollowingCount(id?: number) {
    if (id) {
      return this.applyRequestPath(this.get, 'following_count?id=' + id);
    }
    return this.applyRequestPath(this.get, 'following_count');
  }

  public getFollowersCount(id?: number) {
    if (id) {
      return this.applyRequestPath(this.get, 'followers_count?id=' + id);
    }
    return this.applyRequestPath(this.get, 'followers_count');
  }

  public getFollowing(id?: number) {
    if (id) {
      return this.applyRequestPath(this.get, 'following?id=' + id);
    }
    return this.applyRequestPath(this.get, 'following');
  }

  public getFollowers(id?: number) {
    if (id) {
      return this.applyRequestPath(this.get, 'followers?id=' + id);
    }
    return this.applyRequestPath(this.get, 'followers');
  }

  public follow(id: number) {
    return this.applyRequestPath(this.create, 'follow ', [{ id_followed: id }]);
  }

  public unfollow(id: number) {
    return this.applyRequestPath(this.create, 'unfollow ', [{ id_followed: id }]);
  }

}
