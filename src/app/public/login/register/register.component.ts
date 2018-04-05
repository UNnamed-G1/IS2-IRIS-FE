import { Component, OnInit } from '@angular/core';

import { UserService } from 'app/services/user.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userSignUp: { name: string, lastname: string, email: string, password: string, password_confirmation: string };

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userSignUp = Object.assign({}, this.userSignUp)
  }

  register() {
    this.userService.create({ "user": this.userSignUp })
      .subscribe(
        response => console.log("¡Usuario registrado!"),
        error => console.error(error.message)
      );
  }

}
