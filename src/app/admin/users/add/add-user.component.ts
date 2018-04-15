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
  @ViewChild('errLoadSwal') private errLoadSwal: SwalComponent;
  @ViewChild('sucAddSwal') private sucAddSwal: SwalComponent;
  @ViewChild('errAddSwal') private errAddSwal: SwalComponent;
  @ViewChild('sucUpdSwal') private sucUpdSwal: SwalComponent;
  @ViewChild('errUpdSwal') private errUpdSwal: SwalComponent;

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
            this.sucUpdSwal.show();
          },
          (error: HttpErrorResponse) => {
            this.errUpdSwal.text += error.message;
            this.errUpdSwal.show();
          }
        );
    } else {
      this.userService
        .create({ user: this.user })
        .subscribe(
          (response: { user: User }) => {
            this.sucAddSwal.show();
            this.user = new User();
          },
          (error: HttpErrorResponse) => {
            this.errAddSwal.text += error.message;
            this.errAddSwal.show();
          }
        );
    }
  }

}
