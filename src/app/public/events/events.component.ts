import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

import { NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ADD_AUXILIAR } from 'app/redux/actions';

import { environment } from 'environments/environment';
import { Event } from 'app/classes/_models';
import { EventService } from 'app/services/event.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  @ViewChild('errSwal') private errSwal: SwalComponent;

  rows: Array<Event>;
  news: Array<Event>;
  item_active: Event;
  items: Array<Event>;
  url: string;
  page: {
    actual: number,
    total: number
  };

  constructor(private eventService: EventService,
    private route: ActivatedRoute, private router: Router, private ngRedux: NgRedux<AppState>) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.page = Object.assign({
        actual: +params.page || 1
      });
      this.eventService.getAll(this.page.actual).subscribe(
        (response: { events: Event[], total_pages: number }) => {
          response.events.map(e => {
            if (e.photos) {
              Object.assign(e, { photo: environment.api_url + e.photos[0].picture['url'] });
              delete e.photos;
            }
          });
          this.rows = response.events;
          this.page.total = response.total_pages;
        },
        (error: HttpErrorResponse) => {
          this.errSwal.title = 'No se han podido obtener los eventos';
          this.errSwal.text = 'Mensaje de error: ' + error.message;
          this.errSwal.show();
        }
      );
    });
    this.eventService.getNews().subscribe(
      (response: { events: Event[], total_pages: number }) => {
        this.news = response.events;
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
