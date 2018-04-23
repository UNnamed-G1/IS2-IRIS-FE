import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { select } from '@angular-redux/store';
import { ISession } from 'app/redux/session';
import { AppState } from 'app/redux/store';

import { PermissionManager } from 'app/permission-manager';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  @select(['session', 'token']) sessionToken;

  constructor(private permMan: PermissionManager) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.permMan.loggedUser()) {
      let token: string;
      this.sessionToken.subscribe((tkn: string) => token = tkn);
      req = req.clone({
        setHeaders: {
          Authorization: token
        }
      });
    }
    return next.handle(req);
  }
}
