import { Component, OnInit, OnDestroy, Output,EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { REMOVE_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';
import { ResearchGroup } from 'app/classes/research-group';
import { ResearchSubject } from 'app/classes/research-subject';
import { Publication } from 'app/classes/publication';
import { ResearchGroupService } from 'app/services/research-group.service';
import { ADD_AUXILIAR } from 'app/redux/actions';

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
  publications: Array<Publication>;
  PDF: boolean = false;

  @Output() onDetails = new EventEmitter<number>();
  showInput: boolean = false;

  constructor(private researchGroupService: ResearchGroupService,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>,
    private router: Router )  { }

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
            this.researchGroupService.getSubjects(this.researchGroup.id).subscribe((res: {research_subjects: ResearchSubject[]}) => {
              this.subjects = res.research_subjects;
            });
            this.researchGroupService.getPublications(this.researchGroup.id).subscribe((res: {publications: Publication[]}) => {
              this.publications = res.publications;
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

  pdfMode(){
    this.PDF = !this.PDF;
  }

  newUrl(id: number){
    return "http://localhost:3000/reports/rep_by_rg.pdf?id"+id;
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
  details(id: number) {
    this.onDetails.emit(id);
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: id });
    this.router.navigateByUrl('/profile');
  }
  update(id: string) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: id });
    this.router.navigateByUrl('/users/add');
  }


}
