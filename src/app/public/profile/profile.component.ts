import { Component, ViewChild, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('inputImage') private inputImg: ElementRef;
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
  allowedTypes = ['image/png', 'image/gif', 'image/jpeg'];
  imageEncoded: string;
  imageEncodedCropped: string;
  displayCropperDialog = false;

  constructor(private userService: UserService,
    private facultyService: FacultyService,
    private departmentService: DepartmentService,
    private careerService: CareerService,
    private ngRedux: NgRedux<AppState>,
    private permMan: PermissionManager,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: { username: string }) => {
      if (params.username) {
        this.requestUser(this.userService.getByUsername(params.username), true);
      } else {
        this.userID.subscribe((userID: number) => {
          if (userID) {
            this.requestUser(this.userService.get(userID));
          } else if (this.permMan.validateLogged()) {
            this.sessionID.subscribe((id) => {
              this.requestUser(this.userService.get(id), true);
            });
          }
        });
      }
    });
    this.userID.subscribe((userID: number) => {
      this.sessionID.subscribe((id) => {
        this.setFaculties();
      });
    });
  }

  ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR, remove: 'user' });
  }

  updateProfile() {
    if (this.profileForm.pristine && this.imageEncodedCropped === undefined) {
      this.toggleShowForm();
      return;
    }
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
    const fd = new FormData();
    for (const key of Object.keys(u)) {
      fd.append('user[' + key + ']', u[key]);
    }
    if (this.imageEncodedCropped) {
      fd.append('picture', this.base64toFile(this.imageEncodedCropped, 'File'));
    }
    this.userService.update(this.user.id, fd).subscribe(
      (response: { user: User }) => {
        this.sucSwal.title = 'Tu perfil ha sido actualizado';
        this.sucSwal.show();
        this.toggleShowForm();
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
    this.user = Object.assign({}, this.user, u);
    if (u.photo) {
      Object.assign(this.user, { photo: environment.api_url + this.user.photo.picture });
    }
    if (u.career) {
      // this.setDepartments(this.user.career.id);
      // this.setCareers(this.user.career.id);
    }
    this.createProfileForm();
  }

  // On edited sets session too
  setSessionUser(u: User) {
    this.ngRedux.dispatch({
      type: ADD_SESSION,
      session: {
        id: u.id,
        name: u.full_name,
        type: u.user_type,
        username: u.username,
        photo: environment.api_url + u.photo.picture
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

  // Loaded file event
  fileChangeEvent(event: any) {
    const file = event.target.files[0];
    // Verify file loaded (Select file cancel will throw undefined file)
    if (file) {
      // Verify type
      if (this.allowedTypes.includes(file.type)) {
        // Verify size
        const reader = new FileReader();
        const img = new Image;
        const _this = this;
        reader.onloadend = () => {
          img.onload = () => {
            if (img.width >= 20 && img.height >= 20) {
              // Open ImageCropper dialog
              _this.displayCropperDialog = true;
              _this.imageEncoded = img.src;
            } else {
              _this.errSwal.title = 'La imagen es demasiado pequeña';
              _this.errSwal.text = 'Asegurate de que el tamaño sea de al menos 20x20 pixeles';
              _this.errSwal.show();
            }
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.errSwal.title = 'El tipo de archivo es inválido';
        this.errSwal.text = 'Sólo se permiten imágenes jpg, png o gif';
        this.errSwal.show();
      }
    }
  }

  // Sets on image cropped event
  croppedImage(image: string) {
    this.displayCropperDialog = false;
    this.imageEncodedCropped = image;
  }

  notCroppedImage() {
    this.displayCropperDialog = false;
    // Reset FileList of images of the input
    this.inputImg.nativeElement['value'] = '';
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

  // Convert b64 to file
  base64toFile(base64: string, filename: string): File {
    const arr = base64.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    for (let i = n; i >= 0; i--) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new File([u8arr], filename + '.' + mime.split('/')[1], { type: mime });
  }
}
