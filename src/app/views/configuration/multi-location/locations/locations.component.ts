import { Component, OnInit,Inject } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/auth.service';
import { Validators } from '@angular/forms';
import { MultiLocationService } from '../multi-location.service';
import { Column } from 'src/app/shared/datatable/datatable.component';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private multiLocationService: MultiLocationService,
    private snackbar: MatSnackBar,
    public dialog: MatDialog,

  ) {}
  loading = false;
  URLS = URLS;


  // locationList = [{id:1,title:'ahmad'},{id:2,title:'ahmad'}];
  locationList = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;
  // locationList = [];

  columns: Column[] = [
    {
      title: "Title",
      selector: "title",
      clickable:true,
    },
    // {
    //   title: "Address",
    //   selector: "address",
    // },
    // {
    //   title: "Reason For Change",
    //   selector: "reason_for_change",
    // },
    {
      title: "Status",
      selector: "is_active",
      cell: row => `<span class="label ${row.is_active == true ? 'success' : 'Active'}${row.is_active == false ? 'warning' : ''}">Active</span>`
    }
  ];


  getLocationList() {
    this.loading = true;
    this.multiLocationService.getLocationList().then(resp => {
      this.loading = false;
      if (resp) {
        this.locationList = resp.data;
        this.totalCount = resp.data.count;
      }
    });
  }

  rowActions = row => {
    let actions = [];
      actions.push('Edit');
      actions.push('Delete');
      // actions.push('View Details');
    // else{
    //   actions.push('View Details');
    // }
    return actions;
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    // this.getOrderReturnList();
  }

  onRowAction(data) {
    if(data.action === "Delete"){
      let dialogRef = this.dialog.open(DeleteLocationDialog, {
        width: "600px",
        data: {
          location: data.row
        }
      });
  
      dialogRef.afterClosed().subscribe(deleted => {
        if (deleted) {
          this.getLocationList();
        }
      });
    }
    else{
      this.router.navigate(["/", URLS.multiLocation, URLS.editLocation, data.row.id]);
    }
  }

  
  onCellClick(data) {
    this.router.navigate(["/", URLS.multiLocation, URLS.locationDetail, data.row.id]);
  }



  ngOnInit(): void {
    this.getLocationList();
  }

}


@Component({
  selector: 'delete-location-dialog',
  templateUrl: '../dialogs/delete-location-dialog.html',
})
export class DeleteLocationDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteLocationDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private multiLocationService: MultiLocationService,
    private snackBar: MatSnackBar
  ) { }

  loading: boolean = false;

  deleteLocation() {
    this.loading = true;
    this.multiLocationService.deleteLocation(this.data.location.id).then(resp => {
      if (resp) {
        this.snackBar.open("Location deleted successfully.", "", { duration: 3000 });
        this.dialogRef.close(true);
      }
    });
  }
}