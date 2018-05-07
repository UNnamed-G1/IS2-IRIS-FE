import { Component, Input, Output, EventEmitter, OnInit, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, AfterContentInit {
  @Input() page: {
    actual: number,
    total: number
  };
  @Input() routing: boolean;
  @Output() changePage = new EventEmitter<number>();

  actualRoute: string;

  constructor(private router: Router) { }

  ngOnInit() {
    if (this.routing === undefined) {
      this.routing = true;
    }
    this.actualRoute = this.router.url.split('?')[0];
  }

  ngAfterContentInit() {
    if (this.page.actual > this.page.total) {
      this.router.navigate([this.actualRoute], { queryParams: { page: 1 } });
    }
  }

  getPages(): Array<number>[] {
    return Array.apply(null, { length: 5 })
      .map(Number.call, Number)
      .map(v => {
        v += this.page.actual - 2;
        if (v <= 0) {
          v += 5;
        } else if (v > this.page.total) {
          v -= 5;
        }
        return v;
      })
      .filter(v => v > 0 && v <= this.page.total)
      .sort((a, b) => a - b);
  }

  onPage(p: number): void {
    if (this.routing) {
      this.router.navigate([this.actualRoute], { queryParams: { page: p } });
    } else {
      this.page.actual = p;
      this.changePage.emit(this.page.actual);
    }
  }

  onPrev(): void {
    if (this.routing) {
      this.router.navigate([this.actualRoute], { queryParams: { page: this.page.actual - 1 } });
    } else {
      this.page.actual--;
      this.changePage.emit(this.page.actual);
    }
  }

  onNext(): void {
    if (this.routing) {
      this.router.navigate([this.actualRoute], { queryParams: { page: this.page.actual + 1 } });
    } else {
      this.page.actual++;
      this.changePage.emit(this.page.actual);
    }
  }

}

// Thanks to http://www.bentedder.com/create-a-pagination-component-in-angular-4/
