import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService, GoogleLoginProvider } from 'angular5-social-login';

import { NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ISession } from 'app/redux/session';
import { ADD_SESSION, REMOVE_SESSION } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';

import { environment } from 'environments/environment';
import { User } from 'app/classes/_models';
import { UserService } from 'app/services/user.service';
import { LoginService } from 'app/services/login.service';
import { Swal } from 'app/classes/swal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  swalOpts: Swal;
  signInForm: FormGroup;

  constructor(private socialAuthService: AuthService,
    private loginService: LoginService,
    private userService: UserService,
    private ngRedux: NgRedux<AppState>,
    private permMan: PermissionManager,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.permMan.validateNotLogged();
    this.createSignInForm();
  }

  signIn() {
    this.fillSession(this.signInForm.value);
  }

  googleSignIn() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (userData) => this.fillSession({ access_token: userData.idToken }),
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'Error de conexión con Google', text: error.message, type: 'error' };
      }
    );
  }

  private fillSession(userAuth: any) {
    this.loginService.getUserToken(userAuth).subscribe(
      (response: { jwt: string }) => {
        let session: ISession;
        session = Object.assign({ token: response.jwt });
        this.ngRedux.dispatch({ type: ADD_SESSION, session: session });
        this.userService.getCurrent().subscribe(
          (res: { user: User }) => {
            const data = res.user;
            if (data.photo) {
              Object.assign(data, { photo: environment.api_url + data.photo.picture });
            }
            Object.assign(session, {
              id: data.id,
              name: data.full_name,
              type: data.user_type,
              username: data.username,
              photo: data.photo
            });
            this.ngRedux.dispatch({ type: ADD_SESSION, session: session });
          },
          (error: HttpErrorResponse) => {
            this.swalOpts = { title: 'Inicio de sesión fallido', text: 'Datos incorrectos', type: 'error' };
            this.ngRedux.dispatch({ type: REMOVE_SESSION, session: session });
            this.createSignInForm();
          }
        );
        this.permMan.validateNotLogged();
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'Inicio de sesión fallido', text: 'Datos incorrectos', type: 'error' };
        this.createSignInForm();
      }
    );
  }

  private createSignInForm() {
    this.signInForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern('[a-z0-9]+')]],
      password: ['', [Validators.required]]
    });
  }

  get username() { return this.signInForm.get('username'); }
  get password() { return this.signInForm.get('password'); }
}
