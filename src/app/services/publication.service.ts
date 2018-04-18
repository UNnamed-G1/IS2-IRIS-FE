import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { DataService } from './data.service';
import { ResponseContentType } from '@angular/http';
import { environment } from 'environments/environment';
import 'rxjs/add/operator/map'

@Injectable()
export class PublicationService {
  url: string;
  backPath;
  headers:any;

  constructor( private http: Http, private dataService: DataService ) {
    this.url = environment.api_url;
    this.backPath = dataService.backPath
    dataService.headersObs$.subscribe(
      res => {
        this.headers = res
      }
    )
  }
  public get(id?: number) {
    const idValue: string = (id) ? id.toString() : '';
    return this.http.get(this.url + idValue);
  }
  public update(id: number, body: any) {
    return this.http.put(this.url + id, body);
  }
  getAll( ) {
    const headers = new Headers( this.headers );
    const options = new RequestOptions( { headers: headers } );

    return this.http.get( this.backPath + '/publications', options )
             .map( ( res: Response ) => res );
  }


  uploadPublication( formData , file) {

   let publicationData:FormData = new FormData();
   publicationData.append('title',formData.titl);
   publicationData.append('author',formData.author);
   publicationData.append('album',formData.album);
   publicationData.append('attachment',file,file.name);
   let headers = new Headers();
   headers.append('enctype', 'multipart/form-data');
   headers.append('x-access-token' , localStorage.getItem( 'accessToken' ));
   headers.append('Accept', 'application/json');
   let options = new RequestOptions({ headers: headers });

    return this.http.post( this.backPath + '/publications', publicationData, options )
             .map( ( res: Response ) => res );
  }

  public delete( publication_id ) {
    const headers = new Headers( this.headers );
    var op = {
        responseType: ResponseContentType.Blob,
        headers: new Headers( this.headers )
    }

    return this.http.delete( this.backPath + '/publications/' + publication_id , op )
             .map( ( res: Response ) => res );
  }

}
