import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
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

export class AddUserComponent implements OnInit, OnDestroy {
  @select() auxiliarID;
  user: User;

  constructor(private userService: UserService,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>) {
  }

  ngOnInit() {
    this.user = new User();
    if (this.permMan.validateSession(["admin"])) {
      this.auxiliarID.subscribe(id => {
        if (id) {
          this.userService.get(id).subscribe((user: { user: User }) => {
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
      this.userService.update(this.user.id, this.user).subscribe(r => {
        console.log(r);
      })
    } else {
      this.userService.create(this.user).subscribe(r => {
        console.log(r);
      });
    }
  }

}
