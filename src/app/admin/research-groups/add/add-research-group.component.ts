import { Component, OnInit, OnDestroy, ViewChild, AfterContentInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { NgRedux, select } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { REMOVE_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';
import { ResearchGroup } from 'app/classes/research-group';
import { ResearchGroupService } from 'app/services/research-group.service';

@Component({
  selector: 'app-add-research-group',
  templateUrl: './add-research-group.component.html',
  styleUrls: ['./add-research-group.component.css']
})


export class AddResearchGroupComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('errLoadSwal') private errLoadSwal: SwalComponent;
  @ViewChild('sucAddSwal') private sucAddSwal: SwalComponent;
  @ViewChild('errAddSwal') private errAddSwal: SwalComponent;
  @ViewChild('sucUpdSwal') private sucUpdSwal: SwalComponent;
  @ViewChild('errUpdSwal') private errUpdSwal: SwalComponent;

  @select() auxiliarID;

  researchGroup: ResearchGroup = new ResearchGroup();

  constructor(private permMan: PermissionManager,
    private researchGroupService: ResearchGroupService,
    private ngRedux: NgRedux<AppState>) { }

  ngOnInit() {
    this.permMan.validateSession(['admin']);
  }

  ngAfterContentInit() {
    this.auxiliarID.subscribe((id: number) => {
      if (id) {
        this.researchGroupService.get(id)
          .subscribe(
            (researchGroup: { research_group: ResearchGroup }) => {
              this.researchGroup = researchGroup.research_group;
            },
            (error: HttpErrorResponse) => {
              this.errLoadSwal.text += error.message;
              this.errLoadSwal.show();
            }
          );
      }
    });
  }

  ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR });
  }

  onSubmit() {
    if (this.researchGroup.id) {
      this.researchGroupService
        .update(this.researchGroup.id, { research_group: this.researchGroup })
        .subscribe(
          (response: { research_group: ResearchGroup }) => {
            this.sucUpdSwal.show();
          },
          (error: HttpErrorResponse) => {
            this.errUpdSwal.text += error.message;
            this.errUpdSwal.show();
          }
        );
    } else {
      this.researchGroupService
        .create({ research_group: this.researchGroup })
        .subscribe(
          (response: { research_group: ResearchGroup }) => {
            this.sucAddSwal.show();
            this.researchGroup = new ResearchGroup();
          },
          (error: HttpErrorResponse) => {
            this.errAddSwal.text += error.message;
            this.errAddSwal.show();
          }
        );
    }
  }
}
