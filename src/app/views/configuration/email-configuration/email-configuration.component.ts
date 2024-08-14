import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-configuration',
  templateUrl: './email-configuration.component.html',
  styleUrls: ['./email-configuration.component.scss']
})
export class EmailConfigurationComponent implements OnInit {

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
    this.router.navigate([URLS.emailTemplate]);
  }
  
  manageProviders() {
    this.router.navigate([URLS.emailProvider]);
  }

  manageLogs() {
    this.router.navigate([URLS.emailLogs]);
  }

  ngOnInit(): void {
    // this.loading = true
  }

}
