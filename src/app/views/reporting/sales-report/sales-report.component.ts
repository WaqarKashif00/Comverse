import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { FormBuilder, Validators } from '@angular/forms';
import { SalesReportService } from '../reporting.service';
import { concat, Observable, of, Subject, pipe } from 'rxjs';
import { catchError, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';



@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent implements OnInit {

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackbarService: MatSnackBar,
    private salesReportService: SalesReportService,

  ) { }

  loading: boolean = false;
  URLS = URLS;
  start_date: string;
  end_date: string;
  columns: Column[] = [];
  salesReport = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;
  rowActions = ["Delete"]
  selectedColumns: any;
  filterString: string = "";
  default_columns;
  fieldsArray = [];
  feilds = [];
  feildString: string = '';
  date_parameter = '';

  createSettingForm = this.fb.group({
    fields: [],
    email: [''],
    c_c_email: [''],
    schedule_type: [''],
    daly_time: [''],
  })


  trackByFn(column) {
    return column.selector;
  }


  onFieldSelected(event) {
    this.feilds = event;
  }

  onSet() {
    this.columns = [];
    this.columns = this.feilds;
    this.onFieldItems(this.feilds);
    this.getFieldList();
  }


  getFieldList() {
    this.loading = true;
    this.salesReportService.getFieldsList(this.pageNumber, this.pageSize, this.date_parameter, this.feildString).then((resp) => {
      this.loading = false;
      if (resp) {
        this.salesReport = resp.data.results;
        this.totalCount = resp.data.count;
      }
    })
  }


  onFieldItems(fields) {
    let feildString = [];
    if (fields) {
      feildString = fields.map(item => item.selector);
    }
    feildString.join(",");
    let final_string = feildString.toString()
    this.feildString = final_string;

  }

  onDateParameter() {
    if (this.start_date && this.end_date || this.start_date != "" && this.end_date != "") {
      this.date_parameter = "&start_date=" + this.start_date + "&end_date=" + this.end_date;
    } else if (this.start_date || this.start_date != "") {
      this.date_parameter = "&start_date=" + this.start_date;
    } else if (this.end_date || this.end_date != "") {
      this.date_parameter = "&end_date=" + this.end_date;
    } else {
      this.date_parameter = "";
    }
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getFieldList();

  }

  getSalesReport() {
    this.loading = true;
    this.salesReportService.getSalesReport().then((resp) => {
      this.loading = false;
      if (resp) {
        this.fieldsArray = resp.data.columns
        this.selectedColumns = resp.data.default_columns;
        this.default_columns = resp.data.default_columns;
        this.columns = this.selectedColumns;
        this.feilds = this.columns;
        this.onSet();
      }
    })
  }

  onExportReport() {
    this.exportReport(this.date_parameter, this.feildString)
  }

  exportReport(date, fields) {
    this.salesReportService.exportFieldsList(date, fields).then((resp) => {
      if (resp) {
        let csv_data = resp.data;
        var fileURL = window.URL.createObjectURL(new Blob([csv_data], { type: 'text/csv;charset=utf-8;' }));
        var fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.setAttribute('download', 'sales_report.csv');
        document.body.appendChild(fileLink);
        fileLink.click();
        document.body.removeChild(fileLink);
      }
    })
  }


  isColumnSelected(column) {
    for (let i = 0; i < this.selectedColumns.length; i++) {
      if (this.selectedColumns[i].selector == column.selector) {
        return true
      }
    }
  }

  onColumnChange(event, column) {
    if (event.checked) {
      this.selectedColumns.push(column)
    } else {
      let index;
      for (let i = 0; i < this.selectedColumns.length; i++) {
        if (this.selectedColumns[i].selector == column.selector) {
          index = i;
          break;
        }
      }
      this.selectedColumns.splice(index, 1)
    }
  }


  onSave() {
    this.loading = true;
    this.salesReportService.createReportSetting({ report_type: "sales_report", default_columns: this.selectedColumns }).then((resp) => {
      this.loading = false;
      if (resp) {
        this.snackbarService.open("Default columns updated.", "", { duration: 2000 });
        this.default_columns = this.selectedColumns;
        this.getFieldList()
      }
    })

  }


  compareData(ob1, ob2) {
    return ob1.selector === ob2.selector
  }

  ngOnInit(): void {
    this.getSalesReport();
    this.getFieldList()

  }

}
