import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { REMOVE_SESSION, ADD_AUXILIAR } from 'app/redux/actions';
import { ISession } from 'app/redux/session';
import { Swal } from 'app/classes/swal';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})

export class AppHeaderComponent implements OnInit {
  @select() session;
  @select() isLogged;
  swalOpts: Swal;

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
    this.swalOpts = { title: 'Se ha cerrado tu sesión satisfactoriamente', type: 'success' };
    this.router.navigateByUrl('');
  }
}
