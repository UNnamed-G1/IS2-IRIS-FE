import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

import { NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ADD_AUXILIAR } from 'app/redux/actions';

import { environment } from 'environments/environment';
import { PermissionManager } from 'app/permission-manager';
import { PublicationService } from 'app/services/publication.service';
import { Publication } from 'app/classes/_models';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css']
})
export class PublicationComponent implements OnInit, AfterContentInit {
  @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;
  swalOpts: any;
  headers: Array<string> = ['Nombre', 'Fecha', 'Abstract',    'Corta descripción', 'Tipo de Publicación', 'Fecha Creación'];
  keys: Array<string> = ['name', 'date', 'abstract', 'brief_description', 'type_pub', 'created_at'];
  publications: Array<Publication>;
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
  page: {
    actual: number,
    total: number
  };

  constructor(private permMan: PermissionManager,
    private publicationService: PublicationService,
    private ngRedux: NgRedux<AppState>,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.permMan.validateSession(['Administrador']);
  }


  ngAfterContentInit() {
    this.route.queryParams.subscribe(params => {
      this.page = Object.assign({
        actual: +params.page || 1
      });
      this.getPublications();
    });
  }

  update(id: number) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: { publicationUpdate: id } });
    this.router.navigateByUrl('/publications/add');
  }

  details(id: number) {
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
  }

  delete(id: number) {
    this.publicationService.delete(id).subscribe(
      (response: { publication: Publication }) => {
        this.getPublications();
        this.swalOpts = { title: 'La publicación ha sido eliminado', type: 'success'};

      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'Publicación no eliminada', text: error.message, type: 'error' };

      }
    );
  }

  getPublication(id) {
    this.publicationService.get(id).subscribe(
      (response: { publication: Publication }) => {
        this.pub = response.publication;
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'No se han podido obtener la Publicación', text: error.message, type: 'error' };

      }
    );
  }

  getPublications() {
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
  search(stringToSearch: string) {
    this.pdfComponent.pdfFindController.executeCommand('find', {
      caseSensitive: false, findPrevious: undefined, highlightAll: true, phraseSearch: true, query: stringToSearch
    });
  }
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
