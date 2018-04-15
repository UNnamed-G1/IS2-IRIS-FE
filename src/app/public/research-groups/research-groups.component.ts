import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ResearchGroup } from 'app/classes/research-group';
import { ResearchGroupService } from 'app/services/research-group.service';

@Component({
  selector: 'app-research-groups',
  templateUrl: './research-groups.component.html',
  styleUrls: ['./research-groups.component.css']
})
export class ResearchGroupsComponent implements OnInit {
  @ViewChild('errLoadRGs') private errLoadRGs: SwalComponent;
  @ViewChild('errLoadNews') private errLoadNews: SwalComponent;

  columns = ['id', 'name', 'description', 'strategic_focus', 'reasearch_priorities',
    'foundation_date', 'classification', 'date_classification', 'url'];
  rows: Array<ResearchGroup>;
  news: Array<ResearchGroup>;
  item_active: ResearchGroup;
  items: Array<ResearchGroup>;

  page: {
    actual: number,
    total: number
  };

  constructor(private researchGroupService: ResearchGroupService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.page = Object.assign({});
      this.page.actual = +params.page || 1;
      this.researchGroupService.getAll(this.page.actual)
        .subscribe(
          (response: { research_groups: ResearchGroup[], total_pages: number }) => {
            this.rows = response.research_groups;
            this.page.total = response.total_pages;
          },
          (error: HttpErrorResponse) => {
            this.errLoadRGs.text += error.message;
            this.errLoadRGs.show();
          }
        );
    });
    this.researchGroupService.getNews()
      .subscribe(
        (res: { research_groups: ResearchGroup[] }) => {
          this.news = res.research_groups;
          this.items = new Array<ResearchGroup>();
          this.item_active = this.news[0];
          for (let i = 1; i < this.news.length; ++i) {
            this.items[i - 1] = this.news[i];
          }
        },
        (error: HttpErrorResponse) => {
          this.errLoadNews.text += error.message;
          this.errLoadNews.show();
        }
      );
  }
}
