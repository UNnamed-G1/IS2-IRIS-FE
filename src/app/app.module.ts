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

import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider
} from "angular5-social-login";

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
  }
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
    SocialLoginModule
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
    AboutComponent
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    },
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
