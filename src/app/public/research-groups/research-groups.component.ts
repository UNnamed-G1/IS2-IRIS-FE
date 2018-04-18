import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { ResearchGroup } from 'app/classes/research-group';
import { ResearchGroupService } from 'app/services/research-group.service';
import { environment } from 'environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ADD_AUXILIAR } from 'app/redux/actions';

@Component({
  selector: 'app-research-groups',
  templateUrl: './research-groups.component.html',
  styleUrls: ['./research-groups.component.css']
})
export class ResearchGroupsComponent implements OnInit {
  @ViewChild('errSwal') private errSwal: SwalComponent;

  columns = ['id', 'name', 'description', 'strategic_focus', 'reasearch_priorities',
    'foundation_date', 'classification', 'date_classification', 'url'];
  rows: Array<ResearchGroup>;
  news: Array<ResearchGroup>;
  items: Array<ResearchGroup>;
  item_active: ResearchGroup;
  url: string;
  page: {
    actual: number,
    total: number
  };

  constructor(private researchGroupService: ResearchGroupService,
    private route: ActivatedRoute, private router: Router, private ngRedux: NgRedux<AppState>) {
  }

  ngOnInit() {
    this.url = environment.api_url;
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
            this.errSwal.title = 'No se ha podido obtener los grupos de investigación';
            this.errSwal.text = 'Mensaje de error: ' + error.message;
            this.errSwal.show();
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
          this.errSwal.title = 'No se han podido obtener las noticias';
          this.errSwal.text = 'Mensaje de error: ' + error.message;
          this.errSwal.show();
        }
      );
  }

  openRG(id: number) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: id });
    this.router.navigateByUrl('/rg');
  }
}
