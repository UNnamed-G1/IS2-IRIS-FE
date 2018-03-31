import { Component, OnInit, OnDestroy } from '@angular/core';

import { NgRedux, select } from '@angular-redux/store';
import { AppState } from '../redux/store';
import { REMOVE_AUXILIAR } from '../redux/actions';

import { PermissionManager } from '../permission-manager';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})

export class AddUserComponent implements OnInit, OnDestroy {
  @select() auxiliarID;
  user: User;

  constructor(private userService: UserService,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>) {
  }

  ngOnInit() {
    if (this.permMan.validateSession(["admin"])) {
      this.auxiliarID.subscribe(id => {
        this.user = new User();
        if (id) {
          this.userService.get("users/" + id).subscribe((user: { user: User }) => {
            this.user = user.user;
          });
        }
      });
    }
  }

  ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR })
  }

  public onSubmit() {
    if (this.user.id) {
      this.userService.update("users/" + this.user.id, this.user).subscribe(r => {
        console.log(r);
      })
    } else {
      this.userService.post("users", this.user).subscribe(r => {
        console.log(r);
      });
    }
  }

}
