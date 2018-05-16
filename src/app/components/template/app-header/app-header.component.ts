import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

import { NgRedux, select } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { REMOVE_SESSION, ADD_AUXILIAR } from 'app/redux/actions';
import { ISession } from 'app/redux/session';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})

export class AppHeaderComponent implements OnInit {
  @ViewChild('sucSwal') private sucSwal: SwalComponent;
  @select() session;
  @select() isLogged;

  constructor(private ngRedux: NgRedux<AppState>,
    private router: Router) { }

  ngOnInit() {
  }

  viewProfile() {
    this.session.subscribe(
      (s: ISession) => {
        this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: { user: s.id } });
        this.router.navigateByUrl('profile');
      }
    );
  }

  logOut() {
    this.ngRedux.dispatch({ type: REMOVE_SESSION });
    this.sucSwal.title = 'Se ha cerrado tu sesión satisfactoriamente';
    this.sucSwal.show();
    this.router.navigateByUrl('');
  }
}
