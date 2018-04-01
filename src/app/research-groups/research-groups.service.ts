import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ResearchGroup } from './research-groups';

@Injectable()
export class ResearchGroupService {
	private API_URL : string = "http://localhost:3000/";

	constructor(private http: HttpClient){}

	public get(path){
	  return this.http.get(this.API_URL + path);
	}

  public post(path: string, body: any) {
    return this.http.post(this.API_URL + path, body);
  }

  public delete(path: string) {
    return this.http.delete(this.API_URL + path);
  }

  public update(path: string, body: any) {
    return this.http.put(this.API_URL + path, body);
  }
}
