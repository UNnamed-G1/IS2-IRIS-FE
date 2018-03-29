import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {

  columns = ['id','name','lastname','username','email','professional_profile', 'phone, office', 'cvlac_link','full_name','user_type'];
  rows : Array<User>;
  constructor(private userService: UserService ,private  router : Router) {
      }
  ngOnInit() {
    this.userService.get("users").subscribe((res : User[]) => {
      console.log(res['users']);
      this.rows = res['users'];
    });
  };

  public delete(id:string){

      console.log("delete : " + id);
      var path = 'users/' + id;
      this.userService.delete(path).subscribe((r)=>{

      this.rows = this.rows.filter((p,i)=>{

          if(Number(id) === p.id )
          {
          return false;
          }
          return true;
      },this.rows)

      });

  }
  public update(id:string){
    console.log("update : " + id );
    this.router.navigateByUrl('/users/add/' + id);
  }
}
