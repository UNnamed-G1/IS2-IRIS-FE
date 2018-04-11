import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  headers: Array<string> = ['Nombre completo', 'Usuario', 'Perfil profesional',
     'Teléfono', 'Oficina','URL CvLAC','Tipo'];
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
    this.permMan.validateSession(["admin"]);
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
        r => this.getUsers(),
        error => { });
  }

  getUsers() {
    this.userService.getAll(this.page.actual)
      .subscribe((res: { users: User[], total_pages: number }) => {
        this.users = res.users.map(u => Object.assign(u, {full_name: u.name + " " + u.lastname}));
        this.page.total = res.total_pages;
      }, error => { });
  }
}
