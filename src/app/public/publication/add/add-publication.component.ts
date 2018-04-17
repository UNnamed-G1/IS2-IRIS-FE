import { Component, OnInit, OnDestroy, AfterContentInit, ViewChild } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { AppState } from 'app/redux/store';
import { REMOVE_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';
import { PublicationService } from 'app/services/publication.service';
import { Publication } from 'app/classes/publication';

@Component({
  selector: 'app-add-publication',
  templateUrl: './add-publication.component.html',
  styleUrls: ['./add-publication.component.css']
})
export class AddPublicationComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('errLoad') private errLoad: SwalComponent;
  @ViewChild('sucAdd') private sucAdd: SwalComponent;
  @ViewChild('errAdd') private errAdd: SwalComponent;
  @ViewChild('sucUpd') private sucUpd: SwalComponent;
  @ViewChild('errUpd') private errUpd: SwalComponent;

  @select() auxiliarID;

  publication: Publication = new Publication();

  constructor(private publicationService: PublicationService,
    private permMan: PermissionManager,
    private ngRedux: NgRedux<AppState>) { }

  ngOnInit() {
    this.permMan.validateSession(['Admin']);
  }

  ngAfterContentInit() {
    this.auxiliarID.subscribe(id => {
      if (id) {
        this.publicationService.get(id).subscribe((publication: { publication: Publication }) => {
          this.publication = publication.publication;
        });
      }
    });
  }

  ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR });
  }

  public onSubmit() {
    if (this.publication.id) {
      this.publicationService
        .update(this.publication.id, { publication: this.publication })
        .subscribe(
          (response: { publication: Publication }) => {
            this.sucUpd.show();
          },
          (error: HttpErrorResponse) => {
            this.errUpd.text += error.message;
            this.errUpd.show();
          }
        );
    } else {
      this.publicationService
        .create({ publication: this.publication })
        .subscribe(
          (response: { publication: Publication }) => {
            this.sucAdd.show();
            this.publication = new Publication();
          },
          (error: HttpErrorResponse) => {
            this.errAdd.text += error.message;
            this.errAdd.show();
          }
        );
    }
  }

}
