import { Component, OnInit } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';


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

  constructor() { }

  ngOnInit() {
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
}
