import { Component, OnInit, ViewChild } from '@angular/core';
import { PdfViewerComponent } from 'ng2-pdf-viewer';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  page: number = 1;
  totalPages: number;
  isLoaded: boolean = false;
  stickToPage: boolean = false;
  showAll: boolean = false;
  zoom: number = 1.0;
  originalSize: boolean = true;
  rotate: number = 0;
  pdfSrc;
  constructor() { }

  ngOnInit() {
  }

  @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;
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
  onAfterLoad(event: any){
  }

  switchSticky(){
    this.stickToPage = !this.stickToPage;
  }

  switchShowAll(){

    this.showAll = !this.showAll;
  }

  setPage(num: number){
    this.page += num;
    console.log(this.page);
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
