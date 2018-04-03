import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service'
import { UserService } from './user.service'

@Injectable()
export class LoginService extends CommonService {

  constructor(protected http: HttpClient,
    private userService: UserService) {
    super(http);
  }

  public getCurrentUser() {
    return this.applyRequestPath(this.get, "users/current/");
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

  public registerUser(body: any) {
    return this.userService.create(body);
  }

}
