import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from 'app/services/user.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private userService: UserService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createRegisterForm();
  }

  register() {
    let u = this.registerForm.value;
    let user = {
      name: u.name.first,
      lastname: u.name.last,
      email: u.email,
      password: u.passwords.password,
      password_confirmation: u.passwords.password_confirmation
    };
    /*let user = {
      name: this.first.value,
      lastname: this.last.value,
      email: this.email.value,
      password: this.password.value,
      password_confirmation: this.passwordConf.value
    };*/
    this.userService.create({ "user": user })
      .subscribe(
        response => this.registerForm.reset(),
        error => console.error(error.message)
      );
  }

  private createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      name: this.formBuilder.group({
        first: ['', [Validators.required, Validators.pattern("[a-zA-Z ]*"), Validators.minLength(3), Validators.maxLength(100)]],
        last: ['', [Validators.required, Validators.pattern("[a-zA-Z ]*"), Validators.minLength(3), Validators.maxLength(100)]]
      }),
      email: ['', [Validators.required, Validators.pattern("[a-z]+@unal.edu.co")]],
      passwords: this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', [Validators.required, Validators.minLength(8)]]
      }, { validator: this.passwordMatchValidator })
    });
  }

  private passwordMatchValidator(g: FormGroup) {
    let pass = g.get('password'),
      passConf = g.get('password_confirmation');
    if (pass.dirty)
      passConf.markAsTouched();
    if (passConf.dirty)
      pass.markAsTouched();
    if (pass.invalid || (passConf.invalid && (passConf.errors.required || passConf.errors.minlength)))
      return { 'mismatch': true };
    let ans = pass.value === passConf.value ? null : { 'mismatch': true };
    passConf.setErrors(ans);
    return ans;
  }

  get name() { return this.registerForm.get('name'); }
  get first() { return this.registerForm.get('name.first'); }
  get last() { return this.registerForm.get('name.last'); }
  get email() { return this.registerForm.get('email'); }
  get passwords() { return this.registerForm.get('passwords'); }
  get password() { return this.registerForm.get('passwords.password'); }
  get passwordConf() { return this.registerForm.get('passwords.password_confirmation'); }

}
