import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { User } from 'app/classes/user';
import { NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ADD_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  columns: Array<string> = ['name', 'lastname', 'username', 'email', 'professional_profile', 'phone', 'office', 'cvlac_link', 'user_type'];
  rows: Array<User>;
  public userItem:User;
  public searchString:string;
  page: number;

  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>) { }

  ngOnInit() {
    this.permMan.validateSession(["admin"]);
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      this.page = +params['page'] || 1;
      this.userService.getAll(this.page).subscribe((res: User[]) => {
        this.rows = res['users'];
      });
    })
  }

  public delete(id: number) {
    console.log("delete : " + id);
    this.userService.delete(id).subscribe((r) => {
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

  nextPage() {
    this.router.navigate(['/users'], { queryParams: { page: this.page + 1 } });
  }

  prevPage() {
    this.router.navigate(['/users'], { queryParams: { page: this.page - 1 } });
  }

  goToPage(page: number) {
    this.router.navigate(['/users'], { queryParams: { page: page } });
  }
}
