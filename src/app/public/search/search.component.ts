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
import { PdfViewerComponent } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, AfterContentInit {
  @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;
  @Input() columns: Array<string>;
  @Input() keys = new Array<string>();
  @Input() rows: {};
  swalOpts: Swal;
  headers: Array<string>;
  search: any;
  details: string;
  researchGroups: Array<ResearchGroup>;
  users: Array<User>;
  events: Array<Event>;
  publications: Array<Publication>;
  searchStr: string;
  //for pdf publications
  pub: Publication = new Publication();
  pdfLoaded = false;
  pdfSrc;
  pdfName;
  PDFpage = 1;
  totalPages: number;
  isLoaded = true;
  stickToPage = false;
  showAll = false;
  zoom = 1.0;
  originalSize = true;
  rotate = 0;
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

  }
  ngAfterContentInit() {
    this.route.queryParams.subscribe(params => {
      this.page = Object.assign({
        actual: +params.page || 1
      });

    });
  }
  getUsers() {
    this.details = "users";
    this.search = this.users;
    this.columns = ['Nombre completo', 'Usuario', 'Perfil profesional', 'Teléfono', 'Oficina', 'URL CvLAC', 'Tipo'];
    this.keys = ['full_name', 'username', 'professional_profile', 'phone', 'office', 'cvlac_link', 'user_type'];
    this.userService.searchUsersByName(this.searchStr, this.page.actual).subscribe(
      (response: { users: User[], total_pages: number }) => {
        this.rows = response.users.map(u => Object.assign(u, { full_name: u.name + ' ' + u.lastname }));
        this.page.total = response.total_pages;
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'No se han podido obtener los usuarios', text: error.message, type: 'error' };
      }
    );
  }

  getEvents() {
    this.details = "events";
    this.search = this.events;
    this.columns = ['Nombre', 'Tema', 'Descripción', 'Fecha', 'Lugar', 'Grupo de investigación'];
    this.keys = ['name', 'topic', 'description', 'date', 'address', 'research_group_name'];
    this.eventService.searchEventByName(this.searchStr, this.page.actual).subscribe(
      (response: { events: Event[], total_pages: number }) => {
        this.rows = response.events;
        //this.rows = response.events.map(ev => Object.assign(ev, { research_group_name: ev.research_group.name }));
        this.page.total = response.total_pages;
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'No se han podido obtener los eventos', text: error.message, type: 'error' };
      }
    );

  }
  getResearchGroups() {
    this.details = "researchGroups";
    this.search = this.researchGroups;
    this.columns = ['Nombre', 'Descripción', 'Enfoque estratégico', 'Prioridades de investigación', 'Fecha de fundación', 'Clasificación', 'Fecha de clasificación', 'URL'];
    this.keys = ['name', 'description', 'strategic_focus', 'research_priorities', 'foundation_date', 'classification', 'date_classification', 'url'];
    this.researchGroupService.searchRGByName(this.searchStr, this.page.actual).subscribe(
      (response: { research_groups: ResearchGroup[], total_pages: number }) => {
        this.rows = response.research_groups;
        this.page.total = response.total_pages;
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'No se han podido obtener los grupos de investigación', text: error.message, type: 'error' };

      }
    );
  }
  getPublications() {
    this.details = "publications";
    this.search = this.publications;
    this.columns = ['Nombre', 'Fecha', 'Abstract', 'Corta descripción', 'Tipo de Publicación', 'Fecha Creación'];
    this.keys = ['name', 'date', 'abstract', 'brief_description', 'type_pub', 'created_at'];
    this.publicationService.getAll(this.page.actual).subscribe(
      (response: { publications: Publication[], total_pages: number }) => {
        this.rows = response.publications;
        this.page.total = response.total_pages;
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'No se han podido obtener las publicaciones', text: error.message, type: 'error' };
      }
    );
  }

  redirect(id: number) {
    var grade: string = this.details;
    switch (grade) {
      case "publications": {
        this.publicationService.get(id).subscribe(
          (response: { publication: Publication }) => {
            this.pub = response.publication;
            this.pdfSrc = environment.api_url + this.pub.document;
            this.pdfName = this.pub.name + '.pdf';
            this.pdfLoaded = !this.pdfLoaded;
          },
          (error: HttpErrorResponse) => {
            this.swalOpts = { title: 'No se han podido obtener la Publicación', text: error.message, type: 'error' };
          }
        );
        console.log("publications selected");
        break;
      }
      case "users": {
        this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: { user: id } });
        this.router.navigateByUrl('/profile');
        console.log("users selected");
        break;
      }
      case "events": {
        this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: { event: id } });
        this.router.navigateByUrl('/event');
        console.log("events selected");
        console.log(id);
        break;
      }
      case "researchGroups": {
        this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: { researchGroup: id } });
        this.router.navigateByUrl('/rg');
        console.log("researchGroups selected");
        break;
      }
      default: {
        console.log("Invalid choice");
        break;
      }
    }
  }
  //pdf options

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  nextPage() {
    this.PDFpage++;
  }

  prevPage() {
    this.PDFpage--;
  }
  onAfterLoad(event: any) {
  }

  switchSticky() {
    this.stickToPage = !this.stickToPage;
  }

  switchShowAll() {
    this.showAll = !this.showAll;
  }

  setPage(num: number) {
    this.PDFpage += num;
  }
  incrementZoom(amount: number) {
    this.zoom += amount;
  }
  originalZoom() {
    this.zoom = 1.0;
  }
  rotatePdf() {
    this.rotate += 90;
  }
  showPub() {
    this.pdfLoaded = !this.pdfLoaded;
  }

}
