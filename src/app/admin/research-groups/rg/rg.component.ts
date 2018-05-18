import { Component, ViewChild, OnInit, AfterContentChecked } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload';
import { ActivatedRoute, Router } from '@angular/router';
import * as d3 from 'd3';

import { select, NgRedux } from '@angular-redux/store';
import { AppState } from 'app/redux/store';
import { ADD_AUXILIAR, REMOVE_AUXILIAR } from 'app/redux/actions';
import { PermissionManager } from 'app/permission-manager';
import { environment } from 'environments/environment';
import { Publication, ResearchGroup, ResearchSubject, User } from 'app/classes/_models';
import { ResearchGroupService } from 'app/services/research-group.service';

@Component({
  selector: 'app-rg',
  templateUrl: './rg.component.html',
  styleUrls: ['./rg.component.css']
})
export class RgComponent implements OnInit, AfterContentChecked {
  @select(['session', 'username']) sessionUsername;
  @select(['session', 'type']) sessionType;
  @select(['auxiliarID', 'researchGroup']) researchGroupID;
  @select() isLogged;

  rgReportUrl = environment.api_url + 'reports/research_group/';
  PDF = false;
  swalOpts: any;
  researchGroup: ResearchGroup;
  showInput = false;
  isRequester: boolean;
  isMember: boolean;
  isOwner: boolean;
  rgForm: FormGroup;
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  allowedTypes = ['image/png', 'image/gif', 'image/jpeg'];

  /*
   * Charts
   */
  statistics: number;
  publTypesChart = { options: { chart: {} }, data: [] };
  publLastPeriodChart = { options: { chart: {} }, data: [] };
  publOverallChart = { options: { chart: {} }, data: [] };

  constructor(private researchGroupService: ResearchGroupService,
    private ngRedux: NgRedux<AppState>,
    private acRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) {
    this.publLastPeriodChart.options.chart = {
      type: 'lineChart',
      height: 250,
      x: d => d.label,
      y: d => d.value,
      useInteractiveGuideline: true,
      showLegend: false,
      xAxis: {
        axisLabel: 'Fecha',
        rotateLabels: -5,
        tickFormat: d => d3.time.format('%b %Y')(new Date(d)),
        tickValues: serie => serie[0].values.map((v) => v.label),
      },
      yAxis: {
        axisLabel: 'Cantidad de publicaciones',
        axisLabelDistance: -10,
        tickFormat: d => d3.format('f')(d),
        tickValues: serie => Array.from({ length: Math.max(...serie[0].values.map((v) => v.value)) }, (v, k) => k),
      },
    };
    this.publTypesChart.options.chart = {
      type: 'pieChart',
      height: 250,
      x: d => d.label,
      y: d => d.value,
      valueFormat: d => d3.format('f')(d),
      showLegend: false,
    };
    this.publOverallChart.options.chart = {
      type: 'discreteBarChart',
      height: 250,
      x: d => d.label,
      y: d => d.value,
      xAxis: {
        axisLabel: 'Usuario',
      },
      yAxis: {
        axisLabel: 'Cantidad de publicaciones',
        axisLabelDistance: -10,
        tickFormat: d => d3.format('f')(d),
      },
      callback: (chart) => {
        d3.selectAll('.nv-bar').on('click', (barData) => {
          this.viewProfile(barData.id);
          d3.selectAll('.nvtooltip').remove();
        });
      },
    };
  }

  ngOnInit() {
    this.researchGroupID.subscribe((id: number) => {
      if (id) {
        this.rgReportUrl += id + '/publications_history.pdf';
        this.requestStatistics(id);
        this.requestRG(id);
        this.uploader = new FileUploader({ queueLimit: 1 });
      } else {
        this.router.navigateByUrl('/');
      }
    }).unsubscribe();
  }

  ngAfterContentChecked() {
    this.statistics = Object.getOwnPropertyNames(this)
      .filter((name: string) => name.endsWith('Chart'))
      .map((key: string) => this[key].data.length)
      .reduce((v1, v2) => v1 + v2);
  }

