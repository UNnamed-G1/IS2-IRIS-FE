import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpClient]
})

export class AppComponent {
  title = 'IRIS';

  /*users:User[];
  constructor(private http:HttpClient){
    this.http.get('http://localhost:3000/users')
    .subscribe((res : User[]) => this.users = res);
}*/
}
