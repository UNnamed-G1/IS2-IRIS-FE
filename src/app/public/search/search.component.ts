import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ADD_AUXILIAR } from 'app/redux/actions';
import { environment } from 'environments/environment';
import { PermissionManager } from 'app/permission-manager';
import { ResearchGroupService } from 'app/services/research-group.service';
import { ResearchGroup } from 'app/classes/_models';
import { UserService } from 'app/services/user.service';
import { User } from 'app/classes/_models';
import { EventService } from 'app/services/event.service';
import { Event } from 'app/classes/_models';
import { PublicationService } from 'app/services/publication.service';
import { Publication } from 'app/classes/_models';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, AfterContentInit {
  headers: Array<string>;
  keys: Array<string>;
  search:any;
  researchGroups: Array<ResearchGroup>;
  users: Array<User>;
  events: Array<Event>;
  publications: Array<Publication>;
  swalOpts: any;
  page: {
    actual: number,
    total: number
  };
  constructor(  private researchGroupService: ResearchGroupService,
    private userService: UserService,
    private eventService: EventService,
    private publicationService: PublicationService,
    private ngRedux: NgRedux<AppState>,
    private route: ActivatedRoute,
    private router: Router) { }


  ngOnInit() {

   }
  ngAfterContentInit() {
    this.route.queryParams.subscribe(params => {
      this.page = Object.assign({
        actual: +params.page || 1
      });
      //this.getResearchGroups();

    });
  }
  getUsers(){
    this.search=this.users;
    this.headers=['Nombre completo', 'Usuario', 'Perfil profesional', 'Teléfono', 'Oficina', 'URL CvLAC', 'Tipo'];
    this.keys= ['full_name', 'username', 'professional_profile', 'phone', 'office', 'cvlac_link', 'user_type'];
    this.userService.getAll(this.page.actual).subscribe(
      (response: { users: User[], total_pages: number }) => {
        this.users = response.users.map(u => Object.assign(u, { full_name: u.name + ' ' + u.lastname }));
        this.page.total = response.total_pages;
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'No se han podido obtener los usuarios', text: error.message, type: 'error' };

      }
    );
  }
  getResearchGroups() {
    this.search = this.researchGroups;
    this.headers= ['Nombre', 'Descripción', 'Enfoque estratégico', 'Prioridades de investigación', 'Fecha de fundación', 'Clasificación',  'Fecha de clasificación', 'URL'];
    this.keys=  ['name', 'description', 'strategic_focus', 'research_priorities', 'foundation_date', 'classification', 'date_classification', 'url'];
    this.researchGroupService.getAll(this.page.actual).subscribe(
      (response: { research_groups: ResearchGroup[], total_pages: number }) => {
        this.researchGroups = response.research_groups;
        this.page.total = response.total_pages;
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'No se han podido obtener los grupos de investigación', text: error.message, type: 'error' };

      }
    );
  }
  getEvents() {
    this.search = this.events;
    this.headers= ['Nombre', 'Tema', 'Descripción', 'Fecha', 'Lugar', 'Grupo de investigación'];
    this.keys= ['name', 'topic', 'description', 'date', 'address', 'research_group_name'];
    this.eventService.getAll(this.page.actual).subscribe(
      (response: { events: Event[], total_pages: number }) => {
        this.events = response.events;
        this.events.map(ev => Object.assign(ev, { research_group_name: ev.research_group.name }));
        this.page.total = response.total_pages;
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'No se han podido obtener los eventos', text: error.message, type: 'error' };
      }
    );
  }
  getPublications(){
    this.search =this.publications;
    this.headers= ['Nombre', 'Fecha', 'Abstract', 'Corta descripción', 'Tipo de Publicación', 'Fecha Creación'];
    this.keys = ['name', 'date', 'abstract', 'brief_description', 'type_pub', 'created_at'];
    this.publicationService.getAll(this.page.actual).subscribe(
      (response: { publications: Publication[], total_pages: number }) => {
        this.publications = response.publications;
        this.page.total = response.total_pages;
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'No se han podido obtener las publicaciones', text: error.message, type: 'error' };
      }
    );
  }

}
