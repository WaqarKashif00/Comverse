import { Component, OnInit,Inject } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/auth.service';
import { Validators } from '@angular/forms';
import { MultiLocationService } from '../multi-location.service';
import { Column } from 'src/app/shared/datatable/datatable.component';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrls: ['./location-detail.component.scss']
})
export class LocationDetailComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private multiLocationService: MultiLocationService,
    private snackbar: MatSnackBar,
    public dialog: MatDialog,
    private route: ActivatedRoute,

  ) {
    this.sublocationId = this.route.snapshot.params.id

  }

  loading = false;
  URLS = URLS;
  locationDetail = {};
  locationList = [];
  sublocationId:any;
  name:string = '';

  getLocationDetail() {
    this.loading = true;
    this.multiLocationService.getLocationDetail(this.sublocationId).then(resp => {
      this.loading = false;
      if (resp) {
        this.name = resp.data.title
        // this.subLocationGroup = resp.data;
        // this.totalCount = resp.data.count;
      }
    });
  }


  rowActionsSub = row => {
    let actions = [];
      actions.push('Edit');
      actions.push('Delete');
      // actions.push('View Details');
    // else{
    //   actions.push('View Details');
    // }
    return actions;
  }



  // subLocationGroup = [{id:1,title:'ahmad',description:'haha'},{id:2,title:'ahmad',description:'haha'}];
  subLocationGroup = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;

  columns: Column[] = [
    {
      title: "Title",
      selector: "title",
    },
    // {
    //   title: "Description",
    //   selector: "description",
    // },
    // {
    //   title: "Reason For Change",
    //   selector: "reason_for_change",
    // },
    // {
    //   title: "Status",
    //   selector: "status",
    //   cell: row => `<span class="label ${row.status == 'Approve' ? 'success' : ''}${row.status == 'Disapprove' ? 'warning' : ''}">${row.status}</span>`
    // }
  ];



  getSubLocationGroupList() {
    this.loading = true;
    this.multiLocationService.getSubLocationGroupList(this.sublocationId).then(resp => {
      this.loading = false;
      if (resp) {
        this.subLocationGroup = resp.data;
        this.totalCount = resp.data.count;
      }
    });
  }
  getSubLocationList() {
    this.loading = true;
    this.multiLocationService.getSubLocationList(this.sublocationId).then(resp => {
      this.loading = false;
      if (resp) {
        this.subLocation = resp.data;
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

  // (rowAction)="onRowAction($event)"

  onRowActionSub(data) {
    if (data.action === "Delete") {
      let dialogRef = this.dialog.open(DeleteSubLocationDialog, {
        width: "600px",
        data: {
          subLocation: data.row
        }
      });

      dialogRef.afterClosed().subscribe(deleted => {
        if (deleted) {
          this.getSubLocationList();
        }
      });
    }
    else{
      this.EditSubLocation(data);

    }
  }

  onRowAction(data) {
    if (data.action === "Delete") {
      let dialogRef = this.dialog.open(DeleteSubLocationGroupDialog, {
        width: "600px",
        data: {
          subLocationGroup: data.row
        }
      });

      dialogRef.afterClosed().subscribe(post => {
        if (post) {
          this.getSubLocationGroupList();
        }
      });
    }
    else{
      this.EditSubLocationGroup(data);

    }
  }

  // rowActions = row => {
  //   let actions = [];
  //     actions.push('Delete');
  //     actions.push('Edit');
  //     // actions.push('View Details');
  //   // else{
  //   //   actions.push('View Details');
  //   // }
  //   return actions;
  // }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    // this.getOrderReturnList();
  }

  
  onCellClick(data) {
    // this.EditSubLocationGroup();
    // this.router.navigate(["/", URLS.multiLocation, URLS.locationDetail, data.row.id]);
  }

  
  AddSubLocation() {
    let dialogRef = this.dialog.open(AddSubLocationDialog, {
      width: "600px",
      data: {
        subLocation: this.sublocationId
      }
    });

    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        this.getSubLocationList();
      }
    });
  }
  AddSubLocationGroup() {
    let dialogRef = this.dialog.open(AddSubLocationGroupDialog, {
      width: "600px",
      data: {
        sublocationGroup: this.sublocationId
      }
    });

    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        this.getSubLocationGroupList();
      }
    });
  }
  EditSubLocation(data) {
    let dialogRef = this.dialog.open(EditSubLocationDialog, {
      width: "600px",
      data: {
        sublocation: data.row,
        sublocationGroup: this.sublocationId
      }
    });

    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        this.getSubLocationList();
      }
    });
  }
  EditSubLocationGroup(data) {
    let dialogRef = this.dialog.open(EditSubLocationGroupDialog, {
      width: "600px",
      data: {
        subLocationGroup: data.row
      }
    });

    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        this.getSubLocationGroupList();
      }
    });
  }





  // getLocation() {
  //   this.loading = true;
  //   this.multiLocationService.getLocation().then(resp => {
  //     if(resp) {
  //       this.locationDetail = resp.data;
  //     }
  //   });
  // }


  // Sub Location Values


  // subLocation = [{id:1,title:'ahmad',description:'haha'},{id:2,title:'ahmad',description:'haha'}];
  subLocation = [];
  totalCountSubLocation: number = 0;
  pageNumberSubLocation: number = 1;
  pageSizeSubLocation: number = 20;

  onPageChangeSub(event: PageEvent) {
    this.pageNumberSubLocation = event.pageIndex + 1;
    this.pageSizeSubLocation = event.pageSize;
    // this.getOrderReturnList();
  }


  columnsSub: Column[] = [
    {
      title: "Title",
      selector: "title",
    },
    // {
    //   title: "Address",
    //   selector: "address",
    // },
    // {
    //   title: "Zip Code",
    //   selector: "zipcode",
    // },
    // {
    //   title: "Reason For Change",
    //   selector: "reason_for_change",
    // },
    // {
    //   title: "Status",
    //   selector: "status",
    //   cell: row => `<span class="label ${row.status == 'Approve' ? 'success' : ''}${row.status == 'Disapprove' ? 'warning' : ''}">${row.status}</span>`
    // }
  ];

  // rowActionsSub = row => {
  //   let actions = [];
  //     actions.push('Delete');
  //     actions.push('Edit');
  //     // actions.push('View Details');
  //   // else{
  //   //   actions.push('View Details');
  //   // }
  //   return actions;
  // }

  ngOnInit(): void {
    this.getSubLocationGroupList();
    this.getSubLocationList();
    this.getLocationDetail();
  }

}


