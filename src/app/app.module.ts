import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { AppServicesComponent } from './app-services/app-services.component';
import { HomeComponent } from './home/home.component';
import { NewsComponent } from './news/news.component';
import { EventsComponent } from './events/events.component';
import { ResearchGroupsComponent } from './research-groups/research-groups.component';
import { AboutComponent } from './about/about.component';
import { ProfileComponent } from './profile/profile.component';
import { TimeLineComponent } from './time-line/time-line.component';
import { SearchComponent } from './search/search.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HttpClientModule} from '@angular/common/http';
import { UsersComponent } from './users/users.component';
import { UserService } from './user.service';
import { FormsModule } from '@angular/forms';
import { AddUserComponent } from './add-user/add-user.component';
import {  SocialLoginModule,  AuthServiceConfig,  GoogleLoginProvider} from "angular5-social-login";

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
    component: ResearchGroupsComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'users/add',
    component: AddUserComponent
  },
  {
    path: 'users/add/:id',
    component: AddUserComponent
  }/*,
  {
    path: '404',
    component: NotFoundComponent
  },
  { path: '**',
    redirectTo: 'NotFound' }*/
];

// Social Login config
export function getAuthServiceConfigs() {
 let config = new AuthServiceConfig(
     [
       {
         id: GoogleLoginProvider.PROVIDER_ID,
         provider: new GoogleLoginProvider("866195745492-1gm5oqaoosblouo7v9sjndpaj38532ol.apps.googleusercontent.com")
       }
     ]
 );
 return config;
}

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    SocialLoginModule,
    FormsModule,
    HttpClientModule
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
    AddUserComponent
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
    UserService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
