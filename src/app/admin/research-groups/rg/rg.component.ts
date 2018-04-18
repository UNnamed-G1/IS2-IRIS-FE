import { Component, ViewChild, OnInit, AfterContentInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { select, NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { REMOVE_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';

import { ActivatedRoute, Router } from '@angular/router';
import { ResearchGroup } from 'app/classes/research-group';
import { ResearchGroupService } from 'app/services/research-group.service';
import { ADD_AUXILIAR } from 'app/redux/actions';

@Component({
  selector: 'app-rg',
  templateUrl: './rg.component.html',
  styleUrls: ['./rg.component.css']
})

export class RgComponent implements OnInit {
  @select() auxiliarID;
  @ViewChild('sucSwal') private sucSwal: SwalComponent;
  @ViewChild('errSwal') private errSwal: SwalComponent;

  @Output() onDetails = new EventEmitter<number>();
  researchGroup:ResearchGroup;
  showInput: boolean = false;
  rgForm: FormGroup;

  constructor(private researchGroupService: ResearchGroupService,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>,
    private router: Router,
    private formBuilder: FormBuilder )  { }

  ngOnInit() { }

  ngAfterContentInit() {
    this.auxiliarID.subscribe(id => {
      if (id) {
        this.researchGroupService.get(id)
          .subscribe((researchGroup: { research_group: ResearchGroup }) => {
            this.researchGroup = researchGroup.research_group;
          },
          (error: HttpErrorResponse) => {
            this.errSwal.title = 'No se ha podido obtener el grupo de investigación';
            this.errSwal.text = 'Mensaje de error: ' + error.message;
            this.errSwal.show();
          }
          );
      }
    });
  }

  ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR })
  }

  updateGroup() {
    if (this.rgForm.pristine) {
      return;
    }
    const rg = new ResearchGroup();
    for (const k in this.rgForm.controls) {
      if (this.rgForm.get(k).dirty) {
        rg[k] = this.rgForm.get(k).value;
      }
    }


    this.researchGroupService.update(this.researchGroup.id, { research_group: rg }).subscribe(
      (response: { researchGroup: ResearchGroup }) => {
        this.sucSwal.title = 'El grupo ha sido actualizado';
        this.sucSwal.show();
        this.toggleShowInput();
        Object.assign(this.researchGroup, response.researchGroup);
        this.createRGForm();
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'El grupo no ha podido ser actualizado';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
  }
  setRG(researchGroup) {
    researchGroup.subscribe(
      (response: { researchGroup: ResearchGroup }) => {
        this.researchGroup = Object.assign(new ResearchGroup(), response.researchGroup);
        this.createRGForm();
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'No se ha podido obtener el grupo';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
  }


  toggleShowInput() {
    this.showInput = !this.showInput
  }

  onSubmit() {
    console.log("Adding a Group: " + this.researchGroup.name);
    if (this.researchGroup.id) {
      this.researchGroupService.update(this.researchGroup.id, this.researchGroup)
        .subscribe(res => alert("Research group updated !"),
          error => { this.errSwal.title = 'No se ha podido obtener el perfil';
          this.errSwal.text = 'Mensaje de error: ' + error.message;
          this.errSwal.show();}
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
    this.router.navigateByUrl('/researchGroups/add');
  }


  private createRGForm() {
    this.rgForm = this.formBuilder.group({
      name: [this.researchGroup.name,
        [Validators.required, Validators.pattern('[a-zA-Z ]*'),
        Validators.minLength(3), Validators.maxLength(100)]],
      description: [this.researchGroup.description,
      [Validators.required, Validators.maxLength(5000)]],
      strategic_focus: [this.researchGroup.strategic_focus,
      [Validators.required, Validators.maxLength(1000)]],
      research_priorities: [this.researchGroup.research_priorities,
      [Validators.required, Validators.maxLength(5000)]],
      foundation_date: [this.researchGroup.foundation_date, [Validators.required]],
      classification: [this.researchGroup.classification, [Validators.required]],
      date_classification: [this.researchGroup.date_classification, [Validators.required]],
      url: [this.researchGroup.url, [Validators.required]],

    })
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
