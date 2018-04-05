import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  item_active: Event;
  items: Array<Event>;

  page: number;

  constructor(private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() { };

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      this.page = +params['page'] || 1;
      this.eventService.getAll(this.page).subscribe((res: Event[]) => {
        console.log(res['events'])
        this.rows = res['events'];
      });
    })
    this.eventService.getNews().subscribe((res: Event[]) => {
      console.log(res['events'])
      this.news = res['events'];
      this.item_active = this.news[0];
      for (var i = 1; i < this.news.length; ++i) {
        this.items[i - 1] = this.news[i];
      }
    });
  }

  nextPage() {
    this.router.navigate(['/events'], { queryParams: { page: this.page + 1 } });
  }

  prevPage() {
    this.router.navigate(['/events'], { queryParams: { page: this.page - 1 } });
  }

  goToPage(page: number) {
    this.router.navigate(['/events'], { queryParams: { page: page } });
  }
}
