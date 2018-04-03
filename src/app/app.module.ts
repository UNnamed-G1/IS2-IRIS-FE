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
import { PermissionManager } from 'app/permission-manager'

// Components
import { AppComponent } from './app.component';
  // Template
import { AppHeaderComponent } from './template/app-header/app-header.component';
import { AppFooterComponent } from './template/app-footer/app-footer.component';
import { AppServicesComponent } from './template/app-services/app-services.component';
  // Admin
import { AddUserComponent } from './admin/users/add/add-user.component';
import { UsersComponent } from './admin/users/users.component';
import { AddResearchGroupComponent } from './admin/research-groups/add/add-research-group.component';
  // Professor

  // Student

  // Public
import { AboutComponent } from './public/about/about.component';
import { EventsComponent } from './public/events/events.component';
import { HomeComponent } from './public/home/home.component';
import { LoginComponent } from './public/login/login.component';
import { NewsComponent } from './public/news/news.component';
import { NotFoundComponent } from './public/not-found/not-found.component';
import { ProfileComponent } from './public/profile/profile.component';
import { ResearchGroupsComponent } from './public/research-groups/research-groups.component';
import { SearchComponent } from './public/search/search.component';
import { TimeLineComponent } from './public/time-line/time-line.component';

// Services
import { CommonService } from './services/common.service';
import { EventService } from './services/event.service';
import { LoginService } from './services/login.service';
import { ResearchGroupService } from './services/research-group.service';
import { UserService } from './services/user.service';

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
    component: LoginComponent
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
    AddResearchGroupComponent
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
    EventService,
    LoginService,
    ResearchGroupService,
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
