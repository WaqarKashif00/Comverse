import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import { environment } from 'src/environments/environment';
import { ERPService } from './../../erp.service'
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-erp-logs',
  templateUrl: './erp-logs.component.html',
  styleUrls: ['./erp-logs.component.scss']
})
export class ErpLogsComponent implements OnInit {

  constructor(
    private erpService: ERPService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackbarService: MatSnackBar,
  ) { }

  
  loading: boolean = false;

  columns: Column[] = [
    {
      title: "Start Date",
      selector: "job_title",
      clickable: true
    },
    {
      title: "End Date",
      selector: "job_title1",
    },
    {
      title: "Location Name",
      selector: "job_titl2",
    },
    {
      title: "Sub Location",
      selector: "job_titl3",
    },
  ];


  erpInventoryList = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;
  rowActions = ["Delete"]


  getInventoryList() {
    this.loading = true;
    this.erpService.getInventoryList().then(resp => {
      this.loading = false;
      if(resp) {
        this.erpInventoryList = resp.data.results;
        this.totalCount = resp.data.count;
      }
    });
  }


  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
  }



  ngOnInit(): void {
    this.getInventoryList();
  }

}
