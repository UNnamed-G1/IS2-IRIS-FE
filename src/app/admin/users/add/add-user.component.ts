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
  user: User = new User();

  constructor(private userService: UserService,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>) { }

  ngOnInit() {
    this.permMan.validateSession(["admin"]);
  }

  ngAfterViewInit() {
    this.auxiliarID.subscribe(id => {
      if (id) {
        this.userService.get(id).subscribe((user: { user: User }) => {
          this.user = user.user;
        });
      }
    });
  }

  ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR })
  }

  public onSubmit() {
    console.log("Adding a Group: " + this.user.name);
    if (this.user.id) {
      this.userService.update(this.user.id, { user: this.user }).subscribe(r => {
        console.log(r);
        alert("User Updated !");
      })
    } else {
      this.userService.create({ user: this.user }).subscribe(r => {
        console.log(r);
        alert("User Added !");
      });
    }
  }

}
