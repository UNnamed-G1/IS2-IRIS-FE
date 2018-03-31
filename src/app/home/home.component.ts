import { Component, OnInit } from '@angular/core';

import { NgRedux, select } from '@angular-redux/store';
import { AppState } from '../redux/store';

import { PermissionManager } from '../permission-manager'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @select() session;
  @select() isLogged;

  constructor(private ngRedux: NgRedux<AppState>) { }

  ngOnInit() {
  }

}
