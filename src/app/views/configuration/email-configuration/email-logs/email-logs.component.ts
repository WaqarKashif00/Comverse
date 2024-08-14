import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { EmailConfigurationService } from '../email-configuration.service';

@Component({
  selector: 'app-email-logs',
  templateUrl: './email-logs.component.html',
  styleUrls: ['./email-logs.component.scss']
})
export class EmailLogsComponent implements OnInit {

  constructor(
    private emailConfigurationService: EmailConfigurationService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  loading: boolean = false;
  URLS = URLS;
  columns: Column[] = [
    {
      title: "Trigger",
      selector: "trigger_name",
    },
    {
      title: "IP Address",
      selector: "ip_address",
    },
    {
      title: "Account",
      selector: "provider",
    },
    {
      title: "Email From",
      selector: "from_address",
    },
    {
      title: "Email To",
      selector: "to_address",
    },
    {
      title: "Status",
      selector: "response_message",
    },
    {
      title: "Email Body",
      selector: "email_body",
    },
    {
      title: "Datetime",
      selector: "created_at",
      pipe: 'date',
      dateFormat: 'h:mm a MMM d'
    },
  ];
  
  email_logs = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;

  navigateToEmailConfiguration() {
    this.router.navigate([URLS.emailConfiguration]);
  }

  getLogs() {
    this.loading = true;
    this.emailConfigurationService.getEmailLogs(this.pageNumber, this.pageSize).then(resp => {
      this.loading = false;
      if(resp) {
        this.email_logs = resp.data.results;
        this.totalCount = resp.data.count;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getLogs();
  }

  ngOnInit(): void {
    this.getLogs();
  }

}
