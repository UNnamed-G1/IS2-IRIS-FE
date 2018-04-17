import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ADD_AUXILIAR } from 'app/redux/actions';
import { ResearchGroup } from 'app/classes/research-group';
import { ResearchGroupService } from 'app/services/research-group.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-research-groups',
  templateUrl: './research-groups.component.html',
  styleUrls: ['./research-groups.component.css']
})
export class ResearchGroupsComponent implements OnInit {
  columns = ['id', 'name', 'description', 'strategic_focus', 'reasearch_priorities', 'foundation_date', 'classification', 'date_classification', 'url', 'photo'];
  rows: Array<ResearchGroup>;
  news: Array<ResearchGroup>;
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
      this.page = Object.assign({})
      this.page.actual = +params.page || 1;
      this.researchGroupService.getAll(this.page.actual)
        .subscribe((res: { research_groups: ResearchGroup[], total_pages: number }) => {
          this.rows = res.research_groups;
          this.page.total = res.total_pages;
        });
    });
    this.researchGroupService.getNews().subscribe((res: {research_groups: ResearchGroup[]}) => {
      this.news = res.research_groups;
    });
  }

  openRG(id: number) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: id });
    this.router.navigateByUrl('/rg');
  }
}
