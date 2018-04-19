import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ADD_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';
import { PublicationService } from 'app/services/publication.service';
import { Publication } from 'app/classes/publication';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css']
})
export class PublicationComponent implements OnInit, AfterContentInit {
  @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;
  @ViewChild('sucSwal') private sucSwal: SwalComponent;
  @ViewChild('errSwal') private errSwal: SwalComponent;
  PDFpage: number = 1;
  totalPages: number;
  isLoaded: boolean = true;
  stickToPage: boolean = false;
  showAll: boolean = false;
  zoom: number = 1.0;
  originalSize: boolean = true;
  rotate: number = 0;
  headers: Array<string> = ['Nombre', 'Fecha', 'Abstract',
    'Corta descripción', 'Tipo de Publicación', 'Fecha Creación'];
  keys: Array<string> = ['name', 'date', 'abstract', 'brief_description', 'type_pub', 'created_at'];
  publications: Array<Publication>;
  pub: Publication=new Publication();
  pdfLoaded=false;
  pdfSrc;
  pdfName;
  
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
    this.permMan.validateSession(['Admin']);
  }


  ngAfterContentInit() {
    this.route.queryParams.subscribe(params => {
      this.page = Object.assign({});
      this.page.actual = +params.page || 1;
      this.getPublications();
    });
  }

  update(id: number) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: id });
    this.router.navigateByUrl('/publications/add');
  }

  delete(id: number) {
    this.publicationService.delete(id)
      .subscribe(
        (response: { publication: Publication }) => {
          this.getPublications();
          this.sucSwal.title = 'La publicación ha sido eliminado';
          this.sucSwal.show();
        },
        (error: HttpErrorResponse) => {
          this.errSwal.title = 'Publicación no eliminada';
          this.errSwal.text = 'Mensaje de error: ' + error.message;
          this.errSwal.show();
        }
      );
  }

  getPublication(id) {
    this.publicationService.get(id)
    .subscribe(
      (res:{publication:Publication}) =>{
        this.pub= res.publication;

    },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'No se ha podido obtener la Publicación';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
  }
  details(id: number) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: id });
    this.publicationService.get(id)
    .subscribe(
      (res:{publication:Publication}) =>{
        this.pub= res.publication;
        this.pdfSrc = 'http://localhost:3000' + this.pub.document;
        this.pdfName = this.pub.name + ".pdf";
        this.pdfLoaded=!this.pdfLoaded;
        console.log(this.pdfSrc);
    },
        (error: HttpErrorResponse) => {
        this.errSwal.title = 'No se han podido obtener la Publicación';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
  }

  getPublications() {
    this.publicationService.getAll(this.page.actual)
      .subscribe(
        (response: { publications: Publication[], total_pages: number }) => {
          this.publications = response.publications;
          this.page.total = response.total_pages;
        },
        (error: HttpErrorResponse) => {
          this.errSwal.title = 'No se han podido obtener las publicaciones';
          this.errSwal.text = 'Mensaje de error: ' + error.message;
          this.errSwal.show();
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
  onAfterLoad(event: any){
  }

  switchSticky(){
    this.stickToPage = !this.stickToPage;
  }

  switchShowAll(){

    this.showAll = !this.showAll;
  }

  setPage(num: number){
    this.PDFpage += num;
  }
  incrementZoom(amount: number) {
    this.zoom += amount;
  }
  originalZoom() {
    this.zoom = 1.0;
  }
  rotatePdf(){
    this.rotate += 90;
  }

}
