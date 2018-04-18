import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResearchSubject } from '../../classes/research-subject';
import { ResearchSubjectService } from '../../services/research-subject.service';

@Component({
  selector: 'app-research-subjects',
  templateUrl: './research-subjects.component.html',
  styleUrls: ['./research-subjects.component.css']
})
export class ResearchSubjectsComponent implements OnInit {
  columns = ['id', 'name'];
  rows: Array<ResearchSubject>;

  constructor() { }

  ngOnInit() {
  }

}
