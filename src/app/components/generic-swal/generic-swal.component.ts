import { Component, OnChanges, ViewChild, Input, SimpleChanges } from '@angular/core';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { SweetAlertType } from 'sweetalert2';

@Component({
  selector: 'app-generic-swal',
  templateUrl: './generic-swal.component.html',
  styleUrls: ['./generic-swal.component.css']
})
export class GenericSwalComponent implements OnChanges {
  @ViewChild('swal') private swal: SwalComponent;
  @Input() options: {
    title: string,
    text: string,
    type: SweetAlertType
  };

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.options) {
      return;
    }
    this.swal.title = this.options.title;
    this.swal.text = this.options.text;
    this.swal.type = this.options.type;
    if (this.options.type == 'error') {
      this.swal.text = 'Mensaje de error: ' + this.swal.text;
    }
    this.swal.show();
  }

}
