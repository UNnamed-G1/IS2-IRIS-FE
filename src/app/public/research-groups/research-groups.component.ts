import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResearchGroup } from '../../classes/research-group';
import { ResearchGroupService } from '../../services/research-group.service';

@Component({
  selector: 'app-research-groups',
  templateUrl: './research-groups.component.html',
  styleUrls: ['./research-groups.component.css']
})
export class ResearchGroupsComponent implements OnInit {
  columns = ['id', 'name', 'description', 'strategic_focus', 'reasearch_priorities', 'foundation_date', 'classification', 'date_classification', 'url'];
  rows: Array<ResearchGroup>;
  news: Array<ResearchGroup>;

  page: {
    actual: number,
    total: number
  };

  constructor(private researchGroupService: ResearchGroupService,
    private route: ActivatedRoute) { }

  ngOnInit() {
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

  details(id: number) {
    
  }
}
