import { Component, OnInit } from '@angular/core';
import { AuthService, GoogleLoginProvider } from 'angular5-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(private socialAuthService: AuthService) { }

  ngOnInit() {
  }

  public socialSignIn(socialPlatform: string) {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      (userData) => {
        var name = userData.name;
        var email = userData.email;
        var image = userData.image;
        var idToken = userData.idToken;
      }
    );
  }
}
