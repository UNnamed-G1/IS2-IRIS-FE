import { Component, OnChanges, ViewChild, Input, SimpleChanges } from '@angular/core';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { Swal } from 'app/classes/swal';

@Component({
  selector: 'app-generic-swal',
  templateUrl: './generic-swal.component.html',
  styleUrls: ['./generic-swal.component.css']
})
export class GenericSwalComponent implements OnChanges {
  @ViewChild('swal') private swal: SwalComponent;
  @Input() options: Swal;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.options) {
      return;
    }
    this.swal.title = this.options.title;
    this.swal.text = this.options.text;
    this.swal.type = this.options.type;
    this.swal.showConfirmButton = true;
    if (this.options.type == 'error' && !(this.options.errorMsg === false)) {
      this.swal.text = 'Mensaje de error: ' + this.swal.text;
    }
    this.swal.show();
  }

  confirmButtonClicked() {
    if (this.options.confirm) {
      this.options.confirm.apply(this.options.confirmParams[0]);
    }
  }

}
