import { Component, OnInit } from '@angular/core';

import { NgRedux, select } from '@angular-redux/store';
import { LoginState } from '../redux/store';
import { REMOVE_SESSION } from '../redux/actions';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})

export class AppHeaderComponent implements OnInit {
  @select() session;
  @select() isLogged;

  constructor(private ngRedux: NgRedux<LoginState>) { }

  ngOnInit() {
  }

  logOut() {
    this.ngRedux.dispatch({ type: REMOVE_SESSION });
  }
}
