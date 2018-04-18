import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable()
export class LoginService extends CommonService {

  constructor(protected http: HttpClient) {
    super(http);
  }

  public getUserToken(body: any) {
    let path = '', b = body;
    if ('access_token' in body) {
      path = 'google_';
    } else {
      b = { email: body.username + '@unal.edu.co', password: body.password };
    }
    b = { auth: Object.assign({}, b) };
    return this.applyRequestPath(this.create, path + 'user_token', [b]);
  }

}
