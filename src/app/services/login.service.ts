import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

@Injectable()
export class LoginService extends CommonService {

  constructor(protected http: HttpClient) {
    super(http);
  }

  public getUserToken(body: any) {
    let googleSession: boolean = ("access_token" in body);
    let b = { auth: Object.assign({}, body) };
    if (googleSession) {
      return this.applyRequestPath(this.create, "google_user_token", [b]);
    }
    b["auth"]["email"] = body["username"] + "@unal.edu.co";
    delete b["auth"]["username"];
    return this.applyRequestPath(this.create, "user_token", [b]);
  }

}
