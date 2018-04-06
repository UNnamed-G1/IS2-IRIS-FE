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
import { AppHeaderComponent } from './template/app-header/app-header.component';
import { AppFooterComponent } from './template/app-footer/app-footer.component';
import { AppServicesComponent } from './template/app-services/app-services.component';
  // Admin
import { AddUserComponent } from './admin/users/add/add-user.component';
import { UsersComponent } from './admin/users/users.component';
import { AddResearchGroupComponent } from './admin/research-groups/add/add-research-group.component';
import { ManageComponent } from './admin/manage/manage.component';
import { ResearchListComponent } from './admin/research-groups/research-list.component';
import { AddEventComponent } from './admin/event-list/add/add-event.component';

  // Professor
import { EventListComponent } from './admin/event-list/event-list.component';

  // Student

  // User
import { LeaveCommentsComponent } from './user/leave-comments/leave-comments.component';

  // Public
import { LoginComponent } from './public/login/login.component';
import { RegisterComponent } from './public/login/register/register.component';
import { AboutComponent } from './public/about/about.component';
import { EventsComponent } from './public/events/events.component';
import { HomeComponent } from './public/home/home.component';
import { NewsComponent } from './public/news/news.component';
import { NotFoundComponent } from './public/not-found/not-found.component';
import { ProfileComponent } from './public/profile/profile.component';
import { ResearchGroupsComponent } from './public/research-groups/research-groups.component';
import { SearchComponent } from './public/search/search.component';
import { TimeLineComponent } from './public/time-line/time-line.component';

// Services
import { CommonService } from './services/common.service';
import { CareerService } from './services/career.service'
import { CommentService } from './services/comment.service';
import { DepartmentService } from './services/department.service'
import { EventService } from './services/event.service';
import { FacultyService } from './services/faculty.service'
import { LoginService } from './services/login.service';
import { ResearchGroupService } from './services/research-group.service';
import { UserService } from './services/user.service';
import { RgComponent } from './admin/research-groups/rg/rg.component';
import { FilterPipe } from './admin/research-groups/rg/filter.pipe';

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
  },
  {
    path: 'events/add',
    component: AddEventComponent
  },

  {
    path: 'admin/manage',
    component: ManageComponent
  },
  {
    path: 'research-list',
    component: ResearchListComponent
  },
  {
    path: 'event-list',
    component: EventListComponent
  },
  {
    path: 'leave-comments',
    component: LeaveCommentsComponent
  },
  {
    path: 'rg',
    component: RgComponent
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
    AppHeaderComponent,
    AppFooterComponent,
    AppServicesComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    NewsComponent,
    EventsComponent,
    ResearchGroupsComponent,
    AboutComponent,
    ProfileComponent,
    TimeLineComponent,
    SearchComponent,
    NotFoundComponent,
    ManageComponent,
    UsersComponent,
    ResearchListComponent,
    EventListComponent,
    AddUserComponent,
    AddResearchGroupComponent,
    AddEventComponent,
    LeaveCommentsComponent,
    RgComponent,
    FilterPipe
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
    CommentService,
    EventService,
    LoginService,
    CareerService,
    DepartmentService,
    FacultyService,
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
