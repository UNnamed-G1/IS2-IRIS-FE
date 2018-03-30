import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, GoogleLoginProvider } from 'angular5-social-login';
import { LoginService } from './login.service'

import { NgRedux, select } from '@angular-redux/store';
import { LoginState } from '../redux/store';
import { ISession } from '../redux/session';
import { ADD_SESSION } from '../redux/actions';

import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  @select() session;
  @select() isLogged;

  userSignUp = {};
  userSignIn = {};

  constructor(private socialAuthService: AuthService,
    private loginService: LoginService,
    private ngRedux: NgRedux<LoginState>,
    private router: Router) { }

  ngOnInit() {
    this.isLogged.subscribe(s => {
      if (s) {
        this.router.navigate(['']);
      }
    });
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
      let session: ISession;
      session = Object.assign({}, session, { token: response['jwt'] });
      this.ngRedux.dispatch({ type: ADD_SESSION, session: session });
      this.loginService.getCurrentUser().subscribe(response => {
        let data = response['user'];
        if (data.photo)
          data.photo = data.photo.link;
        Object.assign(session, {
          name: data.full_name,
          type: data.user_type,
          photo: data.photo
        });
      });
    });
  }

}
