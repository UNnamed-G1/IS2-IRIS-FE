import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from './user.service';
import { User } from './user';

import { NgRedux } from '@angular-redux/store';
import { AppState } from '../redux/store';
import { ADD_AUXILIAR } from '../redux/actions';

import { PermissionManager } from '../permission-manager';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  columns: Array<string> = ['id', 'name', 'lastname', 'username', 'email', 'professional_profile', 'phone, office', 'cvlac_link', 'full_name', 'user_type'];
  rows: Array<User>;

  constructor(private userService: UserService,
    private router: Router,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>) { }

  ngOnInit() {
    if (this.permMan.validateSession(["admin"])) {
      this.userService.get("users").subscribe((res: User[]) => {
        this.rows = res['users'];
      });
    }
  }

  public delete(id: string) {
    console.log("delete : " + id);
    var path = 'users/' + id;
    this.userService.delete(path).subscribe((r) => {
      this.rows = this.rows.filter((p, i) => {
        if (Number(id) === p.id) {
          return false;
        }
        return true;
      }, this.rows)
    });
  }

  public update(id: string) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: id });
    this.router.navigateByUrl('/users/add');
  }
}
