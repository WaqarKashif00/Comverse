import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { SMSConfigurationService } from '../smsconfiguration.service';

@Component({
  selector: 'app-sms-logs',
  templateUrl: './sms-logs.component.html',
  styleUrls: ['./sms-logs.component.scss']
})
export class SmsLogsComponent implements OnInit {

  constructor(
    private smsConfigurationService: SMSConfigurationService,
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
      title: "Phone",
      selector: "phone",
    },
    {
      title: "SMS Body",
      selector: "message",
    },
    {
      title: "IP Address",
      selector: "ip_address",
    },
    {
      title: "Status",
      selector: "message_response",
    },
    {
      title: "Account",
      selector: "provider",
    },
    {
      title: "Mask",
      selector: "mask",
    },
    {
      title: "Datetime",
      selector: "created_at",
      pipe: 'date',
      dateFormat: 'h:mm a MMM d'
    },

  ];
  
  sms_logs = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;

  navigateToMessageConfiguration() {
    this.router.navigate([URLS.smsConfiguration]);
  }

  getLogs() {
    this.loading = true;
    this.smsConfigurationService.getSmsLogs(this.pageNumber, this.pageSize).then(resp => {
      this.loading = false;
      if(resp) {
        this.sms_logs = resp.data.results;
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
