import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

import { NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ADD_AUXILIAR } from 'app/redux/actions';

import { environment } from 'environments/environment';
import { PermissionManager } from 'app/permission-manager';
import { ResearchGroupService } from 'app/services/research-group.service';
import { ResearchGroup } from 'app/classes/_models';

@Component({
  selector: 'app-research-list',
  templateUrl: './research-list.component.html',
  styleUrls: ['./research-list.component.css']
})
<<<<<<< HEAD
export class ResearchListComponent implements OnInit {
  @ViewChild('sucSwal') private sucSwal: SwalComponent;
  @ViewChild('errSwal') private errSwal: SwalComponent;
=======
export class ResearchListComponent implements OnInit, AfterContentInit {
>>>>>>> c9fa19ea31945c92ea4303aad2a852576c45e039

  headers: Array<string> = ['Nombre', 'Descripción', 'Enfoque estratégico',
    'Prioridades de investigación', 'Fecha de fundación', 'Clasificación',
    'Fecha de clasificación', 'URL'];
  keys: Array<string> = ['name', 'description', 'strategic_focus',
    'research_priorities', 'foundation_date', 'classification',
    'date_classification', 'url'];
  researchGroups: Array<ResearchGroup>;
  historyReportURL = environment.api_url + 'reports/research_groups_history.pdf';
  PDF = false;
  swalOpts: any;
  page: {
    actual: number,
    total: number
  };

  constructor(private permMan: PermissionManager,
    private researchGroupService: ResearchGroupService,
    private ngRedux: NgRedux<AppState>,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    if (this.permMan.validateSession(['Administrador'])) {
      this.route.queryParams.subscribe(params => {
        this.page = Object.assign({
          actual: +params.page || 1
        });
        this.getResearchGroups();
      });
    }
  }

  update(id: number) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: { researchGroupUpdate: id } });
    this.router.navigateByUrl('/research-groups/add');
  }

  details(id: number) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: { researchGroup: id } });
    this.router.navigateByUrl('/rg');
  }

  pdfMode() {
    this.PDF = !this.PDF;
  }

  delete(id: number) {
    this.researchGroupService.delete(id).subscribe(
      (response: { research_group: ResearchGroup }) => {
        this.getResearchGroups();
        this.swalOpts = { title: 'El grupo de investigación ha sido eliminado', type: 'success'};

      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'Grupo de investigación no eliminado', text: error.message, type: 'error' };

      }
    );
  }

  getResearchGroups() {
    this.researchGroupService.getAll(this.page.actual).subscribe(
      (response: { research_groups: ResearchGroup[], total_pages: number }) => {
        this.researchGroups = response.research_groups;
        this.page.total = response.total_pages;
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'No se han podido obtener los grupos de investigación', text: error.message, type: 'error' };

      }
    );
  }
}
