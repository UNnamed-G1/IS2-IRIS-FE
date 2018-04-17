import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'app/classes/events';
import { EventService } from 'app/services/event.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  @ViewChild('errSwal') private errSwal: SwalComponent;

  columns = ['research_group_id', 'topic', 'description', 'date'];
  rows: Array<Event>;
  news: Array<Event>;
  item_active: Event;
  items: Array<Event>;

  page: {
    actual: number,
    total: number
  };

  constructor(private eventService: EventService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.page = Object.assign({});
      this.page.actual = +params.page || 1;
      this.eventService.getAll(this.page.actual)
        .subscribe(
          (res: { events: Event[], total_pages: number }) => {
            this.rows = res.events;
            this.page.total = res.total_pages;
          },
          (error: HttpErrorResponse) => {
            this.errSwal.title = 'No se han podido obtener los eventos';
            this.errSwal.text = 'Mensaje de error: ' + error.message;
            this.errSwal.show();
          }
        );
    });
    this.eventService.getNews()
      .subscribe(
        (res: { events: Event[], total_pages: number }) => {
          this.news = res.events;
          this.items = new Array<Event>();
          this.item_active = this.news[0];
          for (let i = 1; i < this.news.length; ++i) {
            this.items[i - 1] = this.news[i];
          }
        },
        (error: HttpErrorResponse) => {
          this.errSwal.title = 'No se han podido obtener las noticias';
          this.errSwal.text = 'Mensaje de error: ' + error.message;
          this.errSwal.show();
        }
      );
  }
}
