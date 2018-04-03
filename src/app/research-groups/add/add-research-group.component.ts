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
  public researchGroup: ResearchGroup;

  constructor(private researchGroupService: ResearchGroupService,
    private acRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.acRoute.params.subscribe((data: any) => {
      console.log(data.id);
      if (data && data.id) {
        this.researchGroupService.get("research_groups/" + data.id).subscribe((data: ResearchGroup) => {
          this.researchGroup = data;
        });
      } else {
        this.researchGroup = new ResearchGroup();
      }
    })
  }

  public onSubmit() {
    console.log("Adding a User: " + this.researchGroup.name);
    if (this.researchGroup.id) {
      this.researchGroupService.update("research_groups/" + this.researchGroup.id, this.researchGroup).subscribe((r) => {
        console.log(r);
        alert("Research group updated !");
      })
    } else {
      this.researchGroupService.post("research_groups", this.researchGroup).subscribe((r) => {
        console.log(r);
        this.researchGroup = new ResearchGroup();
        alert("Research group added !");
      });
    }
  }
}
