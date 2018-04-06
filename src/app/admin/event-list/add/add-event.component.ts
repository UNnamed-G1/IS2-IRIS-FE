import { Component, OnInit, OnDestroy } from '@angular/core';
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
  event: Event;

  constructor(private eventService: EventService,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>) { }
    ngOnInit() {
      this.event = new Event();
      this.permMan.validateSession(["profesor"]);
    }
    ngAfterViewInit() {
      this.auxiliarID.subscribe(id => {
        if (id) {
          this.eventService.get(id).subscribe((event: { event: Event }) => {
            this.event = event.event;
          });
        }
      });
    }

    ngOnDestroy() {
      this.ngRedux.dispatch({ type: REMOVE_AUXILIAR })
    }

    public onSubmit() {
      console.log("Adding an Event: " + this.event.id);
      if (this.event.id) {
        this.eventService.update(this.event.id, { user: this.event }).subscribe(r => {
          console.log(r);
          alert("Event Updated !");
        })
      } else {
        this.eventService.create({ event: this.event }).subscribe(r => {
          console.log(r);
          alert("Event Added !");
        });
      }
    }

}
