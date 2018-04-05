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
  columns: Array<string> = ['research_group_id', 'topic', 'description', 'date'];
  rows: Array<Event>;

  page: number;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>) { }

  ngOnInit() {
    this.permMan.validateSession(["profesor"]);
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      this.page = +params['page'] || 1;
      this.eventService.getAll(this.page).subscribe((res: Event[]) => {
        console.log(res['events'])
        this.rows = res['events'];
      });
    })
  }

  public delete(id: number) {
    console.log("delete : " + id);
    this.eventService.delete(id).subscribe((r) => {
      this.rows = this.rows.filter((p, i) => {
        if (Number(id) === p.id) {
          return false;
        }
        return true;
      }, this.rows)
    });
  }

  public update(id: number) {
    console.log(id)
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: id });
    this.router.navigateByUrl('/events/add');
  }

  nextPage() {
    this.router.navigate(['/event-list'], { queryParams: { page: this.page + 1 } });
  }

  prevPage() {
    this.router.navigate(['/event-list'], { queryParams: { page: this.page - 1 } });
  }

  goToPage(page: number) {
    this.router.navigate(['/event-list'], { queryParams: { page: page } });
  }
}
