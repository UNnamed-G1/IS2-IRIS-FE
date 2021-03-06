// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { NgHttpLoaderModule } from 'ng-http-loader/ng-http-loader.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocialLoginModule, AuthServiceConfig, GoogleLoginProvider } from 'angular5-social-login';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { APP_BASE_HREF } from '@angular/common';
import { NgRedux, NgReduxModule, select } from '@angular-redux/store';
import * as persistState from 'redux-localstorage';
import { HttpModule } from '@angular/http';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NvD3Module } from 'ngx-nvd3';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FileUploadModule } from 'ng2-file-upload';
import { FileDropModule } from 'ngx-file-drop';
import { ImageCropperModule } from 'ngx-image-cropper'
import { AgmCoreModule } from '@agm/core';
import { CalendarModule } from 'angular-calendar';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

// Redux imports
import { AppState, rootReducer, INITIAL_STATE } from './redux/store';
import { ADD_SESSION, REMOVE_SESSION } from './redux/actions';
// Requests interceptor
import { AuthInterceptor } from './auth-interceptor';
// Permission manager
import { PermissionManager } from 'app/permission-manager';

// Components
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './components/template/app-header/app-header.component';
import { AppFooterComponent } from './components/template/app-footer/app-footer.component';
import { AppServicesComponent } from './components/template/app-services/app-services.component';
// Admin
import { ManageComponent } from './admin/manage/manage.component';
import { AddUserComponent } from './admin/users/add/add-user.component';
import { UsersComponent } from './admin/users/users.component';
import { AddResearchGroupComponent } from './admin/research-groups/add/add-research-group.component';
import { ResearchListComponent } from './admin/research-groups/research-list.component';

// Professor
import { AddEventComponent } from './professor/event-list/add/add-event.component';
import { EventListComponent } from './professor/event-list/event-list.component';

// Student

// User
import { LeaveCommentsComponent } from './user/leave-comments/leave-comments.component';

// Public
import { LoginComponent } from './public/login/login.component';
import { RegisterComponent } from './public/login/register/register.component';
import { EventsComponent } from './public/events/events.component';
import { HomeComponent } from './public/home/home.component';
import { NotFoundComponent } from './public/not-found/not-found.component';
import { ProfileComponent } from './public/profile/profile.component';
import { ResearchGroupsComponent } from './public/research-groups/research-groups.component';
import { SearchComponent } from './public/search/search.component';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import { PublicationComponent } from './public/publication/publication.component';
import { AddPublicationComponent } from './public/publication/add/add-publication.component';
import { FollowsComponent } from './public/profile/follows/follows.component';
import { EventComponent } from './public/events/event/event.component';
import { SchedulerComponent } from './public/scheduler/scheduler.component';

// Services
import { CommonService } from './services/common.service';
import { CareerService } from './services/career.service';
import { CommentService } from './services/comment.service';
import { DepartmentService } from './services/department.service';
import { EventService } from './services/event.service';
import { FacultyService } from './services/faculty.service';
import { LoginService } from './services/login.service';
import { ResearchGroupService } from './services/research-group.service';
import { UserService } from './services/user.service';
import { PublicationService } from './services/publication.service';

import { RgComponent } from './public/research-groups/rg/rg.component';
import { FilterPipe } from './public/research-groups/rg/filter.pipe';
import { ResearchSubjectService } from './services/research-subject.service';

import { PaginationComponent } from './components/pagination/pagination.component';
import { CrudComponent } from './components/crud/crud.component';
import { FormControlErrorsComponent } from './components/form-control-errors/form-control-errors.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { GenericSwalComponent } from './components/generic-swal/generic-swal.component';

// Directives
import { MediaPreviewDirective } from './directives/media-preview.directive';

