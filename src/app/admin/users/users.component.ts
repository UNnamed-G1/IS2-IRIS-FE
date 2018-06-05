import { Component, ViewChild, OnInit, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ADD_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';

import { environment } from 'environments/environment';
import { User } from 'app/classes/_models';
import { Swal } from 'app/classes/swal';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterContentInit {

  headers: Array<string> = ['Nombre completo', 'Usuario', 'Perfil profesional',
    'Teléfono', 'Oficina', 'URL CvLAC', 'Tipo'];
  keys: Array<string> = ['full_name', 'username', 'professional_profile', 'phone', 'office', 'cvlac_link', 'user_type'];
  users: Array<User>;
  swalOpts: Swal;
  usersReportUrl = environment.api_url + 'reports/user_history.pdf?send=false';
  PDF = false;
  page: {
    actual: number,
    total: number
  };

  constructor(private permMan: PermissionManager,
    private userService: UserService,
    private ngRedux: NgRedux<AppState>,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.permMan.validateSession(['Administrador']);
  }

  ngAfterContentInit() {
    this.route.queryParams.subscribe(params => {
      this.page = Object.assign({
        actual: +params.page || 1
      });
      this.getUsers();
    });
  }

  update(id: string) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: { userUpdate: id } });
    this.router.navigateByUrl('/users/add');
  }

  details(id: number) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: { user: id } });
    this.router.navigateByUrl('/profile');
  }

  delete(id: number) {
    this.userService.delete(id).subscribe(
      (response: { user: User }) => {
        this.swalOpts = { title: 'El usuario ha sido eliminado', type: 'success'};
        this.getUsers();
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'Usuario no eliminado', text: error.message, type: 'error' };

      }
    );
  }

  pdfMode() {
    this.PDF = !this.PDF;
  }

  getUsers() {
    this.userService.getAll(this.page.actual).subscribe(
      (response: { users: User[], total_pages: number }) => {
        this.users = response.users.map(u => Object.assign(u, { full_name: u.name + ' ' + u.lastname }));
        this.page.total = response.total_pages;
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'No se han podido obtener los usuarios', text: error.message, type: 'error' };

      }
    );
  }
}
