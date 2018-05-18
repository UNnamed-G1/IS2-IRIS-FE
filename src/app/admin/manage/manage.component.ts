import { Component, OnInit } from '@angular/core';
import { PermissionManager } from 'app/permission-manager';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  constructor(private permMan: PermissionManager) { }

  ngOnInit() {
    this.permMan.validateSession(['Administrador']);
  }

}
