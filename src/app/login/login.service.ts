import { Injectable } from '@angular/core';
import { CommonService } from '../common.service'

@Injectable()
export class LoginService {

  constructor(private s: CommonService) { }

  public getOwnData(email) {
    return this.s.get("users?q={\"email\":" + email + "}")
  }

  public getUserToken(body: any) {
    if ("auth" in body)
      return this.s.post("google_user_token", body);
    let b = { "auth": { "email": body.username + "@unal.edu.co", "password": body.password } };
    return this.s.post("user_token", b);
  }

  public registerUser(body: any) {
    return this.s.post("users", body);
  }

}
