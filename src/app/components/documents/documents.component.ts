import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { select } from '@angular-redux/store';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;
  @ViewChild('errSwal') private errSwal: SwalComponent;
  @select() isLogged;
  @Input() url: string;
  page = 1;
  totalPages: number;
  isLoaded = true;
  stickToPage = false;
  showAll = false;
  zoom = 1.0;
  originalSize = true;
  rotate = 0;

  constructor(protected http: HttpClient) { }

  ngOnInit() { }

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
    this.page++;
  }

  prevPage() {
    this.page--;
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
    this.page += num;
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
  downloadPdf() {
    // This function must be moved to service
    this.http.get(this.url, { responseType: 'blob' }).subscribe(
      (response: Blob) => {
        saveAs(response, 'file.pdf');
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'Publicación no localizada';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
  }

}
