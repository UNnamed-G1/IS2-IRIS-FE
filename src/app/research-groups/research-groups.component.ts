import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResearchGroup } from './research-group';
import { ResearchGroupService } from './research-groups.service';

@Component({
  selector: 'app-research-groups',
  templateUrl: './research-groups.component.html',
  styleUrls: ['./research-groups.component.css']
})
export class ResearchGroupsComponent implements OnInit {
	  columns = ['id', 'name', 'description', 'strategic_focus', 'reasearch_priorities', 'foundation_date', 'classification', 'date_classification', 'url'];
  	rows : Array<ResearchGroup>;
    news : Array<ResearchGroup>;

  	constructor(private researchGrousService: ResearchGroupService ,private  router : Router) {}

  	ngOnInit() {
    	this.researchGrousService.getResearchGroups().subscribe((res : ResearchGroup[]) => {
      		console.log(res['research_groups'])
      		this.rows = res['research_groups'];
    	});
      this.researchGrousService.getResearchGroupsNews().subscribe((res : ResearchGroup[]) => {
          console.log(res['research_groups'])
          this.news = res['research_groups'];
      });
  	};

    public delete(id: string) {
      console.log("delete : " + id);
      var path = 'users/' + id;
    }

    public update(id: string) {
      console.log("update : " + id);
      this.router.navigateByUrl('/users/add/' + id);
    }
}
