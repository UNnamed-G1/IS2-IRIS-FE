import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { PermissionManager } from './permission-manager';
import { ISession } from './redux/session';
import { Observable } from "rxjs";
import { select } from '@angular-redux/store';
import { AppState } from './redux/store';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  @select() session;

  constructor(private permMan: PermissionManager) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.permMan.loggedUser()) {
      let token: string;
      this.session.subscribe((s: ISession) => token = s.token);
      req = req.clone({
        setHeaders: {
          Authorization: token
        }
      });
    }
    return next.handle(req);
  }
}
