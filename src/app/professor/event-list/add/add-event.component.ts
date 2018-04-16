import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
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
export class AddEventComponent implements OnInit, OnDestroy {
  @select() auxiliarID;
  event: Event = new Event();
  eventForm: FormGroup;

  constructor(private eventService: EventService,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.permMan.validateSession(["profesor"]);
  }

  ngAfterContentInit() {
    this.auxiliarID.subscribe(id => {
      if (id) {
        this.eventService.get(id).subscribe((event: { event: Event }) => {
          this.event = event.event;
          this.createEventForm();
        });
      }
    });
    this.createEventForm();
  }

  ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR })
  }

  public onSubmit() {
    if (this.eventForm.pristine) {
      return;
    }
    const e = new Event();
    for (const k in this.eventForm.controls) {
      if (this.eventForm.get(k).dirty) {
        e[k] = this.eventForm.get(k).value;
      }
    }
    if (this.event.id) {
      this.eventService.update(this.event.id, { user: e })
        .subscribe(
          (response: { event: Event }) => {
            Object.assign(this.event, response.event);
            this.createEventForm();
          })
    } else {
      this.eventService.create({ event: e }).subscribe(r => {
        this.eventForm.reset();
      });
    }
  }

  private createEventForm() {
    this.eventForm = this.formBuilder.group({
      topic: [this.event.topic, Validators.required],
      description: [this.event.description, Validators.required],
      type_ev: [this.event.type_ev, Validators.required],
      date: [this.event.date, Validators.required],
      frequence: [this.event.frequence, Validators.required],
      duration: [this.event.duration, Validators.required],
      state: [this.event.state, Validators.required],
    });
  }

  get topic() { return this.eventForm.get('topic'); }
  get description() { return this.eventForm.get('description'); }
  get type_ev() { return this.eventForm.get('type_ev'); }
  get date() { return this.eventForm.get('date'); }
  get frequence() { return this.eventForm.get('frequence'); }
  get duration() { return this.eventForm.get('duration'); }
  get state() { return this.eventForm.get('state'); }
}
