import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { SalesReportService } from '../reporting.service';

@Component({
  selector: 'app-reporting-settings',
  templateUrl: './reporting-settings.component.html',
  styleUrls: ['./reporting-settings.component.scss']
})
export class ReportingSettingsComponent implements OnInit {

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: MatSnackBar,
    private salesReportService: SalesReportService
  ) { }

  loading: boolean = false;
  URLS = URLS;
  rowActions = ["Delete"]
  reports = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;

  columns: Column[] = [
    {
      title: "Title",
      selector: "title",
      clickable: true
    },
    {
      title: "Report type",
      selector: "report_type"
    },
    {
      title: "Schedule type",
      selector: "schedule_type"
    },
    {
      title: "Status",
      selector: "is_active",
      cell: row => `<span class="label ${row.is_active ? 'success' : ''}">${row.is_active ? 'Active' : 'Inactive'}</span>`
    },
  ]


  getReportList() {
    this.loading = true;
    this.salesReportService.getReportSchedulerSettingsList().then(resp => {
      this.loading = false;
      if (resp) {
        this.reports = resp.data.results;
        this.totalCount = resp.data.count;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getReportList();
  }

  onCellClick(data) {
    this.router.navigate(["/", URLS.salesRportSetting, URLS.edit, data.row.id]);
  }

  onRowAction(data) {
    if (data.action === "Delete") {
      let dialogRef = this.dialog.open(DeleteReportDialog, {
        width: "600px",
        data: {
          report: data.row
        }
      });
      dialogRef.afterClosed().subscribe(deleted => {
        if (deleted) {
          this.getReportList();
        }
      });
    }
  }


  ngOnInit(): void {
    this.getReportList();
  }
}


@Component({
  selector: 'delete-report-setting-dialog',
  templateUrl: '../dialogs/delete-report-setting-dialog.html',
})
export class DeleteReportDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteReportDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackBar: MatSnackBar,
    private salesReportService: SalesReportService
  ) { }

  loading: boolean = false;

  onDelete() {
    this.loading = true;
    this.salesReportService.deleteSchedulerSetting(this.data.report.id).then(resp => {
      if (resp) {
        this.loading = false;
        this.snackBar.open("Setting deleted.", "", { duration: 2000 });
        this.dialogRef.close(true);
      }
    })
  }
}

