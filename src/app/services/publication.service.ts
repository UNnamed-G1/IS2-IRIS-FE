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
  headers: any;

  url: string;
  backPath = 'http://localhost:3000';

  constructor(protected http: HttpClient) {
    super(http);
    this.url += 'publications/';
  }




  uploadPublication( formData , file) {

   let publicationData:FormData = new FormData();
   publicationData.append('publication[name]',formData.name);
   publicationData.append('publication[date]',formData.date);
   publicationData.append('publication[abstract]',formData.abstract);
   publicationData.append('publication[brief_description]',formData.brief_description);
   publicationData.append('publication[type_pub]',formData.type_pub);
   publicationData.append('publication[document]',file,file.document);
   let headers = new Headers();
   headers.append('enctype', 'multipart/form-data');
   let httpOptions = {
      headers: new HttpHeaders({
      })
   };
    return this.http.post( 'http://localhost:3000/publications', publicationData, httpOptions )
             .map( ( res: Response ) => res );
  }

  downloadPdf( id ) {
    return this.http.get( 'http://localhost:3000/publications' + id , {headers: new HttpHeaders, responseType: 'blob' as 'json'} )
             .map( ( res: Response ) => res );
  }
}
