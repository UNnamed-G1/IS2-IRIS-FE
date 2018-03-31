import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResearchGroupsService } from '../research-groups.service';
import { Research_groups } from '../research_groups';
@Component({
  selector: 'app-research-groups',
  templateUrl: './research-groups.component.html',
  styleUrls: ['./research-groups.component.css']
})
export class ResearchGroupsComponent implements OnInit {
  columns = ['id','name','description','strategic_focus','reasearch_priorities','foundation_date','classification','date_classification','url'];
  rows : Array<Research_groups>;
  constructor(private researchGroupsService: ResearchGroupsService ,private  router : Router) {
      }
      ngOnInit() {
        this.researchGroupsService.get("research_groups").subscribe((res : Research_groups[]) => {
          console.log(res['research_groups'])
          this.rows = res['research_groups'];
        });
      };

  public delete(id:string){

      console.log("delete : " + id);
      var path = 'users/' + id;
      }


  public update(id:string){
    console.log("update : " + id );
    this.router.navigateByUrl('/users/add/' + id);
  }
}
