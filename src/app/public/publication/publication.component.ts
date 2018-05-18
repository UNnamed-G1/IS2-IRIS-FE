import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { select, NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ADD_AUXILIAR } from 'app/redux/actions';

import { environment } from 'environments/environment';
import { PublicationService } from 'app/services/publication.service';
import { Publication, User } from 'app/classes/_models';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css']
})
export class PublicationComponent implements OnInit {
  @select(['auxiliarID', 'publication']) publicationID;
  @select(['session', 'type']) sessionType;
  publication: Publication = new Publication();
  citesKeys: Array<String>;
  cites: any;
  swalOpts: any;

  constructor(private ngRedux: NgRedux<AppState>,
    private publicationService: PublicationService,
    private router: Router) { }

  ngOnInit() {
    this.publicationID.subscribe((id) => {
      if (id) {
        this.publicationService.get(id).subscribe(
          (response: { publication: Publication }) => {
            this.setPublication(response.publication);
          },
          (error: HttpErrorResponse) => {
            this.swalOpts = { title: 'La publicación no ha podido ser obtenida', message: error.message, type: 'error' };
          }
        )
      } else {
        this.router.navigateByUrl('/');
      }
    });
  }

  viewAuthor(id: number) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: { user: id } });
    this.router.navigateByUrl('/profile')
  }

  private setPublication(publication: Publication) {
    if (publication.document) {
      publication.document = environment.api_url + publication.document;
    }
    publication.users.map((user: User) => Object.assign(user, { photo: environment.api_url + user.photo.picture }));
    this.publication = publication;
    this.setCites();
  }

  // Citation methods
  private setCites() {
    this.cites = {
      APA: this.apaCitation(),
      MLA: this.ieeeCitation(),
      TeX: this.texCitation(),
    };
    this.citesKeys = Object.keys(this.cites);
  }

  private apaCitation(): string {
    let authors: string, date: string, title: string;
    authors = this.apaCitationNames();
    date = this.apaCitationDate();
    title = this.publication.name;
    return authors + ' ' + date + ' <i>' + title + '</i>.';
  }

  private apaCitationNames(): string {
    const names: Array<string> = new Array<string>();
    this.publication.users.forEach((author) => {
      names.push(author.lastname.split(' ')[0] + ', ' + author.name.split(' ').map((name: string) => name[0] + '.').join(' '));
    });
    let last_author = ' & ' + names[names.length - 1];
    if (this.publication.users.length >= 8) {
      last_author = '...' + last_author;
      names.slice(0, 6);
    } else {
      names.pop();
    }
    return names.join(', ') + last_author
  }

  private apaCitationDate(): string {
    const publicationDate: string[] = new Date(this.publication.date).toString().split(' ');
    return '(' + publicationDate[3] + ', ' + publicationDate[1] + ' ' + publicationDate[2] + ').';
  }

  private ieeeCitation(): string {
    const authors: string = this.ieeeCitationNames(),
      date: string = new Date(this.publication.date).getFullYear().toString() + '.',
      title: string = this.publication.name;
    return authors + ', <i>' + title + '</i>.' + ' ' + date;
  }

  private ieeeCitationNames(): string {
    const names: Array<string> = new Array<string>();
    this.publication.users.forEach((author) => {
      names.push(author.name.split(' ').map((name: string) => name[0] + '.').join(' ') + ' ' + author.lastname.split(' ')[0]);
    });
    const last_author = ' and ' + names[names.length - 1];
    names.pop();
    return names.join(', ') + last_author
  }

  private texCitation(): string {
    const title: string = this.publication.name,
      authors: string = this.texCitationNames(),
      year: string = new Date(this.publication.date).getFullYear().toString(),
      citename: string = this.publication.name + year;
    return '@article{' + citename
      + ', author = {' + authors + '}'
      + ', title = {' + title + '}'
      + ', year =' + year
      + ' }';
  }

  private texCitationNames(): string {
    const names: Array<string> = new Array<string>();
    let authors;
    this.publication.users.forEach((author) => {
      names.push(author.name + ' ' + author.lastname);
    });
    authors = ' and ' + names[names.length - 1];
    names.pop();
    return names.join(', ') + authors
  }
  
}
