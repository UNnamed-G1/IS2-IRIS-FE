// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from "angular5-social-login";
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { NgRedux, NgReduxModule } from '@angular-redux/store';
import * as persistState from 'redux-localstorage';

// Redux imports
import { AppState, rootReducer, INITIAL_STATE } from './redux/store';
// Requests interceptor
import { AuthInterceptor } from './auth-interceptor'
// Permission manager
import { PermissionManager } from './permission-manager'
// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register/register.component';
import { AppHeaderComponent } from './template/app-header/app-header.component';
import { AppFooterComponent } from './template/app-footer/app-footer.component';
import { AppServicesComponent } from './template/app-services/app-services.component';
import { HomeComponent } from './home/home.component';
import { NewsComponent } from './news/news.component';
import { EventsComponent } from './events/events.component';
import { AboutComponent } from './about/about.component';
import { ProfileComponent } from './profile/profile.component';
import { TimeLineComponent } from './time-line/time-line.component';
import { SearchComponent } from './search/search.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UsersComponent } from './users/users.component';
import { AddUserComponent } from './users/add/add-user.component';
import { ResearchGroupsComponent } from './research-groups/research-groups.component';
import { AddResearchGroupComponent } from './research-groups/add/add-research-group.component';

// Services
import { CommonService } from './common.service';
import { LoginService } from './login/login.service';
import { ResearchGroupsService } from './research-groups/research-groups.service';
import { UserService } from './users/user.service';

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'time-line',
    component: TimeLineComponent
  },
  {
    path: 'events',
    component: EventsComponent
  },
  {
    path: 'news',
    component: NewsComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'research-groups',
    component: ResearchGroupsComponent,
    //children: [{path: 'add', component: AddResearchGroupComponent}]
  },
  {
    path: 'login',
    component: LoginComponent,
    children: [{path:'register', component: RegisterComponent}]
  },
  {
    path: 'users',
    component: UsersComponent,
    //children: [{path: 'add', component: AddUserComponent}]
  },
  {
    path: 'users/add',
    component: AddUserComponent
  },
  {
    path: 'research-groups/add',
    component: AddResearchGroupComponent
  }/*,
  {
    path: '404',
    component: NotFoundComponent
  },
  { path: '**',
    redirectTo: 'NotFound' }*/
];


@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    SocialLoginModule,
    FormsModule,
    HttpClientModule,
    NgReduxModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    AppHeaderComponent,
    AppFooterComponent,
    AppServicesComponent,
    HomeComponent,
    NewsComponent,
    EventsComponent,
    ResearchGroupsComponent,
    AboutComponent,
    ProfileComponent,
    TimeLineComponent,
    SearchComponent,
    NotFoundComponent,
    UsersComponent,
    AddUserComponent,
    AddResearchGroupComponent,
    RegisterComponent
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    },
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    PermissionManager,
    CommonService,
    LoginService,
    ResearchGroupsService,
    UserService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(ngRedux: NgRedux<AppState>) {
    ngRedux.configureStore(rootReducer, INITIAL_STATE, undefined, persistState());
  }
}

// Social Login config
export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
    [{
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("866195745492-1gm5oqaoosblouo7v9sjndpaj38532ol.apps.googleusercontent.com")
    }]
  );
  return config;
}
