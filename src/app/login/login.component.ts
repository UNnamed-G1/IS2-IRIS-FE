import { Component, OnInit } from '@angular/core';
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
    this.loginService.registerUser({ "user": this.userSignUp })
      .subscribe(
        response => console.log("¡Listo!"),
        error => console.error(error.message)
      );
  }

  signIn() {
    this.fillSession(this.userSignIn);
  }

  googleSignIn() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(userData => {
      this.fillSession({ access_token: userData.idToken });
    });
  }

  private fillSession(userAuth) {
    this.loginService.getUserToken(userAuth).subscribe(response => {
      let token = response['jwt']
      this.loginService.getCurrentUser().subscribe(response => {
        let data = response['user'];
        if (data.photo)
          data.photo = data.photo.link;
      });
    });
  }

}
