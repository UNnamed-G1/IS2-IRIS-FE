import { Component, OnInit, ViewChild, AfterContentInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ADD_AUXILIAR } from 'app/redux/actions';

import { PermissionManager } from 'app/permission-manager';
import { Event, Publication, ResearchGroup, User } from 'app/classes/_models';
import { Swal } from 'app/classes/swal';
import { environment } from 'environments/environment';

import { ResearchGroupService } from 'app/services/research-group.service';
import { UserService } from 'app/services/user.service';
import { EventService } from 'app/services/event.service';
import { PublicationService } from 'app/services/publication.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  columns: Array<string>;
  keys: Array<string>;
  rows: {};
  swalOpts: Swal;
  headers: Array<string>;
  searchType: string;
  searchStr: string;
  searchService: any;
  //pagination
  page: {
    actual: number,
    total: number
  };

  constructor(private researchGroupService: ResearchGroupService,
    private userService: UserService,
    private eventService: EventService,
    private publicationService: PublicationService,
    private ngRedux: NgRedux<AppState>,
    private route: ActivatedRoute,
    private router: Router) { }


  ngOnInit() {
    this.searchStr = '';
    this.page = Object.assign({ actual: 1 });
    this.onSelect('researchGroup')
  }

  setUserKeys() {
    // this.columns = ['Nombre completo', 'Usuario', 'Perfil profesional', 'Teléfono', 'Oficina', 'URL CvLAC', 'Tipo'];
    // this.keys = ['full_name', 'username', 'professional_profile', 'phone', 'office', 'cvlac_link', 'user_type'];
    this.columns = ['Nombre completo', 'Usuario', 'Perfil profesional'];
    this.keys = ['full_name', 'username', 'professional_profile'];
  }

  setEventKeys() {
    // this.columns = ['Nombre', 'Tema', 'Descripción', 'Fecha', 'Lugar', 'Grupo de investigación'];
    // this.keys = ['name', 'topic', 'description', 'date', 'address', 'research_group_name'];
    this.columns = ['Nombre', 'Tema', 'Descripción'];
    this.keys = ['name', 'topic', 'description'];
  }

  setResearchGroupKeys() {
    // this.columns = ['Nombre', 'Descripción', 'Enfoque estratégico', 'Prioridades de investigación', 'Fecha de fundación', 'Clasificación', 'Fecha de clasificación', 'URL'];
    // this.keys = ['name', 'description', 'strategic_focus', 'research_priorities', 'foundation_date', 'classification', 'classification_date', 'url'];
    this.columns = ['Nombre', 'Descripción', 'Clasificación'];
    this.keys = ['name', 'description', 'classification'];
  }

  setPublicationKeys() {
    // this.columns = ['Nombre', 'Fecha', 'Abstract', 'Corta descripción', 'Tipo de Publicación', 'Fecha Creación'];
    // this.keys = ['name', 'date', 'abstract', 'brief_description', 'type_pub', 'created_at'];
    this.columns = ['Nombre', 'Abstract'];
    this.keys = ['name', 'abstract'];
  }

  redirect(id: number) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: { [this.searchType]: id } });
    switch (this.searchType) {
      case "user":
        this.router.navigateByUrl('/profile');
        break;
      case "researchGroup":
        this.router.navigateByUrl('/rg');
        break;
      case "publication":
        this.router.navigateByUrl('/publication');
        break;
      case "event":
        this.router.navigateByUrl('/event');
        break;
    }
  }

  onSelect(searchType: string) {
    this.page.actual = 1;
    this.searchType = searchType;
    this.searchService = this[searchType + 'Service'];
    this.onSearch();
    this['set' + this.searchType[0].toUpperCase() + this.searchType.substr(1) + 'Keys']();
  }
  
  onSearch() {
    this.searchService.searchByName(this.searchStr, this.page.actual).subscribe(
      (response: any) => {
        this.page.total = response.total_pages;
        const keys = Object.getOwnPropertyNames(response);
        this.rows = response[keys[0]];
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'No se ha podido realizar la búsqueda', text: error.message, type: 'error' };
      }
    );
  }

}
