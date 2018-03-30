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

  userSignUp = {};
  userSignIn = {};

  constructor(private socialAuthService: AuthService,
    private loginService: LoginService) { }

  ngOnInit() {
  }

  register() {
    if (!this.userSignUp) { return; }
    this.loginService.registerUser({"user": this.userSignUp})
            .subscribe(
              //Redux
            response => console.log(response),
            error => console.log(<any>error)
          );
  }

  signIn() {
    this.loginService.getUserToken(this.userSignIn).subscribe(response => {
      //Redux
      console.log(response)
    });
  }

  googleSignIn() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (userData) => {
        this.loginService.getUserToken({ "auth": { "access_token": userData.idToken }}).subscribe(response => {
          //Redux
          console.log(response);
        });
      }
    );
  }
}
