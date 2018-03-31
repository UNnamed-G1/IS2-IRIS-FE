import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import { AppState } from './redux/store';
import { ISession } from './redux/session';

@Injectable()
export class PermissionManager {
  @select() session;
  @select() isLogged;

  constructor(private ngRedux: NgRedux<AppState>,
    private router: Router) { }


  public validateSession(userTypes = ["estudiante", "profesor", "admin"], route = "/"): boolean {
    return this.validate(!this.loggedUser() || !this.authorizedUser(userTypes), route);
  }

  public validateLogged(route = "/"): boolean {
    return this.validate(!this.loggedUser(), route);
  }

  public validateNotLogged(route = "/"): boolean {
    return this.validate(this.loggedUser(), route);
  }

  public authorizedUser(userTypes: string[]): boolean {
    let authorized: boolean = false
    this.session.subscribe((session: ISession) => {
      authorized = userTypes.includes(session.type);
    });
    return authorized;
  }

  public loggedUser(): boolean {
    let isLogged: boolean = false
    this.isLogged.subscribe((logged: boolean) => {
      isLogged = logged;
    });
    return isLogged;
  }

  private validate(condition: boolean, route: string): boolean {
    if (condition) {
      this.goRoute(route);
    }
    return !condition;
  }

  private goRoute(route: string) {
    this.router.navigateByUrl(route);
  }
}
