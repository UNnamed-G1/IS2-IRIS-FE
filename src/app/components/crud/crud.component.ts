import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent {
  @Input() columns: Array<string>;
  @Input() keys = new Array<string>();
  @Input() rows: {};
  @Output() onUpdate = new EventEmitter<number>();
  @Output() onDelete = new EventEmitter<number>();
  @Output() onDetails = new EventEmitter<number>();

  searchStr: string;

  constructor() { }

  update(id: number) {
    this.onUpdate.emit(id);
  }

  delete(id: number) {
    this.onDelete.emit(id);
  }
  details(id: number) {
    this.onDetails.emit(id);
  }
}