@Component({
  selector: 'add-sub-location',
  templateUrl: '../dialogs/add-sub-location-dialog.html',
  styleUrls: ['./location-detail.component.scss']

})
export class AddSubLocationDialog {
  constructor(
    public dialogRef: MatDialogRef<AddSubLocationDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private multiLocationService: MultiLocationService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,

  ) {

  }

  subLocationGroupList = [];
  city = [];

  loading: boolean = false;
  subLocationForm = this.fb.group({
    title: [''],
    location: [null],
    sub_location_group: [null],
    city: [null],
    address: [''],
    zipcode: [''],
    is_warehouse: [false],
  })


  onSubmit() {
    this.loading = true;
    this.subLocationForm.patchValue({location:this.data.subLocation})
    this.multiLocationService.createSublocation(this.subLocationForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.loading = false;
        this.dialogRef.close(true);
      }
    });
  }
  getSubLocationGroupList() {
    this.loading = true;
    this.multiLocationService.getSubLocationGroup(this.data.subLocation).then(resp => {
      this.loading = false;
      if (resp) {
        this.subLocationGroupList = resp.data
      }
    });
  }
  getCityList() {
    this.loading = true;
    this.multiLocationService.getCityList(this.data.subLocation).then(resp => {
      this.loading = false;
      if (resp) {
        this.city = resp.data? [{id:1,name:"Lahore"}]:[{id:1,name:"Lahore"}];
      }
    });
  }
  ngOnInit(): void {
    this.getSubLocationGroupList();
    this.getCityList();
  }
}

@Component({
  selector: 'edit-sub-location',
  templateUrl: '../dialogs/edit-sub-location-dialog.html',
})
export class EditSubLocationDialog {
  constructor(
    public dialogRef: MatDialogRef<EditSubLocationDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private multiLocationService: MultiLocationService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
  }

  subLocationGroupList = [];
  cityList = [];

  loading: boolean = false;
  subLocationForm = this.fb.group({
    id:[null],
    title: [''],
    location: [null],
    sub_location_group: [null],
    city: [null],
    address: [''],
    zipcode: [''],
    is_warehouse: [false],
  })

  getSubLocationDetail() {
    this.loading = true;
    this.multiLocationService.getSubLocationDetail(this.data.sublocation.id).then(resp => {
      this.loading = false;
      if (resp) {
        this.subLocationForm.patchValue(resp.data)
        // this.subLocation = resp.data;
        // this.totalCount = resp.data.count;
      }
    });
  }

  onSubmit() {
    this.loading = true;
    // this.subLocationForm.patchValue({location:this.data.subLocation})
    this.multiLocationService.updateSubLocationGroup(this.subLocationForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.loading = false;
        this.dialogRef.close(true);
      }
    });
  }
  getSubLocationGroupList() {
    this.loading = true;
    this.multiLocationService.getSubLocationGroup(this.data.sublocationGroup).then(resp => {
      this.loading = false;
      if (resp) {
        this.subLocationGroupList = resp.data
      }
    });
  }
  getCityList() {
    this.loading = true;
    this.multiLocationService.getCityList(this.data.sublocationGroup).then(resp => {
      this.loading = false;
      if (resp) {
        // this.cityList = resp.data
        this.cityList = resp.data? [{id:1,name:"Lahore"}]:[{id:1,name:"Lahore"}];

      }
    });
  }
  ngOnInit(): void {
    this.getSubLocationGroupList();
    this.getCityList();
    this.getSubLocationDetail();
  }
}

