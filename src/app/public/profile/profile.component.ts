import { Component, ViewChild, OnInit, AfterContentChecked, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload';
import * as d3 from 'd3';

import { select, NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ISession } from 'app/redux/session';
import { REMOVE_AUXILIAR, ADD_SESSION, ADD_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';

import { environment } from 'environments/environment';
import { FacultyService } from 'app/services/faculty.service';
import { DepartmentService } from 'app/services/department.service';
import { CareerService } from 'app/services/career.service';
import { UserService } from 'app/services/user.service';
import { User, Career, Department, Faculty } from 'app/classes/_models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterContentChecked, OnDestroy {
  @ViewChild('sucSwal') private sucSwal: SwalComponent;
  @ViewChild('errSwal') private errSwal: SwalComponent;
  @select(['auxiliarID', 'user']) userID;
  @select(['session', 'id']) sessionID;
  user: User;
  faculties: Faculty[] = new Array<Faculty>();
  departments: Department[] = new Array<Department>();
  careers: Career[] = new Array<Career>();
  displayFollowers: boolean;
  showForm = false;
  profileForm: FormGroup;
  followersCount: number;
  followingCount: number;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;

  /*
  * Charts
  */
  statistics: number;
  publTypesChart = {
    options: { chart: {} },
    data: []
  };

  constructor(private userService: UserService,
    private facultyService: FacultyService,
    private departmentService: DepartmentService,
    private careerService: CareerService,
    private ngRedux: NgRedux<AppState>,
    private permMan: PermissionManager,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) {
    this.publTypesChart.options.chart = {
      type: 'pieChart',
      height: 250,
      x: d => d.label,
      y: d => d.value,
      valueFormat: d => d3.format('f')(d),
      showLegend: false,
      duration: 500
    };
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: { username: string }) => {
      if (params.username) {
        this.requestUser(this.userService.getByUsername(params.username), true);
      } else {
        this.userID.subscribe((userID: number) => {
          if (userID) {
            this.requestUser(this.userService.get(userID));
            this.userService.publicationsByUserAndType(userID).subscribe(
              (response: { num_publications_by_user_and_type: any }) => {
                const res = response.num_publications_by_user_and_type;
                const data = new Array<any>();
                Object.getOwnPropertyNames(res)
                  .map((key: string) => {
                    if (res[key] > 0) {
                      data.push({ label: key, value: res[key] });
                    }
                  });
                this.publTypesChart.data = data;
              }, (error: HttpErrorResponse) => {
                this.errSwal.title = 'Estadísticas no disponibles';
                this.errSwal.text = 'Mensaje de error: ' + error.message;
                this.errSwal.show();
              }
            );
          } else if (this.permMan.validateLogged()) {
            this.sessionID.subscribe((id) => {
              this.requestUser(this.userService.get(id));
            });
          }
        });
      }
    });
    this.setFaculties();
    this.uploader = new FileUploader({ queueLimit: 1 });
  }

  ngAfterContentChecked() {
    this.statistics = Object.getOwnPropertyNames(this)
      .filter((name: string) => name.endsWith('Chart'))
      .map((key: string) => this[key].data.length)
      .reduce((v1, v2) => v1 + v2);
  }

  ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR, remove: 'user' });
  }

  updateProfile() {
    if (this.profileForm.pristine && this.uploader.queue.length === 0) {
      this.toggleShowForm();
      return;
    }
    const fd = new FormData();
    const u = new User();
    if (this.profileForm.pristine) {
      u.username = this.user.username;
    } else {
      for (const k in this.profileForm.controls) {
        if (this.profileForm.get(k).dirty) {
          u[k] = this.profileForm.get(k).value;
        }
      }
      if (u['passwords']) {
        Object.assign(u, {
          password: u['passwords'].password,
          password_confirmation: u['passwords'].pass
        });
        delete u['passwords'];
      }
    }
    for (const key of Object.keys(u)) {
      fd.append('user[' + key + ']', u[key]);
    }
    if (this.uploader.queue.length === 1) {
      fd.append('picture', this.uploader.queue[0].file.rawFile);
    }
    this.userService.update(this.user.id, fd).subscribe(
      (response: { user: User }) => {
        this.sucSwal.title = 'Tu perfil ha sido actualizado';
        this.sucSwal.show();
        this.toggleShowForm();
        this.uploader.clearQueue();
        this.setUser(response.user);
        this.setSessionUser(response.user);
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'Tu perfil no ha podido ser actualizado';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
  }

  careerClicked(career: Career) {
    this.user.career = career;
    this.user.career_id = career.id;
  }

  requestUser(req, saveID?: boolean) {
    req.subscribe(
      (response: { user: User }) => {
        if (saveID) {
          this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: { user: response.user.id } });
        }
        this.setUser(response.user);
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'No se ha podido obtener el perfil';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
  }

  setUser(u: User) {
    this.user = u;
    if (u.photo) {
      Object.assign(this.user, { photo: environment.api_url + this.user.photo.picture });
    }
    if (u.career) {
      // this.setDepartments(this.user.career.id);
      // this.setCareers(this.user.career.id);
    }
    this.createProfileForm();
  }

  setSessionUser(u: User) {
    this.ngRedux.dispatch({
      type: ADD_SESSION,
      session: {
        name: u.full_name,
        type: u.user_type,
        username: u.username,
        photo: u.photo
      }
    });
  }

  setFaculties() {
    this.facultyService.get().subscribe(
      (response: { faculties: Array<Faculty> }) => {
        response.faculties.forEach(function (faculty: Faculty) {
          this.faculties.push(faculty);
        }, this);
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'No se han podido obtener las facultades';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
    this.faculties = new Array<Faculty>();
  }

  setDepartments(idFaculty: number) {
    this.departmentService.getByFaculty(idFaculty).subscribe(
      (response: { departments: Array<Department> }) => {
        response.departments.forEach(function (department: Department) {
          this.departments.push(department);
        }, this);
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'No se han podido obtener los departamentos';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
    this.departments = new Array<Department>();
    this.careers = new Array<Career>();
  }

  setCareers(idDepartment: number) {
    this.careerService.getByDepartment(idDepartment).subscribe(
      (response: { careers: Array<Career> }) => {
        response.careers.forEach(function (career: Career) {
          this.careers.push(career);
        }, this);
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'No se han podido obtener las carreras';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
    this.careers = new Array<Career>();
  }

  // Boolean displays edit form on true
  toggleShowForm() {
    this.showForm = !this.showForm;
  }

  // Boolean displays followers: true, following: false
  viewFollows(followers: boolean) {
    this.displayFollowers = followers;
  }

  // Setters for follows counters (Setted from follows component)
  setFollowersCount(count: number) {
    this.followersCount = count;
  }

  setFollowingCount(count: number) {
    this.followingCount = count;
  }

  // File drop zone
  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  // Form creation
  private createProfileForm() {
    this.profileForm = this.formBuilder.group({
      name: [this.user.name,
      [Validators.required, Validators.pattern('[A-Za-zÀ-ÿ ]*'),
      Validators.minLength(3), Validators.maxLength(100)]],
      lastname: [this.user.lastname,
      [Validators.required, Validators.pattern('[A-Za-zÀ-ÿ ]*'),
      Validators.minLength(3), Validators.maxLength(100)]],
      professional_profile: [this.user.professional_profile,
      [Validators.required, Validators.maxLength(5000)]],
      phone: [this.user.phone,
      [Validators.pattern('[0-9 +-]*'), Validators.minLength(7), Validators.maxLength(20)]],
      office: [this.user.office, [Validators.minLength(7), Validators.maxLength(20)]],
      cvlac_link: [this.user.cvlac_link],
      passwords: this.formBuilder.group({
        password: ['', [Validators.minLength(8)]],
        password_confirmation: ['', [Validators.minLength(8)]]
      }, { validator: this.passwordMatchValidator })
    });
  }

  private passwordMatchValidator(g: FormGroup) {
    const pass = g.get('password'),
      passConf = g.get('password_confirmation');
    if (pass.invalid || (passConf.invalid && passConf.errors.minlength)) {
      return { 'mismatch': true };
    }
    if (pass.dirty) {
      passConf.markAsDirty();
    }
    const ans = pass.value === passConf.value ? null : { 'mismatch': true };
    passConf.setErrors(ans);
    return ans;
  }

  get name() { return this.profileForm.get('name'); }
  get lastname() { return this.profileForm.get('lastname'); }
  get professional_profile() { return this.profileForm.get('professional_profile'); }
  get phone() { return this.profileForm.get('phone'); }
  get office() { return this.profileForm.get('office'); }
  get cvlac_link() { return this.profileForm.get('cvlac_link'); }
  get passwords() { return this.profileForm.get('passwords'); }
  get password() { return this.profileForm.get('passwords.password'); }
  get passwordConf() { return this.profileForm.get('passwords.password_confirmation'); }
}
