import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, GoogleLoginProvider } from 'angular5-social-login';
import { LoginService } from './login.service'

import { NgRedux } from '@angular-redux/store';
import { AppState } from '../redux/store';
import { ISession } from '../redux/session';
import { ADD_SESSION } from '../redux/actions';

import { PermissionManager } from '../permission-manager'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  userSignIn: { username: string, password: string };

  constructor(private socialAuthService: AuthService,
    private loginService: LoginService,
    private ngRedux: NgRedux<AppState>,
    private router: Router,
    private permMan: PermissionManager) { }

  ngOnInit() {
    this.permMan.validateNotLogged();
    this.userSignIn = Object.assign({}, this.userSignIn)
  }

  signIn() {
    this.fillSession(this.userSignIn);
  }

  googleSignIn() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      userData => this.fillSession({ access_token: userData.idToken }),
      error => console.error(error.message)
    );
  }

  private fillSession(userAuth) {
    this.loginService.getUserToken(userAuth).subscribe(response => {
      let session: ISession;
      session = Object.assign({}, session, { token: response['jwt'] });
      this.ngRedux.dispatch({ type: ADD_SESSION, session: session });
      this.loginService.getCurrentUser().subscribe(
        response => {
          let data = response['user'];
          if (data.photo)
            data.photo = data.photo.link;
          Object.assign(session, {
            name: data.full_name,
            type: data.user_type,
            photo: data.photo
          });
          this.ngRedux.dispatch({ type: ADD_SESSION, session: session });
        },
        error => console.error(error.message));
      this.permMan.validateNotLogged();
    });
  }

}
