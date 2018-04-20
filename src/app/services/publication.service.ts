import { Injectable } from '@angular/core';
import { ResponseContentType, Http, Response, Headers, RequestOptions } from '@angular/http';
import { DataService } from './data.service';
import { environment } from 'environments/environment';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service'
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class PublicationService extends CommonService {
  headers: any;

  constructor(protected http: HttpClient) {
    super(http);
    this.url += 'publications/';
  }

  downloadPdf(id) {
    const headers = new Headers(this.headers);
    const httpOptions = {
      headers: new HttpHeaders(this.headers),
      responseType: 'blob' as 'json'
    };
    return this.http.get(environment.api_url + 'publications/' + id, httpOptions)
      .map((res: Response) => res);

  }

  uploadPublication(formData, file) {
    const publicationData: FormData = new FormData();
    publicationData.append('publication[name]', formData.name);
    publicationData.append('publication[date]', formData.date);
    publicationData.append('publication[abstract]', formData.abstract);
    publicationData.append('publication[brief_description]', formData.brief_description);
    publicationData.append('publication[type_pub]', formData.type_pub);
    publicationData.append('publication[document]', file, file.document);
    const headers = new Headers();
    headers.append('enctype', 'multipart/form-data');
    const httpOptions = {
      headers: new HttpHeaders({
      })
    };
    return this.http.post(environment.api_url + 'publications', publicationData, httpOptions)
      .map((res: Response) => res);
  }
}
