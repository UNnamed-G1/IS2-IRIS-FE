import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
import { Z_SYNC_FLUSH } from 'zlib';

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
  profileForm: FormGroup;

  constructor(private userService: UserService,
    private facultyService: FacultyService,
    private departmentService: DepartmentService,
    private careerService: CareerService,
    private permMan: PermissionManager,
    private formBuilder: FormBuilder) { }

  ngOnInit() { }

  ngAfterContentInit() {
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
    if (this.profileForm.pristine) {
      return;
    }
    const u = new User();
    for (const k in this.profileForm.controls) {
      if (this.profileForm.get(k).dirty) {
        u[k] = this.profileForm.get(k).value;
      }
    }
    if (u.name) {
      Object.assign(u, {
        name: u.name['first'],
        lastname: u.name['last']
      });
    }
    if (u['passwords']) {
      Object.assign(u, {
        password: u['passwords'].password,
        password_confirmation: u['passwords'].pass
      });
      delete u['passwords'];
    }
    
    this.userService.update(this.user.id, { user: u }).subscribe(
      response => {
        Object.assign(this.user, response.user);
        if (this.user.career) {
          this.setDepartments(this.user.career_id);
          this.setCareers(this.user.career_id);
        }
        this.createProfileForm();
      },
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
      if (this.user.career) {
        this.setDepartments(this.user.career_id)
        this.setCareers(this.user.career_id)
      }
      this.createProfileForm();
    });
  }

  setFaculties() {
    this.facultyService.get().subscribe(
      (response: { faculties: Array<Faculty> }) => {
        response.faculties.forEach(function (faculty) {
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
        response.departments.forEach(function (department) {
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
        response.careers.forEach(function (career) {
          this.careers.push(Object.assign(new Career(), career))
        }, this);
      },
      error => console.log(error)
    );
    this.careers = new Array<Career>();
  }

  private passwordMatchValidator(g: FormGroup) {
    let pass = g.get('password'),
      passConf = g.get('password_confirmation');
    if (pass.invalid || (passConf.invalid && passConf.errors.minlength))
      return { 'mismatch': true };
    if (pass.dirty)
      passConf.markAsDirty();
    let ans = pass.value === passConf.value ? null : { 'mismatch': true };
    passConf.setErrors(ans);
    return ans;
  }

  private createProfileForm() {
    this.profileForm = this.formBuilder.group({
      name: this.formBuilder.group({
        first: [this.user.name,
        [Validators.required, Validators.pattern("[a-zA-Z ]*"),
        Validators.minLength(3), Validators.maxLength(100)]],
        last: [this.user.lastname,
        [Validators.required, Validators.pattern("[a-zA-Z ]*"),
        Validators.minLength(3), Validators.maxLength(100)]]
      }),
      professional_profile: [this.user.professional_profile,
      [Validators.required, Validators.maxLength(5000)]],
      phone: [this.user.phone,
      [Validators.pattern("[0-9 +-]*"), Validators.minLength(7), Validators.maxLength(20)]],
      office: [this.user.office, [Validators.minLength(7), Validators.maxLength(20)]],
      cvlac_link: [this.user.cvlac_link],
      passwords: this.formBuilder.group({
        password: ['', [Validators.minLength(8)]],
        password_confirmation: ['', [Validators.minLength(8)]]
      }, { validator: this.passwordMatchValidator })
    });
  }

  get name() { return this.profileForm.get('name'); }
  get first() { return this.profileForm.get('name.first'); }
  get last() { return this.profileForm.get('name.last'); }
  get professional_profile() { return this.profileForm.get('professional_profile'); }
  get phone() { return this.profileForm.get('phone'); }
  get office() { return this.profileForm.get('office'); }
  get cvlac_link() { return this.profileForm.get('cvlac_link'); }
  get passwords() { return this.profileForm.get('passwords'); }
  get password() { return this.profileForm.get('passwords.password'); }
  get passwordConf() { return this.profileForm.get('passwords.password_confirmation'); }
}
