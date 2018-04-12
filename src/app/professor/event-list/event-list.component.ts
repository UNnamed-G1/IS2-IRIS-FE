import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ADD_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';
import { EventService } from 'app/services/event.service';
import { Event } from 'app/classes/events';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  @ViewChild('sucDelSwal') private sucDelSwal: SwalComponent;
  @ViewChild('errDelSwal') private errDelSwal: SwalComponent;  
  @ViewChild('errEventsSwal') private errEventsSwal: SwalComponent;

  headers: Array<string> = ['Tema', 'Descripción', 'Fecha', 'Grupo de investigación'];
  keys: Array<string> = ['topic', 'description', 'date', 'research_group_id']; // 'research_group_name'];
  events: Array<Event>;

  page: {
    actual: number,
    total: number
  };

  constructor(private permMan: PermissionManager,
    private eventService: EventService,
    private ngRedux: NgRedux<AppState>,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.permMan.validateSession(["profesor"]);
  }

  ngAfterContentInit() {
    this.route.queryParams.subscribe(params => {
      this.page = Object.assign({})
      this.page.actual = +params.page || 1;
      this.getEvents();
    })
  }

  update(id: number) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: id });
    this.router.navigateByUrl('/events/add');
  }

  delete(id: number) {
    this.eventService.delete(id)
      .subscribe(
        (response: {event: Event}) => {
          this.getEvents();
          this.sucDelSwal.show();
        },
        (error: HttpErrorResponse) => {
          this.errDelSwal.text += error.message;
          this.errDelSwal.show();
        }
      );
  }

  getEvents() {
    this.eventService.getAll(this.page.actual)
      .subscribe(
        (res: { events: Event[], total_pages: number }) => {
          this.events = res.events;
          this.page.total = res.total_pages;
        },
        (error: HttpErrorResponse) => {
          this.errEventsSwal.text += error.message;
          this.errEventsSwal.show();
        }
      );
  }
}
