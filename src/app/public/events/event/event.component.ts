import { Component, ViewChild, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
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
import { Event, User, ResearchGroup } from 'app/classes/_models';
import { EventService } from 'app/services/event.service';
import { ADD_AUXILIAR } from 'app/redux/actions';
import { MouseEvent } from '@agm/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, OnDestroy {
  @ViewChild('sucSwal') private sucSwal: SwalComponent;
  @ViewChild('errSwal') private errSwal: SwalComponent;
  @Output() detailsEmitter = new EventEmitter<number>();
  @select(['session', 'username']) sessionUsername;
  @select(['session', 'type']) sessionType;
  @select(['auxiliarID', 'event']) eventID;
  @select() isLogged;
  event: Event;
  user: User[] = new Array<User>();
  showInput = false;
  isInvited: boolean;
  eventForm: FormGroup;
  event_types: string[] = ['Publico', 'Privado'];
  frequence_types: string[] = ['Unico', 'Repetitivo'];
  state_types: string[] = ['Activo', 'Inactivo'];
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  allowedTypes = ['image/png', 'image/gif', 'image/jpeg'];
  invited: Array<User>;
  rgsUser: Array<ResearchGroup>;

  zoom: number = 16;
  // initial center position for the map
  lat: number = 4.63858;
  lng: number = -74.0841;
  // coords to send
  test: number;
  latP: number;
  lngP: number;
  label: string;
  markers: marker[] = [
    {
      lat: 4.63858,
      lng: -74.0841,
      draggable: true
    }
  ];
  constructor(private eventService: EventService,
    private ngRedux: NgRedux<AppState>,
    private acRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) { }


  ngOnInit() {
    this.uploader = new FileUploader({ allowedMimeType: this.allowedTypes });
    this.eventID.subscribe((id: number) => {
      if (id) {
        this.setInvitedU(id);
        this.requestEvent(id);
      } else {
        this.router.navigateByUrl('/');
      }
    }).unsubscribe();
    this.test = this.eventID.latitude;
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
          event.latitude = this.latP;
          event.longitude = this.lngP;
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
        event.latitude = this.latP;
        event.longitude = this.lngP;
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

  setInvitedU(id: number) {
    this.eventService.getInvitedUsers(id).subscribe(
      (response: { users: Array<User> }) => {
        (this.invited = response.users);
        //console.log(this.invited);
        //console.log(response);
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'No se han podido obtener los invitados';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
    this.user = new Array<User>();
  }

  requestEvent(id: number) {
    this.eventService.get(id).subscribe(
      (response: { event: Event }) => {
        this.setEvent(response.event);
        //console.log(response);
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'No se ha podido obtener el evento';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
  }
  sendInvitation(ids: Array<number>) {
    this.eventService.sendInvitation(this.event.id, ids).subscribe(
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


  private createEventForm() {
    this.eventForm = this.formBuilder.group({
      name: [this.event.name, Validators.required],
      topic: [this.event.topic,
      [Validators.required, Validators.maxLength(5000)]],
      description: [this.event.description,
      [Validators.required, Validators.maxLength(5000)]],
      event_type: [this.event.event_type, Validators.required],
      date: [this.event.date, Validators.required],
      research_group_id: [this.event.research_group],
      frequence: [this.event.frequence, Validators.required],
      duration: [this.event.duration, Validators.required],
      state: [this.event.state, Validators.required],
      address: [this.event.address, Validators.required],
      latitude: [this.event.latitude],
      longitude: [this.event.longitude],
    });
  }
  get research_group_id() { return this.eventForm.get('research_group_id'); }
  get name() { return this.eventForm.get('name'); }
  get topic() { return this.eventForm.get('topic'); }
  get description() { return this.eventForm.get('description'); }
  get event_type() { return this.eventForm.get('event_type'); }
  get date() { return this.eventForm.get('date'); }
  get frequence() { return this.eventForm.get('frequence'); }
  get duration() { return this.eventForm.get('duration'); }
  get state() { return this.eventForm.get('state'); }
  get latitude() { return this.eventForm.get('latitude'); }
  get longitude() { return this.eventForm.get('longitude'); }
  get address() { return this.eventForm.get('address'); }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
    this.latP = $event.coords.lat;
    this.lngP = $event.coords.lng;

  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  mapClicked($event: MouseEvent) {
    this.markers[0].lat = $event.coords.lat;
    this.markers[0].lng = $event.coords.lng;

    /*this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });*/
  }

}

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
