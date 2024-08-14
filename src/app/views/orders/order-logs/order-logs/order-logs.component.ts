import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import { OrdersService } from './../../orders.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-order-logs',
  templateUrl: './order-logs.component.html',
  styleUrls: ['./order-logs.component.scss']
})
export class OrderLogsComponent implements OnInit {

  constructor(
    private orderService: OrdersService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackbarService: MatSnackBar,
  ) { }

  loading: boolean = false;

  
  columns: Column[] = [
    {
      title: "Parent Order",
      selector: "job_title",

      // clickable: true
    },
    {
      title: "Child Order",
      selector: "job_title1",
    },
    {
      title: "Location Name",
      selector: "job_titl2",
    },
    {
      title: "Sub Location Name",
      selector: "job_titl3",
    },
    {
      title: "ERP Name",
      selector: "job_title4",
    },
    {
      title: "Vender",
      selector: "job_title5",
    },
   
    // {
    //   title: "Status",
    //   selector: "is_active",
    //   cell: row => `<span class="label ${row.is_active ? 'success' : ''}">${row.is_active ? 'Active' : 'Inactive'}</span>`
    // },
  ];


  orderPostingQueue = [];
  orderPosting = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;
  rowActions = ["Delete"]



  getOrderPostingQueueTable() {
    this.loading = true;
    this.orderService.getOrderPostingTable().then(resp => {
      this.loading = false;
      if (resp) {
        this.orderPosting = resp.data.results;
        this.totalTableCount = resp.data.count;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getOrderPostingQueueTable();
  }
  // onCellClick(data) {
  //   this.router.navigate(["/", URLS.sizeChart, URLS.edit, data.row.id]);
  // }

  // onRowAction(data) {
  //   if (data.action === "Delete") {
  //     let dialogRef = this.dialog.open(SizeChartDeleteDialog, {
  //       width: "600px",
  //       data: {
  //         sizeChart: data.row
  //       }
  //     });

  //     dialogRef.afterClosed().subscribe(deleted => {
  //       if (deleted) {
  //         this.getSizeChartList();
  //       }
  //     });
  //   }
  // }


  // Second Table For Order Logs

  
  columnsTable: Column[] = [
    {
      title: "Parent Order",
      selector: "job_title1",
      // clickable: true
    },
    {
      title: "Child Order",
      selector: "job_title2",
    },
    {
      title: "Location Name",
      selector: "job_title3",
    },
    {
      title: "Sub Location Name",
      selector: "job_title4",
    },
    {
      title: "ERP Name",
      selector: "job_title5",
    },
    {
      title: "Vender",
      selector: "job_title6",
    },
   
    // {
    //   title: "Status",
    //   selector: "is_active",
    //   cell: row => `<span class="label ${row.is_active ? 'success' : ''}">${row.is_active ? 'Active' : 'Inactive'}</span>`
    // },
  ];

    // second Table Pagination
    totalTableCount: number = 0;
    pageSizeTable: number = 1;
    pageLimitTable: number = 10;
    pageTable: number = 1;


    onPageTable(event: PageEvent) {
      this.pageTable = event.pageIndex + 1;
      this.pageLimitTable = event.pageSize;
      this.getOrderPostingTable();
    }

    // Get List
  getOrderPostingTable() {
    this.loading = true;
    this.orderService.getOrderPostingTable().then(resp => {
      this.loading = false;
      if (resp) {
        this.orderPosting = resp.data.results;
        this.totalTableCount = resp.data.count;
      }
    });
  }


  ngOnInit(): void {
    this.getOrderPostingTable();
    this.getOrderPostingQueueTable();
  }

}
