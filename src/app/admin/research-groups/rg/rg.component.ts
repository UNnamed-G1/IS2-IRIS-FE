import { Component, OnInit } from '@angular/core';
import { select } from '@angular-redux/store';
import { PermissionManager } from '../../../permission-manager';
import { ResearchGroupService } from '../../../services/research-group.service';
import { ResearchGroup} from '../../../classes/research-group';

@Component({
  selector: 'app-rg',
  templateUrl: './rg.component.html',
  styleUrls: ['./rg.component.css']
})

export class RgComponent implements OnInit {
  @select() auxiliarID;
  researchGroup:ResearchGroup;
  showInput: boolean = false;

  constructor(private researchGroupService: ResearchGroupService,
    private permMan: PermissionManager) { }

  ngOnInit() { }

  ngAfterContentInit() {


    this.auxiliarID.subscribe(id => {
      let getResearchGroup;
      if (id) {
        this.setResearchGroup(this.researchGroupService.get(id));
        console.log(id)
      } else if (this.permMan.validateLogged()) {
        this.researchGroupService.getCurrentGroup().subscribe((response: { research_group: ResearchGroup }) => {
          this.setResearchGroup(this.researchGroupService.get(response.research_group.id));

        });
      }
    });

  }

  updateGroup() {
    this.researchGroupService.update(this.researchGroup.id, { research_groups: this.researchGroup }).subscribe(
      response => console.log(response),
      error => console.error(error)
    );
    this.toggleShowInput();
  }

  toggleShowInput() {
    this.showInput = !this.showInput
  }

  setResearchGroup(researchGroup) {
    researchGroup.subscribe((response: { researchGroup: ResearchGroup }) => {
      this.researchGroup = Object.assign(new ResearchGroup(), response.researchGroup);
      console.log(this.researchGroup);
      });
  }


}
