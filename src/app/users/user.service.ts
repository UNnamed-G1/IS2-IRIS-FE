import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../common.service'

@Injectable()
export class UserService {

  API_URL: string = "http://localhost:3000/";
  constructor(public http: HttpClient, private commonService: CommonService) { }

  public getUser(id) {
    return this.commonService.get("users/" + id);
  }

  public getCurrentUser() {
    return this.commonService.get("users/current")
  }

  public updateUser(id, user) {
    return this.commonService.update("users/" + id, user);
  }

  // read method
  public get(path) {

    var endpoint = this.API_URL + path;
    //return this.http.get( endpoint).map( ( res: Response ) => res );
    return this.http.get(endpoint);

  }

  // create method
  public post(path: string, body: any) {

    var endpoint = this.API_URL + path;
    return this.http.post(endpoint, body);

  }
  // delete method
  public delete(path: string) {

    var endpoint = this.API_URL + path;
    return this.http.delete(endpoint);
  }
  // update method
  public update(path: string, body: any) {
    var endpoint = this.API_URL + path;
    return this.http.put(endpoint, body);
  }

}
