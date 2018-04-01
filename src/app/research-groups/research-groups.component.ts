import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResearchGroup } from './research-groups';
import { ResearchGroupService } from './research-groups.service';

@Component({
  selector: 'app-research-groups',
  templateUrl: './research-groups.component.html',
  styleUrls: ['./research-groups.component.css']
})
export class ResearchGroupsComponent implements OnInit {
	  columns = ['id','name','description','updated_at'];
  	rows : Array<ResearchGroup>;
    news : Array<ResearchGroup>;

  	constructor(private researchGrousService: ResearchGroupService ,private  router : Router) {}

  	ngOnInit() {
    	this.researchGrousService.get("research_groups").subscribe((res : ResearchGroup[]) => {
      		console.log(res['research_groups'])
      		this.rows = res['research_groups'];
    	});
      this.researchGrousService.get("research_groups_news").subscribe((res : ResearchGroup[]) => {
          console.log(res['research_groups'])
          this.news = res['research_groups'];
      });
  	};
}
