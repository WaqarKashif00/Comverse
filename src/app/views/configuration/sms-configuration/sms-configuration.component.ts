import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import URLS from 'src/app/shared/urls';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sms-configuration',
  templateUrl: './sms-configuration.component.html',
  styleUrls: ['./sms-configuration.component.scss']
})
export class SmsConfigurationComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private router: Router,
  ) { }

  URLS = URLS;
  loading: boolean = false;

  goBack() {
    this.router.navigate([URLS.configuration]);
  }

  manageTemplates() {
    this.router.navigate([URLS.smsTemplate]);
  }
  
  manageProviders() {
    this.router.navigate([URLS.smsProvider]);
  }

  manageLogs() {
    this.router.navigate([URLS.smsLogs]);
  }

  ngOnInit(): void {
    // this.loading = true
  }

}
