import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { REMOVE_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';
import { ResearchGroup } from 'app/classes/research-group';
import { ResearchGroupService } from 'app/services/research-group.service';

@Component({
  selector: 'app-add-research-group',
  templateUrl: './add-research-group.component.html',
  styleUrls: ['./add-research-group.component.css']
})


export class AddResearchGroupComponent implements OnInit, OnDestroy {
  @select() auxiliarID;
  researchGroup: ResearchGroup;

  constructor(private researchGroupService: ResearchGroupService,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>) {
  }
  ngOnInit() {
    this.researchGroup = new ResearchGroup();
    if (this.permMan.validateSession(["admin"])) {
      this.auxiliarID.subscribe(id => {
        if (id) {
          this.researchGroupService.get(id).subscribe((researchGroup: { researchGroup: ResearchGroup }) => {
            this.researchGroup = researchGroup.researchGroup;
          });
        }
      });
    }
  }
  ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR })
  }

  public onSubmit() {
    console.log("Adding a Group: " + this.researchGroup.name);
    if (this.researchGroup.id) {
      this.researchGroupService.update(this.researchGroup.id, this.researchGroup).subscribe((r) => {
        console.log(r);
        alert("Research group updated !");
      })
    } else {
      this.researchGroupService.create(this.researchGroup).subscribe((r) => {
        console.log(r);
        this.researchGroup = new ResearchGroup();
        alert("Research group added !");
      });
    }
  }
}
