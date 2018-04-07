import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

export class ResearchListComponent implements OnInit {
  columns: Array<string> = ['name', 'description', 'strategic_focus', 'research_priorities', 'foundation_date', 'classification', 'date_classification', 'url'];
  rows: Array<ResearchGroup>;
  public rgItem: ResearchGroup;
  public searchString: string;

  page: {
    actual: number,
    total: number
  };

  constructor(
    private researchGroupService: ResearchGroupService,
    private route: ActivatedRoute,
    private router: Router,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>) { }

  ngOnInit() {
    this.permMan.validateSession(["admin"]);
  }

  ngAfterContentInit() {
    this.route.queryParams.subscribe(params => {
      this.page = Object.assign({})
      this.page.actual = +params.page || 1;
      this.researchGroupService.getAll(this.page.actual)
        .subscribe((res: { research_groups: ResearchGroup[], total_pages: number }) => {
          this.rows = res.research_groups;
          this.page.total = res.total_pages;
        });
    })
  }

  public delete(id: number) {
    console.log("delete : " + id);
    this.researchGroupService.delete(id).subscribe((r) => {
      this.rows = this.rows.filter((p, i) => {
        if (Number(id) === p.id) {
          return false;
        }
        return true;
      }, this.rows)
    });
  }

  public update(id: number) {
    console.log(id)
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: id });
    this.router.navigateByUrl('/research-groups/add');
  }
}
