import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export abstract class CommonService {
  url: string;

  constructor(protected http: HttpClient) {
    this.url = environment.api_url;
  }

  public get(id: number = undefined) {
    let idValue: string = (id) ? id.toString() : "";
    return this.http.get(this.url + idValue);
  }

  public create(body: any) {
    return this.http.post(this.url, body);
  }

  public update(id: number, body: any) {
    return this.http.put(this.url + id, body)
  }

  public delete(id: number) {
    return this.http.delete(this.url + id);
  }

  public applyRequestPath(request, path, params = []) {
    this.url += path;
    let r = request.apply(this, params);
    this.resetDefaultURL();
    return r;
  }

  private resetDefaultURL() {
    this.url = environment.api_url;
  }

}
