import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { select, NgRedux } from '@angular-redux/store';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from 'app/classes/user';
import { UserService } from 'app/services/user.service';
import { AppState } from 'app/redux/store';
import { ADD_AUXILIAR } from 'app/redux/actions';

@Component({
  selector: 'app-follows',
  templateUrl: './follows.component.html',
  styleUrls: ['./follows.component.css']
})
export class FollowsComponent implements OnInit {
  @ViewChild('errSwal') private errSwal: SwalComponent;
  @Input() displayFollowers: boolean;
  @Output() setFollowersCount = new EventEmitter<number>();
  @Output() setFollowingCount = new EventEmitter<number>();
  @select() isLogged;
  @select() auxiliarID;

  currFollowing = new Array<User>();
  following: User[];
  followers: User[];

  constructor(private userService: UserService,
    private ngRedux: NgRedux<AppState>,
    private router: Router) { }

  ngOnInit() {
    this.auxiliarID.subscribe(
      (id: number) => {
        this.isLogged.subscribe((logged: boolean) => {
          if (id) {
            this.setCurrFollowing();
          }
        });
        this.setFollowing(id);
        this.setFollowers(id);
      }
    );
  }

  goToUser(id: number) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: id });
    this.router.navigateByUrl('/profile');
  }

  unfollow(id: number) {
    this.userService.unfollow(id).subscribe(
      (response) => {
        this.setCurrFollowing();
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'No se ha podido dejar de seguir el usuario';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
  }

  follow(id: number) {
    this.userService.follow(id).subscribe(
      (response) => {
        this.setCurrFollowing();
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'No se ha podido seguir el usuario';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
  }

  // Users following profile user
  setFollowers(id?: number) {
    this.userService.getFollowers(id).subscribe(
      (response) => {
        this.followers = response.followers;
        this.setFollowersCount.emit(response.count);
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'No se han podido obtener los usuarios seguidos';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
  }

  // Users followed by profile user
  setFollowing(id?: number) {
    this.userService.getFollowing(id).subscribe(
      (response) => {
        console.log(response)
        this.isLogged.subscribe((logged: boolean) => {
          if (!id) {
            this.currFollowing = response.following.map(u => u.username);
          }
        });
        this.following = response.following;
        this.setFollowingCount.emit(response.count);
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'No se han podido obtener los usuarios seguidos';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
  }

  // Users followed by logged user
  setCurrFollowing() {
    this.userService.getFollowing().subscribe(
      (response) => {
        this.auxiliarID.subscribe(
          (id: number) => {
            if (!id) {
              this.setFollowingCount.emit(response.count);
            }
          });
        this.currFollowing = response.following.map(u => u.username);
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'No se han podido obtener los usuarios seguidos';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
  }

  toggleDisplay(display: boolean) {
    this.displayFollowers = display;
  }
}
