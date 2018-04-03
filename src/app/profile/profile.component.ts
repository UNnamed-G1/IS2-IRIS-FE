import { Component, OnInit } from '@angular/core';

import { select } from '@angular-redux/store';
import { PermissionManager } from '../permission-manager';

import { FacultyService } from 'app/services/faculty.service'
import { DepartmentService } from 'app/services/department.service'
import { CareerService } from 'app/services/career.service'
import { UserService } from 'app/users/user.service'

import { User } from '../users/user';
import { Faculty } from 'app/classes/faculty'
import { Department } from 'app/classes/department'
import { Career } from 'app/classes/career'

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

  ngOnInit() {
    this.facultyService.getAll().subscribe(
      (response: { faculties: {} }) => this.addFaculties(response.faculties),
      error => console.log(error)
    );
    this.departmentService.getByFaculty(4).subscribe(
      (response: { departments: {} }) => this.addDepartments(response.departments),
      error => console.log(error)
    );
    this.careerService.getByDepartment(10).subscribe(
      (response: { careers: {} }) => this.addCareers(response.careers),
      error => console.log(error)
    );
    if (this.permMan.validateLogged()) {
      this.auxiliarID.subscribe(id => {
        let getUser = (id) ? this.userService.getUser(id) : this.userService.getCurrentUser();
        getUser.subscribe((user: { user: User }) => {
          this.user = new User();
          Object.assign(this.user, user.user);
          console.log(this.user)
        });
      });
    }
  }

  updateProfile() {
    this.userService.updateUser(this.user.id, this.user).subscribe(
      response => console.log(response),
      error => console.error(error)
    );
    this.toggleShowInput();
  }

  toggleShowInput() {
    this.showInput = !this.showInput
  }

  addFaculties(faculties) {
    this.faculties = new Array<Faculty>();
    faculties.forEach(function(faculty) {
      this.faculties.push(Object.assign(new Faculty(), faculty))
    }, this);
  }

  addDepartments(departments) {
    this.departments = new Array<Department>();
    departments.forEach(function(department) {
      this.departments.push(Object.assign(new Department(), department))
    }, this);
  }

  addCareers(careers) {
    this.careers = new Array<Career>();
    careers.forEach(function(career) {
      this.careers.push(Object.assign(new Career(), career))
    }, this);
  }
}