@Component({
  selector: 'edit-sub-location-group',
  templateUrl: '../dialogs/edit-sub-location-group-dialog.html',
})
export class EditSubLocationGroupDialog {
  constructor(
    public dialogRef: MatDialogRef<EditSubLocationGroupDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private multiLocationService: MultiLocationService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
  }

  locationList = [];

  // getLocationList() {
  //   debugger
  //   this.loading = true;
  //   this.multiLocationService.getLocationList().then(resp => {
  //     this.loading = false;
  //     if (resp) {
  //       debugger
  //       this.locationList = resp.data;
  //       // this.totalCount = resp.data.count;
  //     }
  //   });
  // }

  getSubLocationGroupDetils() {
    let ID = this.data.subLocationGroup.id;
    this.loading =true;
    this.multiLocationService.getSingleSubLocationGroup(this.data.subLocationGroup.id).then((resp=> {
      this.loading = false;
      if (resp) {
        this.subLocationGroupForm.patchValue(resp.data)
      }
    }))
  }


  loading: boolean = false;

  subLocationGroupForm = this.fb.group({
    id: [null],
    // sub_location_group: [null],
    title: [''],
    location: [''],
    // sub_location: [''],
    // city: [''],
    // address: [''],
    // zip_code: [''],
    // is_warehouse: [false],
  })

  onSubmit() {
    // this.subLocationGroupForm.patchValue(this.data.id)
    this.loading = true;
    this.multiLocationService.editSubLocationGroup(this.subLocationGroupForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.loading = false;
        this.dialogRef.close(true);
      }
    });
  }
  ngOnInit(): void {
    this.getSubLocationGroupDetils();
    // this.getLocationList();
  }
}


@Component({
  selector: 'delete-sub-location-dialog',
  templateUrl: '../dialogs/delete-sub-location-dialog.html',
})
export class DeleteSubLocationDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteSubLocationDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private multiLocationService: MultiLocationService,
    private snackBar: MatSnackBar
  ) { }

  loading: boolean = false;

  deleteSubLocation() {
    this.loading = true;
    this.multiLocationService.deleteSubLocation(this.data.subLocation.id).then(resp => {
      if (resp) {
        this.snackBar.open("Sub Location deleted successfully.", "", { duration: 3000 });
        this.dialogRef.close(true);
      }
    });
  }
}

@Component({
  selector: 'delete-sub-location-group-dialog',
  templateUrl: '../dialogs/delete-sub-location-group-dialog.html',
})
export class DeleteSubLocationGroupDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteSubLocationGroupDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private multiLocationService: MultiLocationService,
    private snackBar: MatSnackBar
  ) { }

  loading: boolean = false;

  deleteSubLocationGroup() {
    this.loading = true;
    this.multiLocationService.deleteSubLocationGroup(this.data.subLocationGroup.id).then(resp => {
      if (resp) {
        this.snackBar.open("Sub Location Group deleted.", "", { duration: 3000 });
        this.dialogRef.close(true);
      }
    });
  }
}





@Component({
  selector: 'add-sub-location-group',
  templateUrl: '../dialogs/add-sub-location-group-dialog.html',

})
export class AddSubLocationGroupDialog {
  constructor(
    public dialogRef: MatDialogRef<AddSubLocationGroupDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private multiLocationService: MultiLocationService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
  }

  locationList = [];
  mainObj:any

  // getLocationList() {
  //   debugger
  //   this.loading = true;
  //   this.multiLocationService.getLocationList().then(resp => {
  //     this.loading = false;
  //     if (resp) {
  //       debugger
  //       this.locationList = resp.data;
  //       // this.totalCount = resp.data.count;
  //     }
  //   });
  // }


  loading: boolean = false;

  subLocationGroupForm = this.fb.group({
    title: [''],
    location: [this.data.sublocationGroup],
    // sub_location: [''],
    // city: [''],
    // address: [''],
    // zip_code: [''],
    // is_warehouse: [false],
  })

  onSubmit() {
    // let title = this.subLocationGroupForm.get('title').value
    // this.mainObj = {title:title,location:this.data.sublocationGroup}
    // this.subLocationGroupForm = this.data.sublocationGroup
    // this.subLocationGroupForm.patchValue(this.data.sublocationGroup)
    this.loading = true;
    this.multiLocationService.createSubLocationGroup(this.subLocationGroupForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.dialogRef.close(true);
      }
    });
  }
  ngOnInit(): void {
    // this.getLocationList();
  }

}

