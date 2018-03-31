import { Component, OnInit } from '@angular/core';
import { Research_groups } from '../research_groups';
import { ResearchGroupsService } from '../research-groups.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-research-group',
  templateUrl: './add-research-group.component.html',
  styleUrls: ['./add-research-group.component.css']
})
export class AddResearchGroupComponent implements OnInit {
  public research_group: Research_groups = new Research_groups();

  constructor(private research_groups_Service: ResearchGroupsService,
    private acRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.acRoute.params.subscribe((data: any) => {
      console.log(data.id);
      if (data && data.id) {
        this.research_groups_Service.get("research_group/" + data.id).subscribe((data: Research_groups) => {
          this.research_group = data;
        });
      } else {
        this.research_group = new Research_groups();
      }
    })
  }

  public onSubmit() {
    console.log("Adding a User: " + this.research_group.name);
    if (this.research_group.id) {
      this.research_groups_Service.update("research_groups/" + this.research_group.id, this.research_group).subscribe((r) => {
        console.log(r);
        alert("Research group updated !");
      })
    } else {
      this.research_groups_Service.post("users", this.research_group).subscribe((r) => {
        console.log(r);
        this.research_group = new Research_groups();
        alert("Research group added !");
      });
    }
  }
}
