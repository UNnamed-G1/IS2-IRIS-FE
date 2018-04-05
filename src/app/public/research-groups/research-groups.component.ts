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
  item_active : ResearchGroup;
  items : Array<ResearchGroup>;

  constructor(private researchGroupService: ResearchGroupService, private router: Router) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.researchGroupService.get().subscribe((res: ResearchGroup[]) => {
      console.log(res['research_groups']);
      this.rows = res['research_groups'];
    });
    this.researchGroupService.getNews().subscribe((res: ResearchGroup[]) => {
      console.log(res['research_groups']);
      this.news = res['research_groups'];
      this.item_active = this.news[0];
      for (var i = 1; i < this.news.length; ++i) {
        this.items[i-1] = this.news[i];
      }
    });
  }
}