import { environment } from 'environments/environment';
import { User } from 'app/classes/_models';
import { CreateResearchGroupComponent } from './professor/create-research-group/create-research-group.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    children: [{
      path: 'follows',
      component: FollowsComponent
    }]
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'events',
    component: EventsComponent
  },
  {
    path: 'research-groups',
    component: ResearchGroupsComponent,
    // children: [{path: 'add', component: AddResearchGroupComponent}]
  },
  {
    path: 'login',
    component: LoginComponent,
    children: [{ path: 'register', component: RegisterComponent }]
  },
  {
    path: 'users',
    component: UsersComponent,
    // children: [{path: 'add', component: AddUserComponent}]
  },
  {
    path: 'users/add',
    component: AddUserComponent
  },
  {
    path: 'publications/add',
    component: AddPublicationComponent
  },
  {
    path: 'research-groups/add',
    component: AddResearchGroupComponent
  },
  {
    path: 'events/add',
    component: AddEventComponent
  },

  {
    path: 'admin/manage',
    component: ManageComponent
  },
  {
    path: 'research-list',
    component: ResearchListComponent
  },
  {
    path: 'event-list',
    component: EventListComponent
  },
  {
    path: 'leave-comments',
    component: LeaveCommentsComponent
  },
  {
    path: 'rg',
    component: RgComponent
  },
  {
    path: 'event',
    component: EventComponent
  },
  {
    path: 'documents',
    component: DocumentsComponent
  },
  {
    path: 'publication',
    component: PublicationComponent
  }, 
  {
    path: 'scheduler',
    component: SchedulerComponent
  },
  {
    path: 'research-groups/create',
    component: CreateResearchGroupComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [
    BrowserModule,
    CalendarModule.forRoot(),
    AngularFontAwesomeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBJ5090JokhcDdoO-ycXZx8Ik2wUcIiPs0'
    }),
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      confirmButtonClass: 'btn btn-primary btn-swal',
      cancelButtonClass: 'btn btn-danger btn-swal'
    }),
    SocialLoginModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    NgHttpLoaderModule,
    NgReduxModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    PdfViewerModule,
    FileUploadModule,
    FileDropModule,
    ImageCropperModule,
    NvD3Module,
    NgbModalModule.forRoot()
  ],
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppFooterComponent,
    AppServicesComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    EventsComponent,
    ResearchGroupsComponent,
    ProfileComponent,
    SearchComponent,
    NotFoundComponent,
    ManageComponent,
    UsersComponent,
    ResearchListComponent,
    EventListComponent,
    AddUserComponent,
    AddResearchGroupComponent,
    AddEventComponent,
    LeaveCommentsComponent,
    RgComponent,
    FilterPipe,
    PaginationComponent,
    CrudComponent,
    DocumentsComponent,
    PublicationComponent,
    AddPublicationComponent,
    FormControlErrorsComponent,
    DocumentsComponent,
    FollowsComponent,
    MediaPreviewDirective,
    ImageCropperComponent,
    EventComponent,
    GenericSwalComponent,
    SchedulerComponent,
    CreateResearchGroupComponent
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    },
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    PermissionManager,
    CommentService,
    EventService,
    LoginService,
    CareerService,
    DepartmentService,
    FacultyService,
    ResearchGroupService,
    UserService,
    PublicationService,
    ResearchSubjectService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  @select() isLogged;

  constructor(private ngRedux: NgRedux<AppState>,
    private userService: UserService) {
    ngRedux.configureStore(rootReducer, INITIAL_STATE, undefined, persistState());
    this.verifyValidSession();
  }

  verifyValidSession() {
    this.isLogged.subscribe((logged: boolean) => {
      if (logged) {
        this.userService.getCurrent().subscribe(
          (response: { user: User }) => {
            // Update data
            const data = response.user;
            if (data.photo) {
              Object.assign(data, { photo: environment.api_url + data.photo.picture });
            }
            this.ngRedux.dispatch({
              type: ADD_SESSION, session: {
                id: data.id,
                name: data.full_name,
                type: data.user_type,
                username: data.username,
                photo: data.photo
              }
            });
          },
          (error: HttpErrorResponse) => {
            // Remove session if logged and token is not valid
            if (error.status === 401) {
              this.ngRedux.dispatch({ type: REMOVE_SESSION });
            }
          }
        );
      }
    });
  }
}

// Social Login config
export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
    [{
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider('866195745492-1gm5oqaoosblouo7v9sjndpaj38532ol.apps.googleusercontent.com')
    }]
  );
  return config;
}
