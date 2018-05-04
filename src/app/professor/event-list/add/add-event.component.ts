import { Component, OnInit, OnDestroy, ViewChild, AfterContentInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { MouseEvent } from '@agm/core';
import { NgRedux, select } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { REMOVE_AUXILIAR } from 'app/redux/actions';

import { PermissionManager } from 'app/permission-manager';
import { Event, ResearchGroup } from 'app/classes/_models';
import { EventService } from 'app/services/event.service';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})

export class AddEventComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('sucSwal') private sucSwal: SwalComponent;
  @ViewChild('errSwal') private errSwal: SwalComponent;

  @select(['auxiliarID', 'eventUpdate']) eventUpdateID;
  @select(['session', 'id']) userID;
  rgsUser: Array<ResearchGroup>;
  event: Event = new Event();
  eventForm: FormGroup;
  event_types: string[] = ['Publico', 'Privado'];
  frequence_types: string[] = ['Unico', 'Repetitivo'];
  state_types: string[] = ['Activo', 'Inactivo'];
  minDate = new Date();         // Actual date
  zoom: number = 16;

  // initial center position for the map
  lat: number = 4.63858;
  lng: number = -74.0841;
  // coords to send
  latP: number;
  lngP: number;

  markers: marker[] = [
	  {
		  lat: 4.63858,
		  lng: -74.0841,
		  draggable: true
	  }
  ];

  constructor(private eventService: EventService,
    private userService: UserService,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.permMan.validateSession(['Profesor']);
    this.userID.subscribe((id) => {
      this.userService.get(id).subscribe(
        (response: any) => {
          this.rgsUser= response.user.research_groups;
        }
      );
    })
    this.latP=this.lat;
    this.lngP=this.lng;
  }

  ngAfterContentInit() {
    this.eventUpdateID.subscribe((id: number) => {
      if (id) {
        this.eventService.get(id).subscribe(
          (event: { event: Event }) => {
            this.event = event.event;
            this.createEventForm();
          },
          (error: HttpErrorResponse) => {
            this.errSwal.title = 'No se ha podido obtener el evento';
            this.errSwal.text = 'Mensaje de error: ' + error.message;
            this.errSwal.show();
          }
        );
      }
    });
    this.createEventForm();
  }

  ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR, remove: 'eventUpdate' });
  }

  onSubmit() {
    if (this.eventForm.pristine) {
      return;
    }
    for (const k in this.eventForm.controls) {
        if (this.eventForm.get(k).errors) {

        }
      }
    const e = new Event();
    for (const k in this.eventForm.controls) {
      if (this.eventForm.get(k).dirty) {
        e[k] = this.eventForm.get(k).value;
        e.latitude=this.latP;
        e.longitude=this.lngP;
      }
    }
    if (e.event_type) {
      e.type_ev = e.event_type.toLowerCase();
      delete e.event_type;
    }
    if (e.frequence) {
      e.frequence = e.frequence.toLowerCase();
    }
    if (e.state) {
      e.state = e.state.toLowerCase();
    }
    if (this.event.id) {
      this.eventService.update(this.event.id, { event: e }).subscribe(
        (response: { event: Event }) => {
          Object.assign(this.event, response.event);
          this.sucSwal.title = 'El evento ha sido actualizado';
          this.sucSwal.show();
          this.createEventForm();
          console.log(response.event);
        },
        (error: HttpErrorResponse) => {
          this.errSwal.title = 'Evento no actualizado';
          this.errSwal.text = 'Mensaje de error: ' + error.message;
          this.errSwal.show();
        }
      );
    } else {
      this.eventService.create({ event: e }).subscribe(
        (response: { event: Event }) => {
          this.sucSwal.title = 'El evento ha sido añadido';
          this.sucSwal.show();
          this.eventForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.errSwal.title = 'Evento no añadido';
          this.errSwal.text = 'Mensaje de error: ' + error.message;
          this.errSwal.show();
        }
      );
    }
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
      research_group_id: [this.event.research_group, Validators.required],
      frequence: [this.event.frequence, Validators.required],
      duration: [this.event.duration, Validators.required],
      state: [this.event.state, Validators.required],
      address: [this.event.address, Validators.required],
      latitude: [this.event.latitude],
      longitude: [this.event.longitude],
    });
  }
  get research_group_id() {return this.eventForm.get('research_group_id');}
  get name() { return this.eventForm.get('name'); }
  get topic() { return this.eventForm.get('topic'); }
  get description() { return this.eventForm.get('description'); }
  get event_type() { return this.eventForm.get('event_type'); }
  get date() { return this.eventForm.get('date'); }
  get frequence() { return this.eventForm.get('frequence'); }
  get duration() { return this.eventForm.get('duration'); }
  get state() { return this.eventForm.get('state'); }
  get latitude(){return this.eventForm.get('latitude'); }
  get longitude(){return this.eventForm.get('longitude'); }
  get address(){return this.eventForm.get('address'); }

  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
    this.latP=$event.coords.lat;
    this.lngP=$event.coords.lng;

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
