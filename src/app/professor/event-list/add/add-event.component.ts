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
  @ViewChild('errLoadSwal') private errLoadSwal: SwalComponent;
  @ViewChild('sucAddSwal') private sucAddSwal: SwalComponent;
  @ViewChild('errAddSwal') private errAddSwal: SwalComponent;
  @ViewChild('sucUpdSwal') private sucUpdSwal: SwalComponent;
  @ViewChild('errUpdSwal') private errUpdSwal: SwalComponent;

  @select() auxiliarID;

  event: Event = new Event();

  constructor(private eventService: EventService,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>) { }

  ngOnInit() {
    this.permMan.validateSession(['profesor']);
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
            this.sucUpdSwal.show();
          },
          (error: HttpErrorResponse) => {
            this.errUpdSwal.text += error.message;
            this.errUpdSwal.show();
          }
        );
    } else {
      this.eventService
        .create({ event: this.event })
        .subscribe(
          (response: { event: Event }) => {
            this.sucAddSwal.show();
            this.event = new Event();
          },
          (error: HttpErrorResponse) => {
            this.errAddSwal.text += error.message;
            this.errAddSwal.show();
          }
        );
    }
  }

}
