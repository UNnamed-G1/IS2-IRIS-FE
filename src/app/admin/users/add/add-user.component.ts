import { Component, OnInit, OnDestroy, AfterContentInit, ViewChild } from '@angular/core';
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
  @ViewChild('errLoad') private errLoad: SwalComponent;
  @ViewChild('sucAdd') private sucAdd: SwalComponent;
  @ViewChild('errAdd') private errAdd: SwalComponent;
  @ViewChild('sucUpd') private sucUpd: SwalComponent;
  @ViewChild('errUpd') private errUpd: SwalComponent;

  @select() auxiliarID;

  user: User = new User();

  constructor(private userService: UserService,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>) { }

  ngOnInit() {
    this.permMan.validateSession(['admin']);
  }

  ngAfterContentInit() {
    this.auxiliarID.subscribe(id => {
      if (id) {
        this.userService.get(id).subscribe((user: { user: User }) => {
          this.user = user.user;
        });
      }
    });
  }

  ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR });
  }

  public onSubmit() {
    if (this.user.id) {
      this.userService
        .update(this.user.id, { user: this.user })
        .subscribe(
          (response: { user: User }) => {
            this.sucUpd.show();
          },
          (error: HttpErrorResponse) => {
            this.errUpd.text += error.message;
            this.errUpd.show();
          }
        );
    } else {
      this.userService
        .create({ user: this.user })
        .subscribe(
          (response: { user: User }) => {
            this.sucAdd.show();
            this.user = new User();
          },
          (error: HttpErrorResponse) => {
            this.errAdd.text += error.message;
            this.errAdd.show();
          }
        );
    }
  }

}
