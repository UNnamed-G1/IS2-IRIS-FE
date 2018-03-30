import { Injectable } from '@angular/core';
import { CommonService } from '../common.service'

@Injectable()
export class LoginService {

  constructor(private s: CommonService) { }

  public getCurrentUser() {
    return this.s.get("users/current")
  }

  public getUserToken(body: any) {
    let googleSession: boolean = ("access_token" in body);
    let b = {auth: Object.assign({}, body)};
    if (googleSession) {
      return this.s.post("google_user_token", b);
    }
    b["auth"]["email"] = body["username"] + "@unal.edu.co";
    delete b["auth"]["username"];
    return this.s.post("user_token", b);
  }

  public registerUser(body: any) {
    return this.s.post("users", body);
  }

}
