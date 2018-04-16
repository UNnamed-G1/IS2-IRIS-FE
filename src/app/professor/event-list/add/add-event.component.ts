import { Component, OnInit, OnDestroy, ViewChild, AfterContentInit } from '@angular/core';
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
  @ViewChild('errLoad') private errLoad: SwalComponent;
  @ViewChild('sucAdd') private sucAdd: SwalComponent;
  @ViewChild('errAdd') private errAdd: SwalComponent;
  @ViewChild('sucUpd') private sucUpd: SwalComponent;
  @ViewChild('errUpd') private errUpd: SwalComponent;

  @select() auxiliarID;

  event: Event = new Event();

  constructor(private eventService: EventService,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>) { }

  ngOnInit() {
    this.permMan.validateSession(['Profesor']);
  }

  ngAfterContentInit() {
    this.auxiliarID.subscribe(id => {
      if (id) {
        this.eventService.get(id).subscribe((event: { event: Event }) => {
          this.event = event.event;
        });
      }
    });
  }

  ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR });
  }

  public onSubmit() {
    if (this.event.id) {
      this.eventService.
        update(this.event.id, { event: this.event }).
        subscribe(
          (response: { event: Event }) => {
            this.sucUpd.show();
          },
          (error: HttpErrorResponse) => {
            this.errUpd.text += error.message;
            this.errUpd.show();
          }
        );
    } else {
      this.eventService
        .create({ event: this.event })
        .subscribe(
          (response: { event: Event }) => {
            this.sucAdd.show();
            this.event = new Event();
          },
          (error: HttpErrorResponse) => {
            this.errAdd.text += error.message;
            this.errAdd.show();
          }
        );
    }
  }

}
