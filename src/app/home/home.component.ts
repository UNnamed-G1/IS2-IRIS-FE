import { Component, OnInit } from '@angular/core';

import { NgRedux, select } from '@angular-redux/store';
import { LoginState } from '../redux/store';
import { ADD_SESSION, REMOVE_SESSION } from '../redux/actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @select() session;
  @select() isLogged;

  constructor(private ngRedux: NgRedux<LoginState>) { }

  ngOnInit() {
  }

}
