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
      this.sessionToken.subscribe((tkn: string) => {
        if (tkn) {
          req = req.clone({
            setHeaders: {
              Authorization: tkn
            }
          });
        }
      });
    }
    return next.handle(req);
  }
}
