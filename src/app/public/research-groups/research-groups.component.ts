import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  item_active: ResearchGroup;
  items: Array<ResearchGroup>;

  page: number;

  constructor(private researchGroupService: ResearchGroupService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      this.page = +params['page'] || 1;
      this.researchGroupService.getAll(this.page).subscribe((res: ResearchGroup[]) => {
        console.log(res);
        this.rows = res['research_groups'];
        console.log(this.rows);
      });
    });
    this.researchGroupService.getNews().subscribe((res: ResearchGroup[]) => {
      console.log(res['research_groups']);
      this.news = res['research_groups'];
      this.items = new Array<ResearchGroup>();
      this.item_active = this.news[0];
      for (var i = 1; i < this.news.length; ++i) {
        this.items[i - 1] = this.news[i];
      }
    });
  }

  nextPage() {
    this.router.navigate(['/research-groups'], { queryParams: { page: this.page + 1 } });
  }

  prevPage() {
    this.router.navigate(['/research-groups'], { queryParams: { page: this.page - 1 } });
  }

  goToPage(page: number) {
    this.router.navigate(['/research-groups'], { queryParams: { page: page } });
  }
}
