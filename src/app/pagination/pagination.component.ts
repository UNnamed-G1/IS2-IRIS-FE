import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Input() page: {
    actual: number,
    total: number
  };

  actualRoute: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.actualRoute = this.router.url.split('?')[0];
  }

  ngAfterContentChecked() {
    if (this.page.actual > this.page.total) {
      this.router.navigate([this.actualRoute], { queryParams: { page: 1 } });
    }
  }

  getPages(): Array<number>[] {
    let a = Array.apply(null, { length: 5 })
      .map(Number.call, Number)
      .map(v => {
        v += this.page.actual - 2;
        if (v <= 0)
          v += 5;
        else if (v > this.page.total)
          v -= 5;
        return v;
      }).filter(v => v > 0 && v <= this.page.total).sort();
    return a
  }

  onPage(p: number): void {
    this.router.navigate([this.actualRoute], { queryParams: { page: p } });
  }

  onPrev(): void {
    this.router.navigate([this.actualRoute], { queryParams: { page: this.page.actual - 1 } });
  }

  onNext(): void {
    this.router.navigate([this.actualRoute], { queryParams: { page: this.page.actual + 1 } });
  }

}

// Thanks to http://www.bentedder.com/create-a-pagination-component-in-angular-4/
