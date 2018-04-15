import { Component, ViewChild, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

import { select, NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { REMOVE_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';

import { FacultyService } from 'app/services/faculty.service';
import { DepartmentService } from 'app/services/department.service';
import { CareerService } from 'app/services/career.service';
import { UserService } from 'app/services/user.service';

import { User } from 'app/classes/user';
import { Faculty } from 'app/classes/faculty';
import { Department } from 'app/classes/department';
import { Career } from 'app/classes/career';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('errLoad') private errLoad: SwalComponent;
  @ViewChild('sucEdit') private sucEdit: SwalComponent;
  @ViewChild('errEdit') private errEdit: SwalComponent;

  @select() auxiliarID;
  user: User;
  faculties: Faculty[] = new Array<Faculty>();
  departments: Department[] = new Array<Department>();
  careers: Career[] = new Array<Career>();
  showInput = false;

  constructor(private userService: UserService,
    private facultyService: FacultyService,
    private departmentService: DepartmentService,
    private careerService: CareerService,
    private ngRedux: NgRedux<AppState>,
    private permMan: PermissionManager) { }

  ngOnInit() { // Validate existent id if not logged
  }

  ngAfterContentInit() {
    this.auxiliarID.subscribe(id => {
      if (id) {
        this.setUser(this.userService.get(id));
      } else if (this.permMan.validateLogged()) {
        this.userService.getCurrentUser().subscribe(
          (response: { user: User }) => {
            this.setUser(this.userService.get(response.user.id));
          },
          (error: HttpErrorResponse) => {
            this.errLoad.title += 'el perfil.';
            this.errLoad.text += error.message;
            this.errLoad.show();
          }
        );
      }
    });
    this.setFaculties();
  }

  ngOnDestroy() {
    this.ngRedux.dispatch({ type: REMOVE_AUXILIAR });
  }

  updateProfile() {
    this.userService.update(this.user.id, { user: this.user }).subscribe(
      (response: { event: Event }) => {
        this.sucEdit.show();
        this.toggleShowInput();
      },
      (error: HttpErrorResponse) => {
        this.errEdit.text += error.message;
        this.errEdit.show();
      }
    );
  }

  toggleShowInput() {
    this.showInput = !this.showInput;
  }

  careerClicked(career: Career) {
    this.user.career = career;
    this.user.career_id = career.id;
  }

  setUser(user) {
    user.subscribe(
      (response: { user: User }) => {
        this.user = Object.assign(new User(), response.user);
        if (this.user.career) {
          this.setDepartments(this.user.career_id);
          this.setCareers(this.user.career_id);
        }
      },
      (error: HttpErrorResponse) => {
        this.errLoad.text += error.message;
        this.errLoad.show();
      }
    );
  }

  setFaculties() {
    this.facultyService.get().subscribe(
      (response: { faculties: Array<Faculty> }) => {
        response.faculties.forEach(function (faculty) {
          this.faculties.push(Object.assign(new Faculty(), faculty));
        }, this);
      },
      (error: HttpErrorResponse) => {
        this.errLoad.title += 'las facultades.';
        this.errLoad.text += error.message;
        this.errLoad.show();
      }
    );
    this.faculties = new Array<Faculty>();
  }

  setDepartments(idFaculty: number) {
    this.departmentService.getByFaculty(idFaculty).subscribe(
      (response: { departments: Array<Department> }) => {
        response.departments.forEach(function (department) {
          this.departments.push(Object.assign(new Department(), department));
        }, this);
      },
      (error: HttpErrorResponse) => {
        this.errLoad.title += 'los departamentos.';
        this.errLoad.text += error.message;
        this.errLoad.show();
      }
    );
    this.departments = new Array<Department>();
    this.careers = new Array<Career>();
  }

  setCareers(idDepartment: number) {
    this.careerService.getByDepartment(idDepartment).subscribe(
      (response: { careers: Array<Career> }) => {
        response.careers.forEach(function (career) {
          this.careers.push(Object.assign(new Career(), career));
        }, this);
      },
      (error: HttpErrorResponse) => {
        this.errLoad.title += 'las carreras.';
        this.errLoad.text += error.message;
        this.errLoad.show();
      }
    );
    this.careers = new Array<Career>();
  }
}
