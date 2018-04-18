import { Component, OnInit, OnDestroy, AfterContentInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { AppState } from 'app/redux/store';
import { REMOVE_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';
import { PublicationService } from 'app/services/publication.service';
import { Publication } from 'app/classes/publication';
import { DataService } from 'app/services/data.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA} from '@angular/material';
import { MatFormFieldModule, MatInputModule,MatIconModule } from '@angular/material';
import { MatDialogRef,MatDialogModule,MatDialog} from '@angular/material/dialog';


@Component({
  templateUrl: './add-publication.component.html',
  styleUrls: ['./add-publication.component.css']
})

export class AddPublicationComponent implements OnInit, OnDestroy {
  @ViewChild('sucSwal') private sucSwal: SwalComponent;
  @ViewChild('errSwal') private errSwal: SwalComponent;
  @select() auxiliarID;

  fileName:string;
  fileList: FileList;
  file:File;
  fileReader: FileReader = new FileReader();
  uploadPublicationResponse$;
  publicationForm: FormGroup;
  publication: Publication = new Publication();
  type_pubs: string[] = ['monografia', 'patente', 'libro', 'articulo', 'tesis','software'];

  constructor(private publicationService: PublicationService,
    public dialogRef: MatDialogRef<AddPublicationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private dataService :DataService,
    private permMan: PermissionManager,
    private formBuilder: FormBuilder,
    private ngRedux: NgRedux<AppState>) { }

    ngOnInit() {
      this.permMan.validateSession(['Admin']);
    }

      ngOnDestroy() {
      this.ngRedux.dispatch({ type: REMOVE_AUXILIAR });
    }

    fileChange(event) {
    this.fileList = event.target.files;
    if(this.fileList.length > 0) {
        this.file = this.fileList[0];
        this.fileName = this.file.name;
      }
    }

    uploadRequested = false;

    onSubmit(){
      this.uploadPublicationResponse$ = this.publicationService.uploadPublication(this.uploadForm.value,this.file);
      this.uploadRequested = true;
      this.uploadPublicationResponse$.subscribe(
        res => {
          if (res.status == 200){
            this.uploadRequested = false
            this.dialogRef.close( )
          }
        },
        err => {
          console.log( err );
        }
      );
    }
    uploadForm = new FormGroup({
      name: new FormControl(null,[Validators.required]),
      date: new FormControl(null,[Validators.required]),
      abstract: new FormControl(null,[Validators.required]),
      brief_description: new FormControl(null,[Validators.required]),
      type_pub: new FormControl(null,[Validators.required]),
      created_at: new FormControl(null,[Validators.required]),
      updated_at: new FormControl(null,[Validators.required]),
      document: new FormControl(null,[Validators.required]),
    });
}
