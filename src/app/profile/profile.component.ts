import { Component, OnInit } from '@angular/core';

import { UserService } from '../users/user.service'
import { select } from '@angular-redux/store';
import { PermissionManager } from '../permission-manager';
import { User } from '../users/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @select() auxiliarID;
  user: User;
  showInput: boolean = false;

  constructor(private userService: UserService,
    private permMan: PermissionManager) { }

  ngOnInit() {
    if (this.permMan.validateLogged()) {
      this.auxiliarID.subscribe(id => {
        let getUser = (id) ? this.userService.getUser(id) : this.userService.getCurrentUser();
        getUser.subscribe((user: {user: User}) => {
          this.user = new User();
          Object.assign(this.user, user.user);
          console.log(this.user)
        });
      });
    }
  }

  updateProfile() {
    this.userService.updateUser(this.user.id, this.user).subscribe(
      response => console.log(response),
      error => console.error(error)
    );
    this.toggleShowInput();
  }

  toggleShowInput() {
    this.showInput = !this.showInput
  }

}
