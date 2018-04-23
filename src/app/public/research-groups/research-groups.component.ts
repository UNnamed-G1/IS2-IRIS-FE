import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

import { NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ADD_AUXILIAR } from 'app/redux/actions';

import { environment } from 'environments/environment';
import { ResearchGroup } from 'app/classes/_models';
import { ResearchGroupService } from 'app/services/research-group.service';

@Component({
  selector: 'app-research-groups',
  templateUrl: './research-groups.component.html',
  styleUrls: ['./research-groups.component.css']
})
export class ResearchGroupsComponent implements OnInit {
  @ViewChild('errSwal') private errSwal: SwalComponent;

  rows: Array<ResearchGroup>;
  news: Array<ResearchGroup>;
  items: Array<ResearchGroup>;
  item_active: ResearchGroup;
  page: {
    actual: number,
    total: number
  };

  constructor(private researchGroupService: ResearchGroupService,
    private route: ActivatedRoute, private router: Router, private ngRedux: NgRedux<AppState>) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.page = Object.assign({});
      this.page.actual = +params.page || 1;
      this.researchGroupService.getAll(this.page.actual).subscribe(
        (response: { research_groups: ResearchGroup[], total_pages: number }) => {
          response.research_groups.map(rg => {
            if (rg.photo) {
              Object.assign(rg, { photo: environment.api_url + rg.photo.picture['url'] });
            }
          });
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
    this.researchGroupService.getNews().subscribe(
      (response: { research_groups: ResearchGroup[] }) => {
        this.news = response.research_groups;
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
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: { researchGroup: id } });
    this.router.navigateByUrl('/rg');
  }
}
