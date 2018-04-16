import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import { AppState } from '../../../redux/store';
import { REMOVE_AUXILIAR } from '../../../redux/actions';
import { PermissionManager } from '../../../permission-manager';
import { ResearchGroup } from '../../../classes/research-group';
import { ResearchSubject } from '../../../classes/research-subject';
import { ResearchGroupService } from '../../../services/research-group.service';

@Component({
  selector: 'app-rg',
  templateUrl: './rg.component.html',
  styleUrls: ['./rg.component.css']
})

export class RgComponent implements OnInit {
  @select() auxiliarID;
  researchGroup: ResearchGroup;
  events: Array<Event>;
  subjects: Array<ResearchSubject>;
  showInput: boolean = false;

  constructor(private researchGroupService: ResearchGroupService,
    private permMan: PermissionManager,  private ngRedux: NgRedux<AppState>) { }

  ngOnInit() { }

  ngAfterContentInit() {
    this.auxiliarID.subscribe(id => {
      if (id) {
        this.researchGroupService.get(id)
          .subscribe((researchGroup: { research_group: ResearchGroup }) => {
            this.researchGroup = researchGroup.research_group;
            this.researchGroupService.getEvents(this.researchGroup.id).subscribe((res: {events: Event[]}) => {
              this.events = res.events;
            });
            this.researchGroupService.getSubjects(this.researchGroup.id).subscribe((res: {subjects: ResearchSubject[]}) => {
              this.subjects = res.subjects;
            });
          }, error => { }
          );
      }
    });
  }

  ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR })
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



  onSubmit() {
    console.log("Adding a Group: " + this.researchGroup.name);
    if (this.researchGroup.id) {
      this.researchGroupService.update(this.researchGroup.id, this.researchGroup)
        .subscribe(res => alert("Research group updated !"),
          error => { }
        );
    } else {
      console.log("something is going wrong")}
  }

}
