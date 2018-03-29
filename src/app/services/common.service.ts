import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class CommonService {
  url: string = environment.api_url;

  constructor(public http: HttpClient) { }

  public get(path) {
    return this.http.get(this.url + path);
  }

  public post(path: string, body: any) {
    console.log(body, this.url + path)
    return this.http.post(this.url + path, body);
  }

  public delete(path: string) {
    return this.http.delete(this.url + path);
  }

  public update(path: string, body: any) {
    return this.http.put(this.url + path, body);
  }

}
