import { Component, ViewChild, OnInit, AfterContentInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload';
import { ActivatedRoute, Router } from '@angular/router';

import { select, NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { REMOVE_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';
import { environment } from 'environments/environment';

import { Publication, ResearchGroup, ResearchSubject } from 'app/classes/_models';
import { ResearchGroupService } from 'app/services/research-group.service';

@Component({
  selector: 'app-rg',
  templateUrl: './rg.component.html',
  styleUrls: ['./rg.component.css']
})

export class RgComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('sucSwal') private sucSwal: SwalComponent;
  @ViewChild('errSwal') private errSwal: SwalComponent;
  @Output() detailsEmitter = new EventEmitter<number>();
  @select(['session', 'username']) sessionUsername;
  @select(['session', 'type']) sessionType;
  @select(['auxiliarID', 'researchGroup']) researchGroupID;
  @select() isLogged;
  events: Array<Event>;
  subjects: Array<ResearchSubject>;
  publications: Array<Publication>;

  rgReportUrl = environment.api_url + 'reports/rep_by_rg.pdf?id=';
  PDF = false;

  researchGroup: ResearchGroup;
  showInput = false;
  isMember: boolean;
  rgForm: FormGroup;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  allowedTypes = ['image/png', 'image/gif', 'image/jpeg'];

  constructor(private researchGroupService: ResearchGroupService,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>,
    private acRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.uploader = new FileUploader({ queueLimit: 1, allowedMimeType: this.allowedTypes });
  }

  ngAfterContentInit() {
    this.researchGroupID.subscribe((id: number) => {
      if (id) {
        this.rgReportUrl += id;
        this.researchGroupService.getEvents(id).subscribe(
          (response: { events: Event[] }) => {
            this.events = response.events;
          }, (error: HttpErrorResponse) => {
            this.errSwal.title = 'No se han podido obtener los eventos del grupo de ivnestigación';
            this.errSwal.text = 'Mensaje de error: ' + error.message;
            this.errSwal.show();
          }
        );
        this.researchGroupService.getSubjects(id).subscribe(
          (response: { research_subjects: ResearchSubject[] }) => {
            this.subjects = response.research_subjects;
          }, (error: HttpErrorResponse) => {
            this.errSwal.title = 'No se han podido obtener las lineas de investigación del grupo';
            this.errSwal.text = 'Mensaje de error: ' + error.message;
            this.errSwal.show();
          }
        );
        this.researchGroupService.getPublications(id).subscribe(
          (response: { publications: Publication[] }) => {
            this.publications = response.publications;
          }, (error: HttpErrorResponse) => {
            this.errSwal.title = 'No se han podido obtener las publicaciones del grupo de ivnestigación';
            this.errSwal.text = 'Mensaje de error: ' + error.message;
            this.errSwal.show();
          }
        );
        this.requestRG(id);
      } else {
        this.router.navigateByUrl('/');
      }
    });
  }

  ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR, remove: 'researchGroup' });
  }

  updateGroup() {
    if (this.rgForm.pristine && this.uploader.queue.length === 0) {
      return;
    }
    const rg = new ResearchGroup();
    if (this.rgForm.pristine) {
      rg.name = this.researchGroup.name;
    } else {
      for (const k in this.rgForm.controls) {
        if (this.rgForm.get(k).dirty) {
          rg[k] = this.rgForm.get(k).value;
        }
      }
    }
    const fd = new FormData();
    for (const key of Object.keys(rg)) {
      fd.append('research_group[' + key + ']', rg[key]);
    }
    if (this.uploader.queue.length) {
      fd.append('picture', this.uploader.queue[0].file.rawFile);
    }
    this.researchGroupService.update(this.researchGroup.id, fd).subscribe(
      (response: { research_group: ResearchGroup }) => {
        this.sucSwal.title = 'El grupo ha sido actualizado';
        this.sucSwal.show();
        this.toggleShowInput();
        this.uploader.clearQueue();
        this.setRG(response.research_group);
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'El grupo no ha podido ser actualizado';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
  }

  requestRG(id: number) {
    this.researchGroupService.get(id).subscribe(
      (response: { research_group: ResearchGroup }) => {
        this.setRG(response.research_group);
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'No se ha podido obtener el grupo de investigación';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
  }

  setRG(rg: ResearchGroup) {
    this.researchGroup = Object.assign({}, this.researchGroup, rg);
    if (rg.photo) {
      Object.assign(this.researchGroup, { photo: environment.api_url + rg.photo.picture });
    }
    this.createRGForm();
    if (rg.members) {
      this.sessionUsername.subscribe((username: string) => {
        this.isMember = rg.members.map(u => u.user.username).includes(username);
      });
    }
  }

  toggleShowInput() {
    this.showInput = !this.showInput;
  }

  pdfMode() {
    this.PDF = !this.PDF;
  }

  onSubmit() {
    if (this.rgForm.pristine) {
      return;
    }
    const rg = new ResearchGroup();
    for (const key in this.rgForm.controls) {
      if (this.rgForm.get(key).dirty) {
        rg[key] = this.rgForm.get(key).value;
      }
    }
    if (this.researchGroup.id) {
      this.researchGroupService.update(this.researchGroup.id, rg).subscribe(
        (response: { research_group: ResearchGroup }) => {
          this.setRG(response.research_group);
          this.sucSwal.title = 'El grupo ha sido actualizado';
          this.sucSwal.show();
          this.createRGForm();
        },
        (error: HttpErrorResponse) => {
          this.errSwal.title = 'Grupo no actualizado';
          this.errSwal.text = 'Mensaje de error: ' + error.message;
          this.errSwal.show();
        });
    }
  }

  requestJoin() {
    this.researchGroupService.requestJoinGroup({ id: this.researchGroup.id }).subscribe(
      (response) => {
        this.sucSwal.title = 'Te has unido a este grupo';
        this.sucSwal.show();
        this.requestRG(this.researchGroup.id);
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'No te has podido unir al grupo';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
  }

  leave() {
    this.researchGroupService.leaveGroup({ id: this.researchGroup.id }).subscribe(
      (response) => {
        this.sucSwal.title = 'Has abandonado este grupo';
        this.sucSwal.show();
        this.requestRG(this.researchGroup.id);
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'No has podido abandonar el grupo';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  loadedImage(e: FileList) {
    if (this.allowedTypes.includes(e[0].type)) {
      this.uploader.clearQueue();
      this.uploader.addToQueue([e[0]]);
    } else {
      this.errSwal.title = 'El tipo de archivo es inválido';
      this.errSwal.text = 'Sólo se permiten imágenes jpg, png o gif';
      this.errSwal.show();
    }
  }

  private createRGForm() {
    this.rgForm = this.formBuilder.group({
      name: [this.researchGroup.name,
      [Validators.required, Validators.pattern('[A-Za-zÀ-ÿ ]*'),
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
