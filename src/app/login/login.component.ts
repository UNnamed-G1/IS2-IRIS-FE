import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { AuthService, GoogleLoginProvider } from 'angular5-social-login';
import { LoginService } from '../services/login.service'

import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  userReg = new User();

  constructor(private socialAuthService: AuthService,
    private loginService: LoginService) { }

  ngOnInit() {
  }

  register() {
    console.log(this.userReg)
    if (!this.userReg) { return; }
    this.loginService.registerUser(this.userReg)
            .subscribe(
              //Fix register on back
              //Redux
            response => console.log(),
            error => console.log(<any>error)
          );
  }

  googleSignIn() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (userData) => {
        this.loginService.getUserToken({ "auth": { "access_token": userData.idToken }}).subscribe(response => {
          //Redux
          console.log(response);
        });
      }
    )
  }
}
