import { Component, OnInit, OnDestroy, AfterContentInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { AppState } from 'app/redux/store';
import { REMOVE_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';
import { User } from 'app/classes/user';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})

export class AddUserComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('sucSwal') private sucSwal: SwalComponent;
  @ViewChild('errSwal') private errSwal: SwalComponent;

  @select() auxiliarID;

  user: User = new User();
  userForm: FormGroup;
  type: string[] = ['Estudiante', 'Profesor', 'Admin'];

  constructor(private userService: UserService,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.permMan.validateSession(['Admin']);
  }

  ngAfterContentInit() {
    this.auxiliarID.subscribe(id => {
      if (id) {
        this.userService
          .get(id)
          .subscribe(
            (response: { user: User }) => {
              this.user = response.user;
              this.createUserForm();
            },
            (error: HttpErrorResponse) => {
              this.errSwal.title = 'No se ha podido obtener el usuario';
              this.errSwal.text = 'Mensaje de error: ' + error.message;
              this.errSwal.show();
            });
      }
    });
    this.createUserForm();
  }

  ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR });
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
    if (u.name) {
      Object.assign(u, {
        name: u.name['first'],
        lastname: u.name['last']
      });
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
    if (u.user_type) {
      u.user_type = u.user_type.toLowerCase();
    }
    if (this.user.id) {
      this.userService
        .update(this.user.id, { user: u })
        .subscribe(
          (response: { user: User }) => {
            this.sucSwal.title = 'El usuario ha sido actualizado';
            this.sucSwal.show();
            Object.assign(this.user, response.user);
            this.createUserForm();
          },
          (error: HttpErrorResponse) => {
            this.errSwal.title = 'Usuario no actualizado';
            this.errSwal.text = 'Mensaje de error: ' + error.message;
            this.errSwal.show();
          }
        );
    } else {
      this.userService
        .create({ user: u })
        .subscribe(
          (response: { user: User }) => {
            this.sucSwal.title = 'El usuario ha sido añadido';
            this.sucSwal.show();
            this.userForm.reset();
          },
          (error: HttpErrorResponse) => {
            this.errSwal.title = 'Usuario no añadido';
            this.errSwal.text = 'Mensaje de error: ' + error.message;
            this.errSwal.show();
          })
        ;
    }
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

  private createUserForm() {
    this.userForm = this.formBuilder.group({
      name: this.formBuilder.group({
        first: [this.user.name,
        [Validators.required, Validators.pattern('[A-Za-zÀ-ÿ ]*'),
        Validators.minLength(3), Validators.maxLength(100)]],
        last: [this.user.lastname,
        [Validators.required, Validators.pattern('[A-Za-zÀ-ÿ ]*'),
        Validators.minLength(3), Validators.maxLength(100)]]
      }),
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

  get name() { return this.userForm.get('name'); }
  get first() { return this.userForm.get('name.first'); }
  get last() { return this.userForm.get('name.last'); }
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
