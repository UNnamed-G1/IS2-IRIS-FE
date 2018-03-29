import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  constructor(private userService: UserService ,private acRoute : ActivatedRoute){
  }
public user : User  = new User();
ngOnInit() {

  this.acRoute.params.subscribe((data : any)=>{
  console.log(data.id);
  if(data && data.id){
      this.userService.get("users/"+data.id).subscribe((data : User)=>{
      this.user = data;
      });
  }
  else
  {
      this.user = new User();
  }
  })
}
  public onSubmit(){
    console.log("Adding a User: " + this.user.name);
    if(this.user.id){
    this.userService.update("users/"+this.user.id,this.user).subscribe((r)=>{
        console.log(r);
        alert("User updated !");
    })
    }
    else
    this.userService.post("users",this.user).subscribe((r)=>{
    console.log(r);
    this.user = new User();
    alert("User added !");

    });
}

}
