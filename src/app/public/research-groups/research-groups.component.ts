import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ADD_AUXILIAR } from 'app/redux/actions';

import { environment } from 'environments/environment';
import { ResearchGroup } from 'app/classes/_models';
import { ResearchGroupService } from 'app/services/research-group.service';
import { Swal } from 'app/classes/swal';

@Component({
  selector: 'app-research-groups',
  templateUrl: './research-groups.component.html',
  styleUrls: ['./research-groups.component.css']
})
export class ResearchGroupsComponent implements OnInit {
  swalOpts: Swal;
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
      this.page = Object.assign({
        actual: +params.page || 1
      });
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
          this.swalOpts = { title: 'No se han podido obtener los grupos de investigación', text: error.message, type: 'error' };
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
        this.swalOpts = { title: 'No se han podido obtener las noticias', text: error.message, type: 'error' };
      }
    );
  }

  openRG(id: number) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: { researchGroup: id } });
    this.router.navigateByUrl('/rg');
  }
}
