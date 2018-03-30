import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if  Redux session token != undefined
    req = req.clone({
      setHeaders: {
        // Change to session token (Redux)
        Authorization: `TOKEN`
      }
    });

    return next.handle(req);
  }
}
