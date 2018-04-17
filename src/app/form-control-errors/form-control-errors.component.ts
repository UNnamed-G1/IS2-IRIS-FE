import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-control-errors',
  templateUrl: './form-control-errors.component.html',
  styleUrls: ['./form-control-errors.component.css']
})
export class FormControlErrorsComponent {
  // FormControl
  @Input() control: FormControl;
  // Feedbacks - Add more if needed
  @Input() required: string;
  @Input() pattern: string;
  @Input() minLength: string;
  @Input() maxLength: string;

  constructor() { }

}
