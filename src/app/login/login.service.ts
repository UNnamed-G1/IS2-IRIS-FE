import { Injectable } from '@angular/core';
import { CommonService } from '../common.service'

@Injectable()
export class LoginService {

  constructor(private commonService: CommonService) { }

  public getCurrentUser() {
    return this.commonService.get("users/current")
  }

  public getUserToken(body: any) {
    let googleSession: boolean = ("access_token" in body);
    let b = {auth: Object.assign({}, body)};
    if (googleSession) {
      return this.commonService.post("google_user_token", b);
    }
    b["auth"]["email"] = body["username"] + "@unal.edu.co";
    delete b["auth"]["username"];
    return this.commonService.post("user_token", b);
  }

  public registerUser(body: any) {
    return this.commonService.post("users", body);
  }

}
