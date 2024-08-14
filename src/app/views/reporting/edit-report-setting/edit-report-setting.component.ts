import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { SalesReportService } from '../reporting.service';

@Component({
  selector: 'app-edit-report-setting',
  templateUrl: './edit-report-setting.component.html',
  styleUrls: ['./edit-report-setting.component.scss']
})

export class EditReportSettingComponent implements OnInit {

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackbarService: MatSnackBar,
    private salesReportService: SalesReportService,
    private route: ActivatedRoute,

  ) {
    this.reprotSchedulerSettingID = this.route.snapshot.paramMap.get('id');

  }


  loading: boolean = false;
  URLS = URLS;
  reprotSchedulerSettingID: any
  cc_emails = [];
  fieldsArray = [];


  editSettingForm = this.fb.group({
    title: [''],
    fields: [],
    email: [''],
    report_type: [''],
    schedule_type: [''],
    schedule_time: [''],
    is_active: [false]
  })


  getSalesReport() {
    this.loading = true;
    this.salesReportService.getSalesReport().then((resp) => {
      this.loading = false;
      if (resp) {
        this.fieldsArray = resp.data.columns
      }
    })
  }


  trackByFn(column) {
    return column.selector;
  }


  getSettingDetail() {
    this.loading = true;
    this.salesReportService.getSingleReportSchedulerSetting(this.reprotSchedulerSettingID).then((resp) => {
      this.loading = false;
      if (resp) {
        console.log(resp.data);
        this.cc_emails = resp.data.cc_emails.length ? resp.data.cc_emails.split(",").filter(tag => tag) : [];
        this.editSettingForm.patchValue(resp.data)
      }
    })
  }

  onSubmit() {
    this.loading = true;
    let mainObj = this.editSettingForm.value;
    mainObj.cc_emails = this.cc_emails.length ? this.cc_emails.join(",") : "";
    mainObj.id = this.reprotSchedulerSettingID;
    if (this.editSettingForm.get('schedule_type').value != 'daily') {
      delete mainObj.schedule_time;
    }
    this.salesReportService.editSchedulerSetting(mainObj).then((resp) => {
      this.loading = false;
      if (resp) {
        this.snackbarService.open("Setting updated.", "", { duration: 2000 });
        this.router.navigate(["/", URLS.salesRportSetting]);
      }
    })
  }

  compareData(ob1, ob2) {
    return ob1.selector === ob2.selector;
  }


  ngOnInit(): void {
    this.getSalesReport();
    this.getSettingDetail();
  }

}

