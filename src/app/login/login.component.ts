import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, GoogleLoginProvider } from 'angular5-social-login';
import { LoginService } from './login.service'

import { NgRedux, select } from '@angular-redux/store';
import { LoginState, INITIAL_STATE } from '../redux/store';
import { ISession } from '../redux/session';
import { ADD_SESSION, REMOVE_SESSION } from '../redux/actions';

import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  @select() session;
  @select() isLogged;

  user: User = new User();

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
    if (!this.user) { return; }
    this.loginService.registerUser(this.user)
      .subscribe(
        //Fix register on back
        //Redux
        response => console.log(response),
        error => console.log(<any>error)
      );
  }

  googleSignIn() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (userData) => {
        this.loginService.getUserToken({ "auth": { "access_token": userData.idToken } }).subscribe(response => {
          //this.loginService.getOwnData()
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
    )
  }
}
