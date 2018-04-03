import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Event } from './events';
import { EventService } from './events.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
    columns = ['research_group_id','topic','description','date'];
  	rows : Array<Event>;
    news : Array<Event>;

  	constructor(private researchGrousService: EventService ,private  router : Router) {}

  	ngOnInit() {
    	this.researchGrousService.get("events").subscribe((res : Event[]) => {
      		console.log(res['events'])
      		this.rows = res['events'];
    	});
      this.researchGrousService.get("events_news").subscribe((res : Event[]) => {
          console.log(res['events'])
          this.news = res['events'];
      });
  	};
}
