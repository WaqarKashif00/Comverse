import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder ,Validators} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { OrderReturnService } from './../order-return.service';




@Component({
  selector: 'app-order-return',
  templateUrl: './order-return.component.html',
  styleUrls: ['./order-return.component.scss']
})
export class OrderReturnComponent implements OnInit {

  constructor(
    private orderRturnService: OrderReturnService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  loading: boolean = false;
  URLS = URLS;
  orderList = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;

  columns: Column[] = [
    {
      title: "Order Number",
      selector: "order_no",
      clickable:true,
    },
    {
      title: "Description",
      selector: "description",
    },
    {
      title: "Reason For Change",
      selector: "reason_for_change",
    },
    {
      title: "Status",
      selector: "status",
      cell: row => `<span class="label ${row.status == 'Approve' ? 'success' : ''}${row.status == 'Disapprove' ? 'warning' : ''}">${row.status}</span>`
    }
  ];

  
  rowActions = row => {
    let actions = [];
    if (row.status =='pending'){
      actions.push('Approve');
      actions.push('Disapprove');
      actions.push('View Details');
    }
    else{
      actions.push('View Details');
    }
    return actions;
  }


  getOrderReturnList() {
    this.loading = true;
    this.orderRturnService.getOrderReturnList().then(resp => {
      this.loading = false;
      if(resp) {
        this.orderList = resp.data.results;
        this.totalCount = resp.data.count;
      }
    });
  }


  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getOrderReturnList();
  }


  onCellClick(data) {
    this.EditLocator(data.row.id);
  }
  EditLocator(data) {
    let dialogRef = this.dialog.open(OrderReturnDetailDialog, {
      width: "600px",
      data: {
        id: data,
      }
    });

    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        this.getOrderReturnList();
      }
    });
  }


  onRowAction(data) {
    if(data.action === "Approve" || data.action === "Disapprove"){
      let dialogRef = this.dialog.open(OrderReturnStatusChangeDialog, {
        width: "600px",
        data: {
          status: data.action,
          orderReturn: data.row,
        }
      });
  
      dialogRef.afterClosed().subscribe(deleted => {
        if (deleted) {
          this.getOrderReturnList();
        }
      });
    }
    else if(data.action ==="View Details"){
      let dialogRef = this.dialog.open(OrderReturnDetailDialog, {
        width: "600px",
        data: {
          id: data.row.id,
        }
      });
  
      dialogRef.afterClosed().subscribe(updated => {
        if (updated) {
          this.getOrderReturnList();
        }
      });
      
    }
  }


  ngOnInit(): void {
    this.getOrderReturnList();
  }
}



@Component({
  selector: 'order-return-status-change-dialog',
  templateUrl: '../dialogs/order-return-status-change-dialog.html',
  styleUrls: ['./order-return.component.scss']
})
export class OrderReturnStatusChangeDialog {
  constructor(
    public dialogRef: MatDialogRef<OrderReturnStatusChangeDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar,
    private orderRturnService: OrderReturnService,
    private fb: FormBuilder,) {
  }

  loading: boolean = false;

  statusAddCommentForm = this.fb.group({
    comment: ['', [Validators.required]],
  })


  changeStatus() {
    this.loading = true;
    this.orderRturnService.changeStatus(this.data.orderReturn.id,this.data.status,this.statusAddCommentForm.get('comment').value).then(resp => {
      if (resp) {
        this.snackbar.open("Status changed successfully.", "", { duration: 3000 });
        this.dialogRef.close(true);
      }
    });
  }
}

// Order Details


@Component({
  selector: 'order-return-detail-dialog',
  templateUrl: '../dialogs/order-return-detail-dialog.html',
})
export class OrderReturnDetailDialog {
  constructor(
    public dialogRef: MatDialogRef<OrderReturnDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar,
    private orderRturnService: OrderReturnService,
    private fb: FormBuilder,) {
  }

  loading: boolean = false;
  orderNumber;
  productName;
  productSKU;
  productPrice;
  productQuantity;
  comment;
  resonForChange;
  customerRequest;
  getOrderDetail:{};


  getOrederReturnDetail() {
    this.loading = true;
    this.orderRturnService.getOrederReturnDetail(this.data.id).then(resp => {
      this.loading = false;
      if (resp) {
        this.orderNumber = resp.data.order;
        this.productName = resp.data.product_name;
        this.productSKU = resp.data.sku;
        this.productPrice = resp.data.price;
        this.productQuantity = resp.data.quantity;
        this.resonForChange = resp.data.reason_for_change;
        this.comment = resp.data.comment;
        this.customerRequest = resp.data.customer_request;
        this.getOrderDetail = resp.data;
      }
    });
  }


  ngOnInit(): void {
    this.getOrederReturnDetail();
  }
}

