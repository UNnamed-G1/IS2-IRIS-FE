import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export abstract class CommonService {
  url: string;

  constructor(protected http: HttpClient) {
    this.url = environment.api_url;
  }

  public get(id?: number) {
    const idValue: string = (id) ? id.toString() : '';
    return this.http.get(this.url + idValue);
  }
  
  public getAll(page: number) {
    return this.http.get(this.url.substring(0, this.url.length - 1) + '?page=' + page);
  }
  
  public create(body: any) {
    return this.http.post(this.url, body);
  }
  
  public update(id: number, body: any) {
    const idValue: string = (id) ? id.toString() : '';
    return this.http.put(this.url + idValue, body);
  }
  
  public delete(id: number) {
    const idValue: string = (id) ? id.toString() : '';
    return this.http.delete(this.url + idValue);
  }

  public applyRequestPath(request, path, params?: any[]) {
    const temp = this.url;
    this.url = environment.api_url + path;
    const response = request.apply(this, params);
    this.url = temp;
    return response;
  }

}
