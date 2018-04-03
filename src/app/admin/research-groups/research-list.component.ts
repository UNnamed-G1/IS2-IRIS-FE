import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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
  columns: Array<string> = ['id', 'name', 'description', 'strategic_focus', 'research_priorities', 'foundation_date', 'classification', 'date_classification', 'url'];
  rows: Array<ResearchGroup>;
  constructor(
    private researchGroupService: ResearchGroupService,
    private router: Router,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>) { }

    ngOnInit() {
      if (this.permMan.validateSession(["admin"])) {
        this.researchGroupService.get().subscribe((res: ResearchGroup[]) => {
          this.rows = res['research_groups'];
        });
      }
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

    public update(id: string) {
      this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: id });
      this.router.navigateByUrl('/research-groups/add');
    }
}
