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
        //Redux if will automatically sign in
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
        console.log(userData)
        this.loginService.getUserToken({ "auth": { "access_token": userData.idToken } }).subscribe(response => {
          //this.loginService.getOwnData(userData.email).subscribe(s => console.log(s));
          let s: ISession = {
            "token": response['jwt'],
            // Change for data from service
            "name": userData.name,
            "photo": userData.image,
            "type": 0
          }
          this.ngRedux.dispatch({ type: ADD_SESSION, session: s });
        });
      }
    );
  }
}
