import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { Swal } from 'app/classes/swal';
import { User } from 'app/classes/_models';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @ViewChild('closeModal') private closeBtn: ElementRef;
  registerForm: FormGroup;
  swalOpts: Swal;

  constructor(private userService: UserService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createRegisterForm();
  }

  register() {
    const user = Object.assign(this.registerForm.value, { password: this.password.value, password_confirmation: this.passwordConf.value });
    delete user.passwords;
    this.userService.create({ 'user': user }).subscribe(
      (response: { user: User }) => {
        this.swalOpts = { title: 'Te has registrado satisfactoriamente', type: 'success' };
        this.registerForm.reset();
        this.closeBtn.nativeElement.click();
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'No ha podido realizar el registro', text: error.message, type: 'error' };
      }
    );
  }

  private createRegisterForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('[A-Za-zÀ-ÿ ]*'), Validators.minLength(3), Validators.maxLength(100)]],
      lastname: ['', [Validators.required, Validators.pattern('[A-Za-zÀ-ÿ ]*'), Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.pattern('[a-z]+@unal.edu.co')]],
      passwords: this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', [Validators.required, Validators.minLength(8)]]
      }, { validator: this.passwordMatchValidator })
    });
  }

  private passwordMatchValidator(g: FormGroup) {
    const pass = g.get('password'),
      passConf = g.get('password_confirmation');
    if (pass.dirty) {
      passConf.markAsTouched();
    }
    if (passConf.dirty) {
      pass.markAsTouched();
    }
    if (pass.invalid || (passConf.invalid && (passConf.errors.required || passConf.errors.minlength))) {
      return { 'mismatch': true };
    }
    const ans = pass.value === passConf.value ? null : { 'mismatch': true };
    passConf.setErrors(ans);
    return ans;
  }

  get name() { return this.registerForm.get('name'); }
  get lastname() { return this.registerForm.get('lastname'); }
  get email() { return this.registerForm.get('email'); }
  get passwords() { return this.registerForm.get('passwords'); }
  get password() { return this.registerForm.get('passwords.password'); }
  get passwordConf() { return this.registerForm.get('passwords.password_confirmation'); }

}
