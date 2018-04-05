import { Component, OnInit } from '@angular/core';

import { select } from '@angular-redux/store';
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
export class ProfileComponent implements OnInit {
  @select() auxiliarID;
  user: User;
  faculties: Faculty[] = new Array<Faculty>();
  departments: Department[] = new Array<Department>();
  careers: Career[] = new Array<Career>();
  showInput: boolean = false;

  constructor(private userService: UserService,
    private facultyService: FacultyService,
    private departmentService: DepartmentService,
    private careerService: CareerService,
    private permMan: PermissionManager) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.auxiliarID.subscribe(id => {
      let getUser;
      if (id) {
        this.setUser(this.userService.get(id));
      } else if (this.permMan.validateLogged()) {
        this.userService.getCurrentUser().subscribe((response: { user: User }) => {
          this.setUser(this.userService.get(response.user.id));
        });
      }
    });
    this.setFaculties();
  }

  updateProfile() {
    this.userService.update(this.user.id, { user: this.user }).subscribe(
      response => console.log(response),
      error => console.error(error)
    );
    this.toggleShowInput();
  }

  toggleShowInput() {
    this.showInput = !this.showInput
  }

  careerClicked(career: Career) {
    this.user.career = career;
    this.user.career_id = career.id;
  }

  setUser(user) {
    user.subscribe((response: { user: User }) => {
      this.user = Object.assign(new User(), response.user);
      console.log(this.user);
      if (this.user.career) {
        this.setDepartments(this.user.career_id)
        this.setCareers(this.user.career_id)
      }
    });
  }

  setFaculties() {
    this.facultyService.get().subscribe(
      (response: { faculties: Array<Faculty> }) => {
        response.faculties.forEach(function(faculty) {
          this.faculties.push(Object.assign(new Faculty(), faculty))
        }, this);
      },
      error => console.log(error)
    );
    this.faculties = new Array<Faculty>();
  }

  setDepartments(idFaculty: number) {
    this.departmentService.getByFaculty(idFaculty).subscribe(
      (response: { departments: Array<Department> }) => {
        response.departments.forEach(function(department) {
          this.departments.push(Object.assign(new Department(), department))
        }, this);
      },
      error => console.log(error)
    );
    this.departments = new Array<Department>();
    this.careers = new Array<Career>();
  }

  setCareers(idDepartment: number) {
    this.careerService.getByDepartment(idDepartment).subscribe(
      (response: { careers: Array<Career> }) => {
        response.careers.forEach(function(career) {
          this.careers.push(Object.assign(new Career(), career))
        }, this);
      },
      error => console.log(error)
    );
    this.careers = new Array<Career>();
  }
}
