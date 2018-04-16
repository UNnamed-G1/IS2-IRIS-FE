import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ADD_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';
import { UserService } from 'app/services/user.service';
import { User } from 'app/classes/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @ViewChild('sucDelSwal') private sucDelSwal: SwalComponent;
  @ViewChild('errDelSwal') private errDelSwal: SwalComponent;  
  @ViewChild('errUsersSwal') private errUsersSwal: SwalComponent;

  headers: Array<string> = ['Nombre completo', 'Usuario', 'Perfil profesional',
    'Tipo', 'Teléfono', 'Oficina', 'URL CvLAC'];
  keys: Array<string> = ['full_name', 'username', 'professional_profile', 'phone', 'office', 'cvlac_link', 'user_type'];
  users: Array<User>;

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
    this.permMan.validateSession(["Admin"]);
  }

  ngAfterContentInit() {
    this.route.queryParams.subscribe(params => {
      this.page = Object.assign({});
      this.page.actual = +params.page || 1;
      this.getUsers();
    })
  }

  update(id: string) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: id });
    this.router.navigateByUrl('/users/add');
  }

  delete(id: number) {
    this.userService.delete(id)
      .subscribe(
        (response: {user: User}) => {
          this.getUsers();
          this.sucDelSwal.show();
        },
        (error: HttpErrorResponse) => {
          this.errDelSwal.text += error.message;
          this.errDelSwal.show();
        }
      );
  }

  getUsers() {
    this.userService.getAll(this.page.actual)
      .subscribe(
        (res: { users: User[], total_pages: number }) => {
          this.users = res.users.map(u => Object.assign(u, {full_name: u.name + " " + u.lastname}));
          this.page.total = res.total_pages;
        },
        (error: HttpErrorResponse) => {
          this.errUsersSwal.text += error.message;
          this.errUsersSwal.show();
        }
      );
  }
}
