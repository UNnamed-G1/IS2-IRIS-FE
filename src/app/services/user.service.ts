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

}
