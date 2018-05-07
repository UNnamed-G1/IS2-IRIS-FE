import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {

  @select(['auxiliarID', 'eventUpdate']) eventUpdateID;
  @select(['session', 'id']) userID;

  private eventId: number;
  usrGroups: Array<ResearchGroup>;
  eventForm: FormGroup;
  types: { [Key: string]: string[] } = {
    event: ['Publico', 'Privado'],
    frequence: ['Unico', 'Repetitivo'],
    state: ['Activo', 'Inactivo']
  }
  minDate: Date = new Date(); // Actual date for event date
  swalOpts: any;
  // Initial map position
  lat: number = 4.63858;
  lng: number = -74.0841;

  constructor(
    private eventService: EventService,
    private userService: UserService,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.createEventForm(new Event());
    if (this.permMan.validateSession(['Profesor'])) {
      this.userID.subscribe(id => {
        this.userService.get(id).subscribe(
          (response: any) => {
            this.usrGroups = response.user.research_groups;
          },
          (error: HttpErrorResponse) => {
            this.swalOpts = { title: 'No se ha podido obtener tus grupos de investigación', text: error.message, type: 'error' };
          }
        );
      });
      this.eventUpdateID.subscribe((id: number) => {
        if (id) {
          this.eventService.get(id).subscribe(
            (response: { event: Event }) => {
              this.eventId = response.event.id;
              this.setEvent(response.event);
            },
            (error: HttpErrorResponse) => {
              this.swalOpts = { title: 'No se ha podido obtener el evento', text: error.message, type: 'error' };
            }
          );
        } else {
          // No id stored
          this.router.navigateByUrl('');
        }
      });
    }
  }

  onSubmit() {
    if (this.eventForm.invalid) {
      this.swalOpts = { title: 'Hay datos inválidos', text: 'Por favor corrígelos y vuelve a intentarlo', type: 'warning' };
      for (const k in this.eventForm.controls) {
        if (this.eventForm.get(k).invalid) {
          this.eventForm.get(k).markAsDirty;
        }
      }
      return;
    }
    if (this.eventForm.pristine) {
      this.swalOpts = { title: 'No has realizado cambios', text: 'Los datos no serán actualizados', type: 'warning' };
      return;
    }
    const e = new Event();
    for (const k in this.eventForm.controls) {
      if (this.eventForm.get(k).dirty) {
        e[k] = this.eventForm.get(k).value;
        if (k === 'event_type' || k === 'frequence' || k === 'state') {
          e[k] = e[k].toLowerCase();
        }
      }
    }
    if (e.event_type) {
      e.type_ev = e.event_type;
      delete e.event_type;
    }
    if (this.eventId) {
      this.eventService.update(this.eventId, { event: e }).subscribe(
        (response: { event: Event }) => {
          this.swalOpts = { title: 'El evento ha sido actualizado', type: 'success' };
          this.setEvent(response.event);
        },
        (error: HttpErrorResponse) => {
          this.swalOpts = { title: 'Evento no actualizado', text: error.message, type: 'error' };
        }
      );
    } else {
      this.eventService.create({ event: e }).subscribe(
        (response: { event: Event }) => {
          this.swalOpts = { title: 'El evento ha sido añadido', type: 'success' };
          this.eventForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.swalOpts = { title: 'Evento no añadido', text: error.message, type: 'error' };
        }
      );
    }
  }

  setEvent(event: Event) {
    event.research_group_id = event.research_group.id;
    this.createEventForm(event);
    this.lat = event.latitude;
    this.lng = event.longitude;
  }

  // Maps events
  setCoords($event: MouseEvent) {
    this.latitude.setValue($event.coords.lat);
    this.latitude.markAsDirty();
    this.longitude.setValue($event.coords.lng);
    this.longitude.markAsDirty();
  }

  private createEventForm(ev: Event) {
    this.eventForm = this.formBuilder.group({
      name: [ev.name, Validators.required],
      topic: [ev.topic, [Validators.required, Validators.maxLength(5000)]],
      description: [ev.description, [Validators.required, Validators.maxLength(5000)]],
      event_type: [ev.event_type, Validators.required],
      date: [ev.date, Validators.required],
      research_group_id: [ev.research_group_id, Validators.required],
      frequence: [ev.frequence, Validators.required],
      duration: [ev.duration, Validators.required],
      state: [ev.state, Validators.required],
      address: [ev.address, Validators.required],
      latitude: [ev.latitude],
      longitude: [ev.longitude]
    });
  }

  get name() { return this.eventForm.get('name'); }
  get topic() { return this.eventForm.get('topic'); }
  get description() { return this.eventForm.get('description'); }
  get event_type() { return this.eventForm.get('event_type'); }
  get date() { return this.eventForm.get('date'); }
  get research_group_id() { return this.eventForm.get('research_group_id'); }
  get frequence() { return this.eventForm.get('frequence'); }
  get duration() { return this.eventForm.get('duration'); }
  get state() { return this.eventForm.get('state'); }
  get latitude() { return this.eventForm.get('latitude'); }
  get longitude() { return this.eventForm.get('longitude'); }
  get address() { return this.eventForm.get('address'); }
}
