import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResearchGroup } from 'app/classes/research-group';
import { ResearchGroupService } from 'app/services/research-group.service';

@Component({
  selector: 'app-research-groups',
  templateUrl: './research-groups.component.html',
  styleUrls: ['./research-groups.component.css']
})
export class ResearchGroupsComponent implements OnInit {
  columns = ['id', 'name', 'description', 'strategic_focus', 'reasearch_priorities', 'foundation_date', 'classification', 'date_classification', 'url'];
  rows: Array<ResearchGroup>;
  news: Array<ResearchGroup>;

  constructor(private researchGroupService: ResearchGroupService,
    private router: Router) { }

  ngOnInit() {
    this.researchGroupService.get().subscribe((res: ResearchGroup[]) => {
      console.log(res['research_groups'])
      this.rows = res['research_groups'];
    });
    this.researchGroupService.get().subscribe((res: ResearchGroup[]) => {
      console.log(res['research_groups'])
      this.news = res['research_groups'];
    });
  };
}
