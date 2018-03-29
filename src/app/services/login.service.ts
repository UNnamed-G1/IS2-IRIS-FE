import { Injectable } from '@angular/core';
import { CommonService } from './common.service'

@Injectable()
export class LoginService {

  constructor(private s: CommonService) { }

  public getUserToken(body: any) {
    if ("auth" in body)
      return this.s.post("google_user_token", body);
    return this.s.post("user_token", body);
  }

  public registerUser(body: any) {
    return this.s.post("users", body);
  }

}
