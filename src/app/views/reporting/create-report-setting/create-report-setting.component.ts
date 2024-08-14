import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { SalesReportService } from '../reporting.service';

@Component({
  selector: 'app-create-report-setting',
  templateUrl: './create-report-setting.component.html',
  styleUrls: ['./create-report-setting.component.scss']
})
export class CreateReportSettingComponent implements OnInit {

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackbarService: MatSnackBar,
    private salesReportService: SalesReportService
  ) { }


  loading: boolean = false;
  URLS = URLS;
  cc_emails = [];
  fieldsArray = [];

  createSettingForm = this.fb.group({
    title: [''],
    fields: [],
    report_type: [''],
    email: [''],
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

  onSubmit() {
    this.loading = true;
    let mainObj = this.createSettingForm.value;
    mainObj.cc_emails = this.cc_emails.length ? this.cc_emails.join(",") : "";
    if (this.createSettingForm.get('schedule_type').value != 'daily') {
      delete mainObj.schedule_time;
    }
    this.salesReportService.createSchedulerSetting(mainObj).then((resp) => {
      this.loading = false;
      if (resp) {
        this.snackbarService.open("Setting created.", "", { duration: 2000 });
        this.router.navigate(["/", URLS.salesRportSetting]);
      }
    })
  }


  ngOnInit(): void {
    this.getSalesReport();
  }

}
