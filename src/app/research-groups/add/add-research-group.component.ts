import { Component, OnInit } from '@angular/core';
import { ResearchGroup } from '../research-group';
import { ResearchGroupService } from '../research-groups.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-research-group',
  templateUrl: './add-research-group.component.html',
  styleUrls: ['./add-research-group.component.css']
})
export class AddResearchGroupComponent implements OnInit {
  public research_group: ResearchGroup = new ResearchGroup();

  constructor(private research_groups_Service: ResearchGroupService,
    private acRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.acRoute.params.subscribe((data: any) => {
      console.log(data.id);
      if (data && data.id) {
        this.research_groups_Service.getResearchGroup(data.id).subscribe((data: ResearchGroup) => {
          this.research_group = data;
        });
      } else {
        this.research_group = new ResearchGroup();
      }
    })
  }

  public onSubmit() {
    console.log("Adding a User: " + this.research_group.name);
    if (this.research_group.id) {
      this.research_groups_Service.update(this.research_group.id, this.research_group).subscribe((r) => {
        console.log(r);
        alert("Research group updated !");
      })
    } else {
      this.research_groups_Service.createResearchGroup(this.research_group).subscribe((r) => {
        console.log(r);
        this.research_group = new ResearchGroup();
        alert("Research group added !");
      });
    }
  }
}
