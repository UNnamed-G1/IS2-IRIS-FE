import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ResearchGroup } from './research-groups';

@Injectable()
export class ResearchGroupService {
	private API_URL : string = "http://localhost:3000/";

	constructor(private http: HttpClient){}

	get(path){
		return this.http.get(this.API_URL + path);
	}
}
