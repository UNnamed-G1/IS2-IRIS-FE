import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  researchGroup: ResearchGroup = new ResearchGroup();
  rgForm: FormGroup;
  classifications: string[] = ['A', 'B', 'C', 'D'];

  constructor(private permMan: PermissionManager,
    private researchGroupService: ResearchGroupService,
    private ngRedux: NgRedux<AppState>,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.permMan.validateSession(["admin"]);
  }

  ngAfterContentInit() {
    this.auxiliarID.subscribe(id => {
      if (id) {
        this.researchGroupService.get(id)
          .subscribe((researchGroup: { research_group: ResearchGroup }) => {
            this.researchGroup = researchGroup.research_group;
            this.createRGForm();
          }, error => { }
          );
      }
    });
    this.createRGForm();
  }

  ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR })
  }

  onSubmit() {
    if (this.rgForm.pristine) {
      return;
    }
    const rg = new ResearchGroup();
    for (const k in this.rgForm.controls) {
      if (this.rgForm.get(k).dirty) {
        rg[k] = this.rgForm.get(k).value;
      }
    }
    if (this.researchGroup.id) {
      this.researchGroupService.update(this.researchGroup.id, rg)
        .subscribe(
          (response: { research_group: ResearchGroup }) => {
            Object.assign(this.researchGroup, response.research_group);
            this.createRGForm();
          },
          error => { }
        );
    } else {
      this.researchGroupService.create(rg)
        .subscribe(r => {
          this.rgForm.reset();
        }, error => { }
        );
    }
  }

  private createRGForm() {
    this.rgForm = this.formBuilder.group({
      name: [this.researchGroup.name, [Validators.required, Validators.maxLength(100)]],
      description: [this.researchGroup.description, [Validators.required, Validators.maxLength(1000)]],
      strategic_focus: [this.researchGroup.strategic_focus, [Validators.required, Validators.maxLength(1000)]],
      research_priorities: [this.researchGroup.research_priorities, [Validators.required, Validators.maxLength(1000)]],
      foundation_date: [this.researchGroup.foundation_date, [Validators.required]],
      classification: [this.researchGroup.classification],
      date_classification: [this.researchGroup.date_classification, [Validators.required]],
      url: [this.researchGroup.url]
    });
  }

  get name() { return this.rgForm.get('name'); }
  get description() { return this.rgForm.get('description'); }
  get strategic_focus() { return this.rgForm.get('strategic_focus'); }
  get research_priorities() { return this.rgForm.get('research_priorities'); }
  get foundation_date() { return this.rgForm.get('foundation_date'); }
  get classification() { return this.rgForm.get('classification'); }
  get date_classification() { return this.rgForm.get('date_classification'); }
  get url() { return this.rgForm.get('url'); }
}
