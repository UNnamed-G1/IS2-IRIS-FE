import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { NgRedux, select } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { REMOVE_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';

import { PublicationService } from 'app/services/publication.service';
import { Publication } from 'app/classes/_models';
import { Swal } from 'app/classes/swal';

@Component({
  selector: 'app-add-publication',
  templateUrl: './add-publication.component.html',
  styleUrls: ['./add-publication.component.css']
})

export class AddPublicationComponent implements OnInit, OnDestroy {
  @select(['auxiliarID', 'publicationUpdate']) publicationID;

  publicationForm: FormGroup;
  publicationId: number;
  uploadedFile: File;
  type_pubs: string[] = ['Monografia', 'Patente', 'Libro', 'Articulo', 'Tesis', 'Software'];
  minDate = new Date(1900, 0);  // 1900/01/01
  maxDate = new Date();         // Actual date
  swalOpts: Swal;

  constructor(private publicationService: PublicationService,
    private router: Router,
    private permMan: PermissionManager,
    private formBuilder: FormBuilder,
    private ngRedux: NgRedux<AppState>) { }

  ngOnInit() {
    this.permMan.validateSession(['Administrador']);
    this.publicationID.subscribe((id: number) => {
      if (id) {
        this.publicationId = id;
        this.publicationService.get(id).subscribe(
          (response: { publication: Publication }) => {
            this.createRGForm(response.publication);
          },
          (error: HttpErrorResponse) => {
            this.swalOpts = { title: 'No se ha podido obtener el grupo de investigación', text: error.message, type: 'error' };
          }
        );
      }
    });
    this.createRGForm(new Publication());
  }

  ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR, remove: 'publicationUpdate' });
  }

  fileChange(event) {
    if (event.target.files.length > 0) {
      this.uploadedFile = event.target.files[0];
    }
  }

  onSubmit() {
    if (this.publicationForm.pristine) {
      return;
    }
    const publication = new Publication();
    for (const k in this.publicationForm.controls) {
      if (this.publicationForm.get(k).dirty) {
        publication[k] = this.publicationForm.get(k).value;
        if (k === 'document') {
          publication[k] = this.uploadedFile;
        }
      }
    }
    const fd = new FormData();
    for (const key of Object.keys(publication)) {
      fd.append('publication[' + key + ']', publication[key]);
    }
    if (this.publicationId) {
      this.publicationService.update(this.publicationId, fd).subscribe(
        (response: { publication: Publication }) => {
          this.swalOpts = { title: 'La publicación ha sido actualizada', type: 'success',confirm: this.navList, confirmParams: [this] };
          this.createRGForm(response.publication);
        },
        (error: HttpErrorResponse) => {
          this.swalOpts = { title: 'Publicación no actualizada', text: error.message, type: 'error' };
        }
      );
    } else {
      this.publicationService.create(fd).subscribe(
        (response: { publication: Publication }) => {
          this.swalOpts = { title: 'El grupo de investigación ha sido añadido', type: 'success', confirm: this.navList, confirmParams: [this] };
          this.publicationForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.swalOpts = { title: 'Publicación no añadida', text: error.message, type: 'error' };
        }
      );
    }
  }

  navList(){
    this.router.navigateByUrl('publication');
  }

  private createRGForm(publication: Publication) {
    this.publicationForm = this.formBuilder.group({
      name: [publication.name, [Validators.required, Validators.maxLength(100)]],
      date: [publication.date, [Validators.required]],
      abstract: [publication.abstract, [Validators.required, Validators.maxLength(1000)]],
      brief_description: [publication.brief_description, [Validators.required, Validators.maxLength(1000)]],
      type_pub: [publication.publication_type, [Validators.required]],
      document: ['']
    });
  }

  get name() { return this.publicationForm.get('name'); }
  get date() { return this.publicationForm.get('date'); }
  get abstract() { return this.publicationForm.get('abstract'); }
  get brief_description() { return this.publicationForm.get('brief_description'); }
  get type_pub() { return this.publicationForm.get('type_pub'); }
  get document() { return this.publicationForm.get('document'); }

}
