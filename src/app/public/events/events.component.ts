import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Event } from 'app/classes/events';
import { EventService } from 'app/services/event.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  columns = ['research_group_id', 'topic', 'description', 'date'];
  rows: Array<Event>;
  news: Array<Event>;
  item_active : Event;
  items : Array<Event>;

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit() { };

  ngAfterViewInit() {
    this.eventService.get().subscribe((res: Event[]) => {
      console.log(res['events'])
      this.rows = res['events'];
    });
    this.eventService.getNews().subscribe((res: Event[]) => {
      console.log(res['events'])
      this.news = res['events'];
      this.item_active = this.news[0];
      for (var i = 1; i < this.news.length; ++i) {
        this.items[i-1] = this.news[i];
      }
    });
  }
}
