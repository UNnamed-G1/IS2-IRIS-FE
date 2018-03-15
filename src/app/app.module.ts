import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { AppServicesComponent } from './app-services/app-services.component';
import { HomeComponent } from './home/home.component';


export const appRoutes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  declarations: [
      AppComponent,
      LoginComponent,
      AppHeaderComponent,
      AppFooterComponent,
      AppServicesComponent,
      HomeComponent

    ],
  imports: [
    BrowserModule,
    RouterModule.forRoot( appRoutes )
  ],
  providers: [{provide: APP_BASE_HREF, useValue : '/' }],
  bootstrap: [AppComponent]
})

export class AppModule { }
