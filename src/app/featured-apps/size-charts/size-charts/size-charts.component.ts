import { SizeChartsService } from './../size-charts.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-size-charts',
  templateUrl: './size-charts.component.html',
  styleUrls: ['./size-charts.component.scss']
})
export class SizeChartsComponent implements OnInit {

  constructor(
    private sizeChartService: SizeChartsService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackbarService: MatSnackBar
  ) { }

  loading: boolean = false;
  URLS = URLS;
  storeCurrency = environment.currency;
  columns: Column[] = [
    {
      title: "Title",
      selector: "title",
      clickable: true
    },
    {
      title: "Status",
      selector: "is_active",
      cell: row => `<span class="label ${row.is_active ? 'success' : ''}">${row.is_active ? 'Active' : 'Inactive'}</span>`
    }

  ];
  sizeChart = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;
  rowActions = ["Delete"]


  getSizeChartList() {
    this.loading = true;
    this.sizeChartService.getSizeChartList().then(resp => {
      this.loading = false;
      if (resp) {
        this.sizeChart = resp.data.results;
        this.totalCount = resp.data.count;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getSizeChartList();
  }

  onCellClick(data) {
    this.router.navigate(["/", URLS.sizeChart, URLS.edit, data.row.id]);
  }

  onRowAction(data) {
    if (data.action === "Delete") {
      let dialogRef = this.dialog.open(SizeChartDeleteDialog, {
        width: "600px",
        data: {
          sizeChart: data.row
        }
      });

      dialogRef.afterClosed().subscribe(deleted => {
        if (deleted) {
          this.getSizeChartList();
        }
      });
    }
  }

  createDefaultSettingForm = this.fb.group({
    header_bg_color: ['', [Validators.required]],
    grid_bg_color: ['', [Validators.required]],
    grid_header_color: ['', [Validators.required]],
    border_color: ['', [Validators.required]],
    grid_text_color: ['', [Validators.required]]
  })

  getDefaultSetting() {
    this.loading = true;
    this.sizeChartService.getSettingDetail().then(resp => {
      this.loading = false;
      if (resp) {
        this.createDefaultSettingForm.patchValue(resp.data);
      }
    });
  }


  onSubmit() {
    this.loading = true;
    this.sizeChartService.createSetting(this.createDefaultSettingForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.loading = false;
        this.snackbarService.open('Default setting created', "", { duration: 3000 });
        this.router.navigate(['/', URLS.sizeChart]);
      }
    });
  }


  ngOnInit(): void {
    this.getSizeChartList();
    this.getDefaultSetting();
  }
}


@Component({
  selector: 'size-chart-delete-dialog',
  templateUrl: '../dialogs/size-chart-delete-dialog.html',
})
export class SizeChartDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<SizeChartDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private sizeChartService: SizeChartsService,
    private snackBar: MatSnackBar
  ) { }

  loading: boolean = false;

  onDelete() {
    this.loading = true;
    this.sizeChartService.deleteSizeChart(this.data.sizeChart.id).then(resp => {
      if (resp) {
        this.loading = false;
        this.snackBar.open("Size chart deleted.", "", { duration: 2000 });
        this.dialogRef.close(true);
      }
    })
  }
}