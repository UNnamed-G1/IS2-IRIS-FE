import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { DataService } from './data.service';
import { ResponseContentType } from '@angular/http';
import { environment } from 'environments/environment';
import 'rxjs/add/operator/map'
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service'
import { HttpHeaders } from '@angular/common/http';
@Injectable()
export class PublicationService extends CommonService {
  url: string;
  backPath;
  httpOptions = {
     headers: new HttpHeaders({
     'Content-Type':  'application/json',
     'Authorization': 'my-auth-token'
    })
  };
  constructor(protected http: HttpClient) {
    super(http);
    this.url += 'publications/';
  }




  uploadPublication( formData , file) {

   let publicationData:FormData = new FormData();
   publicationData.append('name',formData.name);
   publicationData.append('date',formData.date);
   publicationData.append('abstract',formData.abstract);
   publicationData.append('brief_description',formData.brief_description);
   publicationData.append('type_pub',formData.type_pub);
   publicationData.append('created_at',formData.created_at);
   publicationData.append('updated_at',formData.updated_at);
   publicationData.append('document',file,file.document);
   let headers = new Headers();
   headers.append('enctype', 'multipart/form-data');
   headers.append('x-access-token' , localStorage.getItem( 'accessToken' ));
   headers.append('Accept', 'application/json');
   let options = new RequestOptions({ headers: headers });

    return this.http.post( this.backPath + '/publications', publicationData, this.httpOptions )
             .map( ( res: Response ) => res );
  }
}
