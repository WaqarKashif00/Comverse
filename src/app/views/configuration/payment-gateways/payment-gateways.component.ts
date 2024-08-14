import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { PaymentGatewayService } from './payment-gateways.service';

@Component({
  selector: 'app-payment-gateways',
  templateUrl: './payment-gateways.component.html',
  styleUrls: ['./payment-gateways.component.scss']
})
export class PaymentGatewaysComponent implements OnInit {

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private paymentGatewayService: PaymentGatewayService,
    private snackbar: MatSnackBar,

  ) { }

  URLS = URLS;
  loading: boolean = false;
  paymentGateways = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;


  columns: Column[] = [
    {
      title: "Name",
      selector: "gateway_name",
      clickable: true
    },
    {
      title: "Status",
      selector: "is_active",
      cell: row => `<span class="label ${row.is_active ? 'success' : ''}">${row.is_active ? 'Active' : 'Inactive'}</span>`
    },
  ];


  getActivePaymentGateways() {
    this.loading = true;
    this.paymentGatewayService.getActivePaymentGatewaysList().then(resp => {
      this.loading = false;
      if (resp) {
        this.paymentGateways = resp.data;
      }
    });
  }

  rowActions = row => {
    let actions = [];
    if (row.is_active === false){
      actions.push('Activate');

    } else if(row.is_active  === true) {
      actions.push('Deactivate')
    }
    actions.push('Remove')
    return actions;
  }

  onRowAction(data) {
    if(data.action === "Remove") {
      let dialogRef = this.dialog.open(RemovePaymentGateway, {
        width: "600px",
        data: {
          paymentGateway: data.row
        }
      });

      dialogRef.afterClosed().subscribe(deleted => {
        if(deleted) {
          this.getActivePaymentGateways();
        }
      });
    } else if (data.action === 'Activate') {
      this.loading = true;
      let obj = {"id": data.row.id, "is_active": true} 
      this.paymentGatewayService.updateGatewayStatus(obj).then((resp)=> {
      this.loading = false;
      if(resp) {
        this.snackbar.open("Status updated successfully.", "", { duration: 3000 });
        this.getActivePaymentGateways();
      }
      })
    }

    else if (data.action === 'Deactivate') {
      this.loading = true;
      let obj = {"id": data.row.id, "is_active": false} 
      this.paymentGatewayService.updateGatewayStatus(obj).then((resp)=> {
      this.loading = false;
      if(resp) {
        this.snackbar.open("Status updated successfully.", "", { duration: 3000 });
        this.getActivePaymentGateways();
      }
      })
    }
  }

  onCellClick(data) {
    this.router.navigate(["/",URLS.paymentGateways, URLS.edit, data.row.id]);
  } 
  
  ngOnInit(): void {
    this.getActivePaymentGateways();
  }

}


@Component({
  selector: 'remove-payment-gateway-dialog',
  templateUrl: './dialogs/remove-payment-gateway-dialog.html',
})
export class RemovePaymentGateway {
  constructor(
    public dialogRef: MatDialogRef<RemovePaymentGateway>,
    @Inject(MAT_DIALOG_DATA) public data,
    private paymentGatewayService: PaymentGatewayService,
    private snackBar: MatSnackBar
  ) {}

  loading: boolean = false;

  onDelete() {
    this.loading = true;
    this.paymentGatewayService.deletePaymentGateway(this.data.paymentGateway.id).then(resp => {
      if(resp) {
        this.loading = false;
        this.snackBar.open("Paymentgateway removed.", "", {duration: 2000});
        this.dialogRef.close(true);
      }
    })
  }
}