  updateGroup() {
    if (this.rgForm.pristine && this.uploader.queue.length === 0) {
      return;
    }
    const rg = new ResearchGroup();
    if (this.rgForm.pristine) {
      rg.name = this.researchGroup.name;
    } else {
      for (const k in this.rgForm.controls) {
        if (this.rgForm.get(k).dirty) {
          rg[k] = this.rgForm.get(k).value;
        }
      }
    }
    const fd = new FormData();
    for (const key of Object.keys(rg)) {
      fd.append('research_group[' + key + ']', rg[key]);
    }
    if (this.uploader.queue.length) {
      fd.append('picture', this.uploader.queue[0].file.rawFile);
    }
    this.researchGroupService.update(this.researchGroup.id, fd).subscribe(
      (response: { research_group: ResearchGroup }) => {
        this.swalOpts = { title: 'El grupo de investigación ha sido actualizado', type: 'success'};
        this.toggleShowInput();
        this.uploader.clearQueue();
        this.setRG(response.research_group);
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'El grupo no ha podido ser actualizado', text: error.message, type: 'error' };

      }
    );
  }

  requestRG(id: number) {
    this.researchGroupService.get(id).subscribe(
      (response: { research_group: ResearchGroup }) => {
        this.setRG(response.research_group);
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'No se ha podido obtener el grupo de investigación', text: error.message, type: 'error' };

      }
    );
  }

  requestStatistics(id: number) {
    this.researchGroupService.getOverallPublications(id).subscribe(
      (response: { overall_num_pubs_by_users_in_rg: any }) => {
        const publicationsOverall = response.overall_num_pubs_by_users_in_rg;
        const data = new Array<any>();
        for (const user of publicationsOverall) {
          if (user.pubs_count > 0) {
            data.push({
              label: user.fullname,
              value: user.pubs_count,
              id: user.id
            });
          }
        }
        this.publOverallChart.data = [{ key: 'Usuarios', values: data }];
      }, error => {
        this.swalOpts = { title: 'Estadísticas no disponibles', text: error.message, type: 'error' };
        this.publOverallChart.data = [];
      }
    );
    this.researchGroupService.publicationsLastPeriod(id).subscribe(
      (response: { num_publications_of_users_in_a_period: any }) => {
        const publicationsDated = response.num_publications_of_users_in_a_period;
        const data = new Array<any>();
        for (const date of Object.getOwnPropertyNames(publicationsDated)) {
          const dateValues = date.split('-').map(Number);
          data.push({ label: new Date(dateValues[0], dateValues[1] - 1), value: publicationsDated[date] });
        }
        this.publLastPeriodChart.data = [{ key: 'Publicaciones', values: data }];
      }, error => {
        this.swalOpts = { title: 'Estadísticas no disponibles', text: error.message, type: 'error' };
        this.publLastPeriodChart.data = [];
      }
    );
    this.researchGroupService.publicationsByRGAndType(id).subscribe(
      (response: { num_publications_by_rg_and_type: any }) => {
        const publicationsAmount = response.num_publications_by_rg_and_type;
        const data = new Array<any>();
        for (const pub_type of Object.getOwnPropertyNames(publicationsAmount)) {
          if (publicationsAmount[pub_type] > 0) {
            data.push({ label: pub_type, value: publicationsAmount[pub_type] });
          }
        }
        this.publTypesChart.data = data;
      }, error => {
        this.swalOpts = { title: 'Estadísticas no disponibles', text: error.message, type: 'error' };
        this.publTypesChart.data = [];
      }
    );
  }

  setRG(rg: ResearchGroup) {
    this.researchGroup = Object.assign({}, this.researchGroup, rg);
    if (rg.photo) {
      Object.assign(this.researchGroup, { photo: environment.api_url + rg.photo.picture });
    }
    this.createRGForm();
    // this.researchGroup.events = this.researchGroup.events
    // .filter((event) => new Date(event.date) > new Date());    // Eventos próximos
    // this.researchGroup.members = this.researchGroup.members
    // .filter((member) => member.state === 'Activo');
    this.currentIsRequester();
    this.currentIsMember();
    this.currentIsOwner();
  }

  currentIsRequester() {
    if (this.researchGroup.members.length) {
      this.sessionUsername.subscribe((username: string) => {
        this.isRequester = this.filterRequested().map(user => user.username).includes(username);
      }).unsubscribe();
    }
  }

  currentIsMember() {
    if (this.researchGroup.members.length) {
      this.sessionUsername.subscribe((username: string) => {
        this.isMember = this.filterMember().map(user => user.username).includes(username);
      }).unsubscribe();
    }
  }

  currentIsOwner() {
    this.sessionType.subscribe((type: string) => {
      this.isOwner = type === 'Administrador';
    })
    if (!this.isOwner) {
      this.sessionUsername.subscribe((username: string) => {
        this.isOwner = this.filterLider().map((user) => user.username).includes(username);
      }).unsubscribe();
    }
  }

  acceptJoinRequest(userId: number) {
    this.researchGroupService.acceptJoinRequest(this.researchGroup.id, userId).subscribe(
      (response) => {
        this.requestRG(this.researchGroup.id);        
      },
      (error: HttpErrorResponse) => {
        // this.swalOpts = {  }
      }
    )
  }

  rejectJoinRequest(userId: number) {
    this.researchGroupService.rejectJoinRequest(this.researchGroup.id, userId).subscribe(
      (response) => {
        this.requestRG(this.researchGroup.id);        
      },
      (error: HttpErrorResponse) => {
        // this.swalOpts = {  }
      }
    )
  }

  filterRequested(): Array<User> {
    return this.researchGroup.members
      .filter((member) => member.member_type === 'Solicitante')
      .map((member) => member.user)
  }

  filterLider(): Array<User> {
    return this.researchGroup.members
      .filter((member) => member.member_type === 'Líder')
      .map((member) => member.user)
    }

  filterMember(): Array<User> {
    return this.researchGroup.members
      .filter((member) => member.member_type === 'Miembro')
      .map((member) => member.user)
  }

  toggleShowInput() {
    this.showInput = !this.showInput;
  }

  pdfMode() {
    this.PDF = !this.PDF;
  }

  onSubmit() {
    if (this.rgForm.pristine) {
      return;
    }
    const rg = new ResearchGroup();
    for (const key in this.rgForm.controls) {
      if (this.rgForm.get(key).dirty) {
        rg[key] = this.rgForm.get(key).value;
      }
    }
    if (this.researchGroup.id) {
      this.researchGroupService.update(this.researchGroup.id, rg).subscribe(
        (response: { research_group: ResearchGroup }) => {
          this.setRG(response.research_group);
          this.swalOpts = { title: 'El grupo ha sido actualizado', type: 'success'};
          this.createRGForm();
        },
        (error: HttpErrorResponse) => {
          this.swalOpts = { title: 'Grupo no actualizado', text: error.message, type: 'error' };

        });
    }
  }

  requestJoin() {
    this.researchGroupService.requestJoin({ id: this.researchGroup.id }).subscribe(
      (response) => {
        this.swalOpts = { title: 'Se ha enviado tu solicitud de unión al grupo', type: 'success'};
        this.requestRG(this.researchGroup.id);
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'No te has podido unir al grupo', text: error.message, type: 'error' };

      }
    );
  }

  cancelJoinRequest() {
    this.researchGroupService.cancelJoinRequest(this.researchGroup.id).subscribe(
      (response) => {
        this.sucSwal.title = 'Se ha cancelado la solicitud de unión';
        this.sucSwal.show();
        this.requestRG(this.researchGroup.id);
      },
      (error: HttpErrorResponse) => {
        this.errSwal.title = 'No se ha podido cancelar la solicitud de unión unir al grupo';
        this.errSwal.text = 'Mensaje de error: ' + error.message;
        this.errSwal.show();
      }
    );
  }

  leave() {
    this.researchGroupService.leaveGroup({ id: this.researchGroup.id }).subscribe(
      (response) => {
        this.swalOpts = { title: 'Has abandonado este grupo', type: 'success'};
        this.requestRG(this.researchGroup.id);
      },
      (error: HttpErrorResponse) => {
        this.swalOpts = { title: 'No has podido abandonar al grupo', text: error.message, type: 'error' };

      }
    );
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  loadedImage(e: FileList) {
    if (this.allowedTypes.includes(e[0].type)) {
      this.uploader.clearQueue();
      this.uploader.addToQueue([e[0]]);
    } else {
      this.swalOpts = { title: 'El tipo de archivo es inválido', text: 'Sólo se permiten imágenes jpg, png o gif', type: 'error' };

    }
  }

  viewProfile(id: number) {
    this.ngRedux.dispatch({ type: ADD_AUXILIAR, auxiliarID: { user: id } });
    this.router.navigateByUrl('/profile');
  }

  private createRGForm() {
    this.rgForm = this.formBuilder.group({
      name: [this.researchGroup.name,
      [Validators.required, Validators.pattern('[A-Za-zÀ-ÿ ]*'),
      Validators.minLength(3), Validators.maxLength(100)]],
      description: [this.researchGroup.description,
      [Validators.required, Validators.maxLength(5000)]],
      strategic_focus: [this.researchGroup.strategic_focus,
      [Validators.required, Validators.maxLength(1000)]],
      research_priorities: [this.researchGroup.research_priorities,
      [Validators.required, Validators.maxLength(5000)]],
      foundation_date: [this.researchGroup.foundation_date, [Validators.required]],
      classification: [this.researchGroup.classification, [Validators.required]],
      date_classification: [this.researchGroup.date_classification, [Validators.required]],
      url: [this.researchGroup.url, [Validators.required]],
    });
  }

  get name() { return this.rgForm.get('name'); }
  get description() { return this.rgForm.get('description'); }
  get strategic_focus() { return this.rgForm.get('strategic_focus'); }
  get research_priorities() { return this.rgForm.get('research_priorities'); }
  get foundation_date() { return this.rgForm.get('foundation_date'); }
  get classification() { return this.rgForm.get('classification'); }
  get date_classification() { return this.rgForm.get('date_classification'); }
  get url() { return this.rgForm.get('url'); }
}
