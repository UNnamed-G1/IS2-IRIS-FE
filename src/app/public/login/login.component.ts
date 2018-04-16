import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, GoogleLoginProvider } from 'angular5-social-login';
import { UserService } from 'app/services/user.service';
import { LoginService } from 'app/services/login.service';
import { NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ISession } from 'app/redux/session';
import { ADD_SESSION } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
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
      userData => this.fillSession({ access_token: userData.idToken }),
      error => console.error(error.message)
    );
  }

  private fillSession(userAuth) {
    this.loginService.getUserToken(userAuth).subscribe(response => {
      let session: ISession;
      session = Object.assign({}, session, { token: response['jwt'] });
      this.ngRedux.dispatch({ type: ADD_SESSION, session: session });
      this.userService.getCurrentUser().subscribe(
        response => {
          let data = response['user'];
          if (data.photo)
            data.photo = data.photo.link;
          Object.assign(session, {
            name: data.full_name,
            type: data.user_type,
            username: data.username,
            photo: data.photo
          });
          this.ngRedux.dispatch({ type: ADD_SESSION, session: session });
        },
        error => console.error(error.message));
      this.permMan.validateNotLogged();
    });
  }

  private createSignInForm() {
    this.signInForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern("[a-z]+")]],
      password: ['', [Validators.required]]
    });
  }

  get username() { return this.signInForm.get('username'); }
  get password() { return this.signInForm.get('password'); }
}
