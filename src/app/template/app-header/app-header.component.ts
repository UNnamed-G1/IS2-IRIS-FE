import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgRedux, select } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { REMOVE_SESSION, REMOVE_AUXILIAR } from 'app/redux/actions';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})

export class AppHeaderComponent implements OnInit {
  @select() session;
  @select() isLogged;

  constructor(private ngRedux: NgRedux<AppState>,
    private router: Router) { }

  ngOnInit() {
  }

  viewProfile() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR, remove: 'user' });
    this.router.navigateByUrl('profile');
  }

  logOut() {
    this.ngRedux.dispatch({ type: REMOVE_SESSION });
    this.router.navigateByUrl('');
  }
}
