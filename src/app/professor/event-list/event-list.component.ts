import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
        r => this.getEvents(),
        error => { });
  }

  getEvents() {
    this.eventService.getAll(this.page.actual)
      .subscribe((res: { events: Event[], total_pages: number }) => {
        this.events = res.events;
        this.page.total = res.total_pages;
      }, error => { });
  }
}
