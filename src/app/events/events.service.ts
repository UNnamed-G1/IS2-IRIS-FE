import { Injectable } from '@angular/core';
import { CommonService } from '../common.service'
import { Event } from './events';

@Injectable()
export class EventService {

	constructor(private commonService: CommonService){}

	getEvents(){
		return this.commonService.get("events");
	}

	getEventsNews(){
		return this.commonService.get("events_news");
	}
}