import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { NgRedux, select } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { REMOVE_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';
import { ResearchGroup } from 'app/classes/_models';
import { ResearchGroupService } from 'app/services/research-group.service';

@Component({
  selector: 'app-add-research-group',
  templateUrl: './add-research-group.component.html',
  styleUrls: ['./add-research-group.component.css']
})

export class AddResearchGroupComponent implements OnInit {
  @ViewChild('sucSwal') private sucSwal: SwalComponent;
  @ViewChild('errSwal') private errSwal: SwalComponent;

  @select(['auxiliarID', 'researchGroupUpdate']) researchGroupID;

  researchGroup: ResearchGroup = new ResearchGroup();
  rgForm: FormGroup;
  classifications: string[] = ['A', 'B', 'C', 'D'];
  minDate = new Date(1900, 0);  // 1900/01/01
  maxDate = new Date();         // Actual date

  constructor(private permMan: PermissionManager,
    private researchGroupService: ResearchGroupService,
    private ngRedux: NgRedux<AppState>,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    if (this.permMan.validateSession(['Administrador'])) {
      this.researchGroupID.subscribe((id: number) => {
        if (id) {
          this.researchGroupService.get(id).subscribe(
            (researchGroup: { research_group: ResearchGroup }) => {
              this.researchGroup = researchGroup.research_group;
              this.createRGForm();
            },
            (error: HttpErrorResponse) => {
              this.errSwal.title = 'No se ha podido obtener el grupo de investigación';
              this.errSwal.text = 'Mensaje de error: ' + error.message;
              this.errSwal.show();
            }
          );
        }
      });
      this.createRGForm();
    }
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
      this.researchGroupService.update(this.researchGroup.id, rg).subscribe(
        (response: { research_group: ResearchGroup }) => {
          Object.assign(this.researchGroup, response.research_group);
          this.sucSwal.title = 'El grupo de investigación ha sido actualizado';
          this.sucSwal.show();
          this.createRGForm();
        },
        (error: HttpErrorResponse) => {
          this.errSwal.title = 'Grupo de investigación no actualizado';
          this.errSwal.text = 'Mensaje de error: ' + error.message;
          this.errSwal.show();
        }
      );
    } else {
      this.researchGroupService.create(rg).subscribe(
        (response: { research_group: ResearchGroup }) => {
          this.sucSwal.title = 'El grupo de investigación ha sido añadido';
          this.sucSwal.show();
          this.rgForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.errSwal.title = 'Grupo de investigación no añadido';
          this.errSwal.text = 'Mensaje de error: ' + error.message;
          this.errSwal.show();
        }
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
