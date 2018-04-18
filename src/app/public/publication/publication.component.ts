import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ADD_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';
import { PublicationService } from 'app/services/publication.service';
import { Publication } from 'app/classes/publication';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css']
})
export class PublicationComponent implements OnInit {
  @ViewChild('sucDelSwal') private sucDelSwal: SwalComponent;
  @ViewChild('errDelSwal') private errDelSwal: SwalComponent;
  @ViewChild('errUsersSwal') private errUsersSwal: SwalComponent;

  headers: Array<string> = ['Nombre', 'Fecha', 'Abstract',
     'Corta descripción', 'Tipo de Publicación','Fecha Creación','Fecha de actualización','documentos'];
  keys: Array<string> = ['name', 'date', 'abstract', 'brief_description', 'type_pub', 'created_at', 'update_at','document'];
  publications: Array<Publication>;

  page: {
    actual: number,
    total: number
  };

  constructor(private permMan: PermissionManager,
    private publicationService: PublicationService,
    private ngRedux: NgRedux<AppState>,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.permMan.validateSession(["Admin"]);
  }



  update(id: string) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: id });
    this.router.navigateByUrl('/publications/add');
  }


}
