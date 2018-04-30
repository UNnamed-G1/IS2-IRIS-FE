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
import { Event } from 'app/classes/_models';
import { EventService } from 'app/services/event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('sucSwal') private sucSwal: SwalComponent;
  @ViewChild('errSwal') private errSwal: SwalComponent;
  @Output() detailsEmitter = new EventEmitter<number>();
  @select(['session', 'username']) sessionUsername;
  @select(['session', 'type']) sessionType;
  @select(['auxiliarID', 'event']) eventID;
  @select() isLogged;
  event: Event;
  showInput = false;
  isInvited: boolean;
  eventForm: FormGroup;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  allowedTypes = ['image/png', 'image/gif', 'image/jpeg'];

  constructor(private eventService: EventService,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>,
    private acRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) { }


    ngOnInit() {
      this.uploader = new FileUploader({ allowedMimeType: this.allowedTypes });
    }
    ngAfterContentInit() {
        console.log(this.eventID);
        this.eventID.subscribe((id: number) => {
          if (id) {
            this.requestEvent(id);
          } else {
            this.router.navigateByUrl('/');
          }
        });
      }

    ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR, remove: 'event' });
    }
    updateGroup() {
      if (this.eventForm.pristine && this.uploader.queue.length === 0) {
        return;
      }
      const event = new Event();
      if (this.eventForm.pristine) {
        event.topic = this.event.topic;
      } else {
        for (const k in this.eventForm.controls) {
          if (this.eventForm.get(k).dirty) {
            event[k] = this.eventForm.get(k).value;
          }
        }
      }
      const fd = new FormData();
      for (const key of Object.keys(event)) {
        fd.append('event[' + key + ']', event[key]);
      }
      if (this.uploader.queue.length) {
        fd.append('picture', this.uploader.queue[0].file.rawFile);
      }
      this.eventService.update(this.event.id, fd).subscribe(
        (response: { event: Event }) => {
          this.sucSwal.title = 'El grupo ha sido actualizado';
          this.sucSwal.show();
          this.toggleShowInput();
          this.uploader.clearQueue();
          this.setEvent(response.event);
        },
        (error: HttpErrorResponse) => {
          this.errSwal.title = 'El grupo no ha podido ser actualizado';
          this.errSwal.text = 'Mensaje de error: ' + error.message;
          this.errSwal.show();
        }
      );
    }

    onSubmit() {
    if (this.eventForm.pristine) {
      return;
    }
    const event = new Event();
    for (const key in this.eventForm.controls) {
      if (this.eventForm.get(key).dirty) {
        event[key] = this.eventForm.get(key).value;
      }
    }
    if (this.event.id) {
      this.eventService.update(this.event.id, event).subscribe(
        (response: { event: Event }) => {
          this.setEvent(response.event);
          this.sucSwal.title = 'Evento actualizado';
          this.sucSwal.show();
          this.createEventForm();
        },
        (error: HttpErrorResponse) => {
          this.errSwal.title = 'Evento no actualizado';
          this.errSwal.text = 'Mensaje de error: ' + error.message;
          this.errSwal.show();
        });
      }
    }
    requestEvent(id: number) {
      this.eventService.get(id).subscribe(
        (response: { event: Event }) => {
          this.setEvent(response.event);
        },
        (error: HttpErrorResponse) => {
          this.errSwal.title = 'No se ha podido obtener el evento';
          this.errSwal.text = 'Mensaje de error: ' + error.message;
          this.errSwal.show();
        }
      );
    }
    sendInvitation(id,ids) {
      this.eventService.sendInvitationEvent( (this.event.id)).subscribe(
        (response) => {
          this.sucSwal.title = 'Invitaciones enviadas';
          this.sucSwal.show();
          this.requestEvent(this.event.id);
        },
        (error: HttpErrorResponse) => {
          this.errSwal.title = 'No has podido enviar las invitaciones';
          this.errSwal.text = 'Mensaje de error: ' + error.message;
          this.errSwal.show();
        }
      );
    }

    toggleShowInput() {
      this.showInput = !this.showInput;
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
    setEvent(event: Event) {
      this.event = Object.assign({}, this.event, event);
      this.createEventForm();

    }
    private createEventForm() {
      this.eventForm = this.formBuilder.group({
        topic: [this.event.topic,
        [Validators.required, Validators.maxLength(5000)]],
        description: [this.event.description,
        [Validators.required, Validators.maxLength(5000)]],
        date: [this.event.date, [Validators.required]],
        duration: [this.event.duration, [Validators.required]],
        type_ev: [this.event.event_type, [Validators.required]],
        frequence: [this.event.frequence, [Validators.required]],
        state: [this.event.state, [Validators.required]],
        });
    }
    /*leave() {
      this.eventService.leaveEvent({ id: this.event.id }).subscribe(
        (response) => {
          this.sucSwal.title = 'Ya no estás inscrito a este evento';
          this.sucSwal.show();
          this.requestEvent(this.event.id);
        },
        (error: HttpErrorResponse) => {
          this.errSwal.title = 'Error al eliminar evento';
          this.errSwal.text = 'Mensaje de error: ' + error.message;
          this.errSwal.show();
        }
      );
    }*/
    get topic() { return this.eventForm.get('topic'); }
    get description() { return this.eventForm.get('description'); }
    get date() { return this.eventForm.get('date'); }
    get duration() { return this.eventForm.get('duration'); }
    get type_ev() { return this.eventForm.get('type_ev'); }
    get frequence() { return this.eventForm.get('frequence'); }
    get state() { return this.eventForm.get('state'); }
}
