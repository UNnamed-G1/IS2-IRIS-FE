import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class DataService {

  private userData = new Subject<any>( );
  userObs$ = this.userData.asObservable( );

  private headers = new Subject<any>( );
  headersObs$ = this.headers.asObservable( );

  
  constructor( private http: Http ) { }

  init( ) {
    var accessToken = localStorage.getItem( 'accessToken' )

    if ( accessToken == null ) {
      this.headers.next({
        'Content-Type' : 'application/json; charset=utf-8',
        'x-access-token' : undefined
      })
      return false
    } else {
      this.headers.next({
        'Content-Type' : 'application/json; charset=utf-8',
        'x-access-token' : accessToken
      })
      return true
    }
  }

  updateUserData( data ) {
    this.userData.next( data )
  }

  updateAccessToken( accessToken ) {
    var hds = {
      'Content-Type' : 'application/json; charset=utf-8',
      'x-access-token' : accessToken
    }
    this.headers.next( hds )
    localStorage.setItem( 'accessToken', accessToken )
  }

  destroySession( ) {
    var hds = {
      'Content-Type' : 'application/json; charset=utf-8',
      'x-access-token' : undefined
    }
    this.headers.next( hds )
    localStorage.removeItem( 'accessToken' )
    localStorage.removeItem( 'userData' )
  }

}
