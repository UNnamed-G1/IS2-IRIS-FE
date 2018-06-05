import { Component, ViewChild, OnInit, OnDestroy, EventEmitter, Output, ElementRef, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MouseEvent } from '@agm/core';

import { select, NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ADD_AUXILIAR, REMOVE_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';

import { environment } from 'environments/environment';
import { Event, User, ResearchGroup } from 'app/classes/_models';
import { Swal } from 'app/classes/swal';
import { EventService } from 'app/services/event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, OnDestroy {
  @ViewChild('closeModal') private closeBtn: ElementRef;
  @select(['session', 'type']) sessionType;
  @select(['auxiliarID', 'event']) eventID;
  @select() isLogged;
  swalOpts: Swal;

  event: Event;
  user: User[] = new Array<User>();
  showInput = false;
  isInvited: boolean;
  eventForm: FormGroup;
  event_types: string[] = ['Público', 'Privado'];
  frequence_types: string[] = ['Único', 'Repetitivo'];
  state_types: string[] = ['Activo', 'Inactivo'];
  allowedTypes = ['image/png', 'image/gif', 'image/jpeg'];
  invited: Array<User>;
  eventSubscription:any;
  imageEncoded: string;
  imageEncodedCropped: string;
  usersToInvite: Array<User>;
  choosedUsers: Array<any> = new Array<any>();

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
    private formBuilder: FormBuilder,
    private zone: NgZone) { }


  ngOnInit() {
    this.eventID.subscribe((id: number) => {
      if (id) {
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

  updateEvent() {
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
          this.swalOpts = { title: 'Evento actualizado', type: 'success' };
          this.createEventForm();
        },
        (error: HttpErrorResponse) => {
          this.swalOpts = { title: 'Evento no actualizado', text: error.message, type: 'error' };
        }
      );
    }
  }

  requestEvent(id: number) {
    this.eventService.get(id).subscribe(
      (response: { event: Event }) => {
        this.setEvent(response.event);
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'No se ha podido obtener el evento', text: error.message, type: 'error' };
      }
    );
    this.eventService.getInvitedUsers(id).subscribe(
      (response: { users: Array<User> }) => {
        this.invited = response.users.map((u: User) => Object.assign(u, { photo: environment.api_url + u.photo.picture }));
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'No se han podido obtener los invitados', text: error.message, type: 'error' };
      }
    );
  }

  toggleShowInput() {
    this.showInput = !this.showInput;
  }

  setEvent(event: Event) {
    this.event = Object.assign({}, event);
    if (event.photos) {
      Object.assign(this.event, { photo: environment.api_url + event.photos.find });
    }
    this.createEventForm();

  }
  viewResearchGroup(id: number) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: { researchGroup: id } });
    this.router.navigateByUrl('/rg');
  }
  checkFile(file: File) {
    // Verify file loaded (Select file cancel will throw undefined file)
    if (file) {
      // Verify type
      if (this.allowedTypes.includes(file.type)) {
        // Verify size
        const reader = new FileReader();
        const img = new Image;
        const _this = this;
        reader.onloadend = () => {
          img.onload = () => {
            if (img.width >= 20 && img.height >= 20) {
              // Open ImageCropper dialog setting imageEncoded
              _this.zone.run(() => _this.imageEncoded = img.src);
            } else {
              _this.swalOpts = { title: 'La imagen es demasiado pequeña', text: 'Asegurate de que el tamaño sea de al menos 20x20 pixeles', errorMsg: false, type: 'error' };
            }
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.swalOpts = { title: 'El tipo de archivo es inválido', text: 'Sólo se permiten imágenes .jpg, .png o .gif', errorMsg: false, type: 'error' };
      }
    }
  }

  // Sets on image cropped event
  croppedImage(image: string) {
    this.imageEncodedCropped = image;
    this.imageEncoded = '';
  }

  notCroppedImage() {
    // Reset FileList of images of the input
    this.imageEncoded = '';
  }
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


  }

  // Invite users modal

  choosed(userId: number): boolean {
    return this.choosedUsers.map((user) => user.id).includes(userId);
  }

  inviteUser(user: User) {
    this.choosedUsers.push({ id: user.id, name: user.full_name, username: user.username, photo: user.photo });
  }

  removeUser(idx: number) {
    this.choosedUsers.splice(idx, 1);
  }

  inviteUsers() {
    const choosed = this.choosedUsers.map((user) => user.id);
    this.eventService.inviteUsers(this.event.id, { users_ids: choosed }).subscribe(
      (response: { message: string }) => {
        this.swalOpts = { title: response.message, type: 'success' };
        this.closeBtn.nativeElement.click();
        this.requestEvent(this.event.id);
        this.setUsersToInvite();
        this.choosedUsers = new Array<any>();
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'Usuarios no añadidos', text: error.message, type: 'error' };
      }
    )
  }

  setUsersToInvite(keywords = '') {
    this.eventService.availableUsers(this.event.id, keywords).subscribe(
      (response: { users: Array<User> }) => {
        this.usersToInvite = response.users.map((u: User) => Object.assign(u, { photo: environment.api_url + u.photo.picture }));
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'No se han podido obtener usuarios', text: error.message, type: 'error' };
      }
    )
  }
  // Convert b64 to file
  base64toFile(base64: string, filename: string): File {
    const arr = base64.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    for (let i = n; i >= 0; i--) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new File([u8arr], filename + '.' + mime.split('/')[1], { type: mime });
  }

}

// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
