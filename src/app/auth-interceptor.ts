import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from "rxjs";
import { select } from '@angular-redux/store';
import { AppState } from './redux/store';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  @select() session;
  @select() isLogged;

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let isLogged, token;
    this.isLogged.subscribe(il => isLogged = il);
    if (isLogged) {
      this.session.subscribe(s => token = s.token);
      req = req.clone({
        setHeaders: {
          Authorization: token
        }
      });
    }
    return next.handle(req);
  }
}
