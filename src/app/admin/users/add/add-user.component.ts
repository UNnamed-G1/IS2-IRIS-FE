import { Component, OnInit, OnDestroy, AfterContentInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

import { NgRedux, select } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { REMOVE_AUXILIAR } from 'app/redux/actions';

import { PermissionManager } from 'app/permission-manager';
import { User } from 'app/classes/_models';
import { UserService } from 'app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})

export class AddUserComponent implements OnInit, AfterContentInit, OnDestroy {

  @select(['auxiliarID', 'userUpdate']) userID;
  swalOpts: any;
  user: User = new User();
  userForm: FormGroup;
  type: string[] = ['Estudiante', 'Profesor', 'Administrador'];

  constructor(private userService: UserService,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.permMan.validateSession(['Administrador']);
  }

  ngAfterContentInit() {
    this.userID.subscribe((id: number) => {
      if (id) {
        this.userService.get(id).subscribe(
          (response: { user: User }) => {
            this.user = response.user;
            this.createUserForm();
          },
          (error: HttpErrorResponse) => {
            this.swalOpts = { title: 'Evento no actualizado', text: error.message, type: 'error' };
          }
        );
      }
    });
    this.createUserForm();
  }

  ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR, remove: 'userUpdate' });
  }

  public onSubmit() {
    if (this.userForm.pristine) {
      return;
    }
    const u = new User();
    for (const k in this.userForm.controls) {
      if (this.userForm.get(k).dirty) {
        u[k] = this.userForm.get(k).value;
      }
    }
    if (u['passwords']) {
      Object.assign(u, {
        password: u['passwords'].password,
        password_confirmation: u['passwords'].pass
      });
      delete u['passwords'];
    }
    if (u.username) {
      u.email = u.username + '@unal.edu.co';
    }
    if (this.user.id) {
      this.userService.update(this.user.id, { user: u }).subscribe(
        (response: { user: User }) => {
          this.swalOpts = { title: 'El usuario ha sido actualizado', type: 'success', confirm: this.navList, confirmParams: [this] };
          Object.assign(this.user, response.user);
          this.createUserForm();
        },
        (error: HttpErrorResponse) => {
          this.swalOpts = { title: 'Usuario no actualizado', text: error.message, type: 'error' };
        }
      );
    } else {
      this.userService.create({ user: u }).subscribe(
        (response: { user: User }) => {
          this.swalOpts = { title: 'El usuario ha sido añadido', type: 'success', confirm: this.navList, confirmParams: [this] };

        },
        (error: HttpErrorResponse) => {
          this.swalOpts = { title: 'Usuario no añadido', text: error.message, type: 'error' };

          }
      );
    }
  }

    navList(){
      this.router.navigateByUrl('users');
    }

  private createUserForm() {
    this.userForm = this.formBuilder.group({
      name: [this.user.name,
      [Validators.required, Validators.pattern('[A-Za-zÀ-ÿ ]*'),
      Validators.minLength(3), Validators.maxLength(100)]],
      lastname: [this.user.lastname,
      [Validators.required, Validators.pattern('[A-Za-zÀ-ÿ ]*'),
      Validators.minLength(3), Validators.maxLength(100)]],
      username: [this.user.username, [Validators.required, Validators.pattern('[a-z]+')]],
      user_type: [this.user.user_type],
      professional_profile: [this.user.professional_profile],
      phone: [this.user.phone,
      [Validators.pattern('[0-9 +-]*'), Validators.minLength(7), Validators.maxLength(20)]],
      office: [this.user.office, [Validators.minLength(7), Validators.maxLength(20)]],
      cvlac_link: [this.user.cvlac_link],
      passwords: this.formBuilder.group({
        password: [''],
        password_confirmation: ['']
      }, { validator: this.passwordMatchValidator })
    });
    const pwdValidators = [Validators.minLength(8)],
      profValidators = [Validators.maxLength(5000)];
    if (!this.user.id) {
      pwdValidators.push(Validators.required);
    } else {
      profValidators.push(Validators.required);
    }
    this.password.setValidators(pwdValidators);
    this.passwordConf.setValidators(pwdValidators);
    this.professional_profile.setValidators(profValidators);
  }

  private passwordMatchValidator(g: FormGroup) {
    const pass = g.get('password'),
      passConf = g.get('password_confirmation');
    if (pass.invalid || (passConf.invalid && passConf.errors.minlength)) {
      return { 'mismatch': true };
    }
    if (pass.dirty) {
      passConf.markAsDirty();
    }
    const ans = pass.value === passConf.value ? null : { 'mismatch': true };
    passConf.setErrors(ans);
    return ans;
  }

  get name() { return this.userForm.get('name'); }
  get lastname() { return this.userForm.get('lastname'); }
  get user_type() { return this.userForm.get('user_type'); }
  get professional_profile() { return this.userForm.get('professional_profile'); }
  get username() { return this.userForm.get('username'); }
  get phone() { return this.userForm.get('phone'); }
  get office() { return this.userForm.get('office'); }
  get cvlac_link() { return this.userForm.get('cvlac_link'); }
  get passwords() { return this.userForm.get('passwords'); }
  get password() { return this.userForm.get('passwords.password'); }
  get passwordConf() { return this.userForm.get('passwords.password_confirmation'); }
}
