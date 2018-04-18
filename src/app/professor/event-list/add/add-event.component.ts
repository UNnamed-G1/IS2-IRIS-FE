import { Component, OnInit, OnDestroy, ViewChild, AfterContentInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { AppState } from 'app/redux/store';
import { REMOVE_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';
import { Event } from 'app/classes/events';
import { EventService } from 'app/services/event.service';
@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})

export class AddEventComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('sucSwal') private sucSwal: SwalComponent;
  @ViewChild('errSwal') private errSwal: SwalComponent;

  @select() auxiliarID;

  event: Event = new Event();
  eventForm: FormGroup;
  event_types: string[] = ['Publico', 'Privado'];
  frequence_types: string[] = ['Unico', 'Repetitivo'];
  state_types: string[] = ['Activo', 'Inactivo'];

  constructor(private eventService: EventService,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.permMan.validateSession(['Profesor']);
  }

  ngAfterContentInit() {
    this.auxiliarID.subscribe(id => {
      if (id) {
        this.eventService.get(id)
          .subscribe(
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
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR });
  }

  onSubmit() {
    if (this.eventForm.pristine) {
      return;
    }
    const e = new Event();
    for (const k in this.eventForm.controls) {
      if (this.eventForm.get(k).dirty) {
        e[k] = this.eventForm.get(k).value;
      }
    }
    if (e.event_type) {
      e['type_ev'] = e.event_type.toLowerCase();
      delete e.event_type;
    }
    if (e.frequence) {
      e.frequence = e.frequence.toLowerCase();
    }
    if (e.state) {
      e.state = e.state.toLowerCase();
    }
    if (this.event.id) {
      this.eventService
        .update(this.event.id, { event: e })
        .subscribe(
          (response: { event: Event }) => {
            this.sucSwal.title = 'El evento ha sido actualizado';
            this.sucSwal.show();
            Object.assign(this.event, response.event);
            this.createEventForm();
          },
          (error: HttpErrorResponse) => {
            this.errSwal.title = 'Evento no actualizado';
            this.errSwal.text = 'Mensaje de error: ' + error.message;
            this.errSwal.show();
          }
        );
    } else {
      this.eventService
        .create({ event: e })
        .subscribe(
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
      topic: [this.event.topic, Validators.required],
      description: [this.event.description, Validators.required],
      event_type: [this.event.event_type, Validators.required],
      date: [this.event.date, Validators.required],
      frequence: [this.event.frequence, Validators.required],
      duration: [this.event.duration, Validators.required],
      state: [this.event.state, Validators.required],
    });
  }

  get topic() { return this.eventForm.get('topic'); }
  get description() { return this.eventForm.get('description'); }
  get event_type() { return this.eventForm.get('event_type'); }
  get date() { return this.eventForm.get('date'); }
  get frequence() { return this.eventForm.get('frequence'); }
  get duration() { return this.eventForm.get('duration'); }
  get state() { return this.eventForm.get('state'); }
}
