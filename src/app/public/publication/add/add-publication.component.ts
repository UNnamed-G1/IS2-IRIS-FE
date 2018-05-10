import { Component, OnInit, OnDestroy, AfterContentInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { Router } from '@angular/router';

import { NgRedux, select } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { REMOVE_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';

import { PublicationService } from 'app/services/publication.service';
import { Publication } from 'app/classes/_models';

@Component({
  selector: 'app-add-publication',
  templateUrl: './add-publication.component.html',
  styleUrls: ['./add-publication.component.css']
})

export class AddPublicationComponent implements OnInit, OnDestroy, AfterContentInit {
  @ViewChild('sucSwal') private sucSwal: SwalComponent;
  @ViewChild('errSwal') private errSwal: SwalComponent;
  @select(['auxiliarID', 'publicationUpdate']) publicationID;

  fileName: string;
  fileList: FileList;
  file: File;
  fileReader: FileReader = new FileReader();
  uploadPublicationResponse$;
  uploadRequested = false;

  uploadForm: FormGroup;
  publication: Publication = new Publication();
  type_pubs: string[] = ['Monografia', 'Patente', 'Libro', 'Articulo', 'Tesis', 'Software'];
  minDate = new Date(1900, 0);  // 1900/01/01
  maxDate = new Date();         // Actual date

  constructor(private publicationService: PublicationService,
    private router: Router,
    private permMan: PermissionManager,
    private formBuilder: FormBuilder,
    private ngRedux: NgRedux<AppState>) { }

  ngOnInit() {
    this.permMan.validateSession(['Admin']);
  }

  ngAfterContentInit() {
    this.publicationID.subscribe((id: number) => {
      if (id) {
        this.publicationService.get(id).subscribe(
          (publication: { publication: Publication }) => {
            this.publication = publication.publication;
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

  ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR, remove: 'publicationUpdate' });
  }

  fileChange(event) {
    this.fileList = event.target.files;
    if (this.fileList.length > 0) {
      this.file = this.fileList[0];
      this.fileName = this.file.name;
    }
  }

  onSubmit() {
    if (this.uploadForm.pristine) {
      return;
    }
    const publication = new Publication();
    for (const k in this.uploadForm.controls) {
      if (this.uploadForm.get(k).dirty) {
        publication[k] = this.uploadForm.get(k).value;
      }
    }
    if (publication.type_pub) {
      publication.type_pub = publication.type_pub.toLowerCase();
    }
    if (this.publication.id) {
      this.publicationService.update(this.publication.id, publication).subscribe(
        (response: { publication: Publication }) => {
          Object.assign(this.publication, response.publication);
          this.sucSwal.title = 'La publicación ha sido actualizada';
          this.sucSwal.show();
          this.createRGForm();
        },
        (error: HttpErrorResponse) => {
          this.errSwal.title = 'Publicación no actualizada';
          this.errSwal.text = 'Mensaje de error: ' + error.message;
          this.errSwal.show();
        }
      );
    } else {
      this.uploadPublicationResponse$ = this.publicationService.uploadPublication(publication, this.file);
      this.uploadRequested = true;
      this.uploadPublicationResponse$.subscribe(
        (response: { publication: Publication }) => {
          this.sucSwal.title = 'El grupo de investigación ha sido añadido';
          this.sucSwal.show();
          this.uploadForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.errSwal.title = 'Publicación no añadida';
          this.errSwal.text = 'Mensaje de error: ' + error.message;
          this.errSwal.show();
        }
      );
    }
  }

  private createRGForm() {
    this.uploadForm = this.formBuilder.group({
      name: [this.publication.name, [Validators.required, Validators.maxLength(100)]],
      date: [this.publication.date, [Validators.required]],
      abstract: [this.publication.abstract, [Validators.required, Validators.maxLength(1000)]],
      brief_description: [this.publication.brief_description, [Validators.required, Validators.maxLength(1000)]],
      type_pub: [this.publication.publication_type, [Validators.required]],
      document: [undefined]
    });
  }

  get name() { return this.uploadForm.get('name'); }
  get date() { return this.uploadForm.get('date'); }
  get abstract() { return this.uploadForm.get('abstract'); }
  get brief_description() { return this.uploadForm.get('brief_description'); }
  get type_pub() { return this.uploadForm.get('type_pub'); }
  get document() { return this.uploadForm.get('document'); }

}
