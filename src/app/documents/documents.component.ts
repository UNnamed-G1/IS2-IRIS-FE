import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { select } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { ResponseContentType } from '@angular/http';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;
  @select(['session', 'type']) type;
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
    // This function should be moved and replaced
    /*
    return this.http.get(this.url, { responseType: ResponseContentType.Blob })
      .subscribe((res: Response) => {
        console.log(res)
        const blob = new Blob([res.blob], { type: 'application/pdf' });
        console.log(blob)
        const url = window.URL.createObjectURL(blob);
        console.log(url)
        window.open(url);
      });*/
  }

}
