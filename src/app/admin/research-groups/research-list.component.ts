import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ADD_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';
import { ResearchGroupService } from 'app/services/research-group.service';
import { ResearchGroup } from 'app/classes/research-group';

@Component({
  selector: 'app-research-list',
  templateUrl: './research-list.component.html',
  styleUrls: ['./research-list.component.css']
})
export class ResearchListComponent implements OnInit, AfterContentInit {
  @ViewChild('sucDel') private sucDel: SwalComponent;
  @ViewChild('errDel') private errDel: SwalComponent;
  @ViewChild('errRGs') private errRGs: SwalComponent;

  headers: Array<string> = ['Nombre', 'Descripción', 'Enfoque estratégico',
    'Prioridades de investigación', 'Fecha de fundación', 'Clasificación',
    'Fecha de clasificación', 'URL'];
  keys: Array<string> = ['name', 'description', 'strategic_focus',
    'research_priorities', 'foundation_date', 'classification',
    'classification_date', 'url'];
  researchGroups: Array<ResearchGroup>;

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
    this.permMan.validateSession(['Admin']);
  }

  ngAfterContentInit() {
    this.route.queryParams.subscribe(params => {
      this.page = Object.assign({});
      this.page.actual = +params.page || 1;
      this.getResearchGroups();
    });
  }

  update(id: number) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: id });
    this.router.navigateByUrl('/research-groups/add');
  }
  
  details(id: number) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: id });
    this.router.navigateByUrl('/rg');
  }

  delete(id: number) {
    this.researchGroupService.delete(id)
      .subscribe(
        (response: { research_group: ResearchGroup }) => {
          this.getResearchGroups();
          this.sucDel.show();
        },
        (error: HttpErrorResponse) => {
          this.errDel.text += error.message;
          this.errDel.show();
        }
      );
  }

  getResearchGroups() {
    this.researchGroupService.getAll(this.page.actual)
      .subscribe(
        (res: { research_groups: ResearchGroup[], total_pages: number }) => {
          this.researchGroups = res.research_groups;
          this.page.total = res.total_pages;
        },
        (error: HttpErrorResponse) => {
          this.errRGs.text += error.message;
          this.errRGs.show();
        }
      );
  }
}
