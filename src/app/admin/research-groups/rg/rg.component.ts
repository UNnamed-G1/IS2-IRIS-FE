import { Component, ViewChild, OnInit, AfterContentInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload';

import { select, NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { REMOVE_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';
import { environment } from 'environments/environment';

import { ActivatedRoute, Router } from '@angular/router';
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

export class RgComponent implements OnInit, AfterContentInit, OnDestroy {
  @select() session;
  @select() isLogged;
  @select() auxiliarID;
  @ViewChild('sucSwal') private sucSwal: SwalComponent;
  @ViewChild('errSwal') private errSwal: SwalComponent;
  events: Array<Event>;
  subjects: Array<ResearchSubject>;
  publications: Array<Publication>;
  PDF: boolean = false;

  @Output() onDetails = new EventEmitter<number>();
  researchGroup: ResearchGroup = new ResearchGroup();
  showInput: boolean = false;
  isMember: boolean;
  rgForm: FormGroup;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;

  constructor(private researchGroupService: ResearchGroupService,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.uploader = new FileUploader({ queueLimit: 1 });
  }

  ngAfterContentInit() {
    this.auxiliarID.subscribe(id => {
      if (id) {
        this.researchGroupService.getEvents(id).subscribe((res: {events: Event[]}) => {
          this.events = res.events;
        });
        this.researchGroupService.getSubjects(id).subscribe((res: {research_subjects: ResearchSubject[]}) => {
          this.subjects = res.research_subjects;
        });
        this.researchGroupService.getPublications(id).subscribe((res: {publications: Publication[]}) => {
          this.publications = res.publications;
        });
        this.setRG(this.researchGroupService.get(id));
      } else {
        this.router.navigateByUrl('home');
      }
    });
  }

  ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR })
  }

  updateGroup() {
    if (this.rgForm.pristine && this.uploader.queue.length === 0) {
      return;
    }
    const rg = new ResearchGroup();
    if (this.rgForm.pristine) {
      rg.id = this.researchGroup.id;
    } else {
      for (const k in this.rgForm.controls) {
        if (this.rgForm.get(k).dirty) {
          rg[k] = this.rgForm.get(k).value;
        }
      }
    }
    const fd = new FormData();
    for (const key of Object.keys(rg)) {
      fd.append('research_group[' + key + ']', rg
      [key]);
    }
    if (this.uploader.queue.length) {
      fd.append('picture', this.uploader.queue[0].file.rawFile);
    }
    this.researchGroupService.update(this.researchGroup.id, fd).subscribe(
      (response: { research_group: ResearchGroup }) => {
        this.sucSwal.title = 'El grupo ha sido actualizado';
        this.sucSwal.show();
        this.toggleShowInput();
        Object.assign(this.researchGroup, response.research_group);
        this.researchGroup['photo'] = environment.api_url + this.researchGroup['photo'].picture;
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
      (response: { research_group: ResearchGroup }) => {
        this.researchGroup = Object.assign(new ResearchGroup(), response.research_group);
        this.researchGroup['photo'] = environment.api_url + this.researchGroup['photo'].picture;
        this.createRGForm();
        this.session.subscribe(session => {
          this.isMember = response.research_group['members'].map(u => u.user.username).includes(session.username);
        });
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'No se ha podido obtener el grupo de investigación';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
  }

  toggleShowInput() {
    this.showInput = !this.showInput;
  }

  pdfMode(){
    this.PDF = !this.PDF;
  }

  newUrl(id: number){
    return "http://localhost:3000/reports/rep_by_rg.pdf?id"+id;
  }

  onSubmit(){
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
      this.researchGroupService
        .update(this.researchGroup.id, rg)
        .subscribe(
          (response: { rg: ResearchGroup }) => {
            Object.assign(this.researchGroup, response.rg);
            this.sucSwal.title = 'El grupo ha sido actualizado';
            this.sucSwal.show();
            this.createRGForm();
          },
          (error: HttpErrorResponse) => {
            this.errSwal.title = 'Grupo no actualizado';
            this.errSwal.text = 'Mensaje de error: ' + error.message;
            this.errSwal.show();
          }
        );
    } else {
      this.researchGroupService
        .create({ researchGroup: rg })
        .subscribe(
          (response: { researchGroup: ResearchGroup }) => {
            this.sucSwal.title = 'El grupo ha sido añadido';
            this.sucSwal.show();
            this.rgForm.reset();
          },
          (error: HttpErrorResponse) => {
            this.errSwal.title = 'grupo no añadido';
            this.errSwal.text = 'Mensaje de error: ' + error.message;
            this.errSwal.show();
          })
        ;
    }
  }

  requestJoin() {
    this.researchGroupService.requestJoinGroup({ id: this.researchGroup.id }).subscribe(
      (response) => {
        this.sucSwal.title = 'Te has unido a este grupo';
        this.sucSwal.show();
        this.setRG(this.researchGroupService.get(this.researchGroup.id));
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'No te has podido unir al grupo';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    )
  }
  
  leave() {
    this.researchGroupService.leaveGroup({ id: this.researchGroup.id }).subscribe(
      (response) => {
        this.sucSwal.title = 'Has abandonado este grupo';
        this.sucSwal.show();
        this.setRG(this.researchGroupService.get(this.researchGroup.id));
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'No has podido abandonar el grupo';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    )
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
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
