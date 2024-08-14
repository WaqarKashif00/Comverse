import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { LogisticConfigurationService } from './../logistic-configuration.service';
import { map } from 'rxjs/operators';
import { VendorsService } from './../../../vendors/vendors.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-courier-integrations',
  templateUrl: './courier-integrations.component.html',
  styleUrls: ['./courier-integrations.component.scss']
})
export class CourierIntegrationsComponent implements OnInit {

  constructor(
    private logisticConfigurationService: LogisticConfigurationService,
    private authservice: AuthService,
    private vendorService: VendorsService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
  ) { }

  loading: boolean = false;
  URLS = URLS;
  is_vendor = this.authservice.user.is_vendor;
  vendor_id = this.authservice.user.vendor_id;
  courierList = [];
  vendorFilter = [];
  filterString: string = "";
  count: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;
  column: Column[] = [
    {
      selector: "logo",
      cell: row => `<img src="${row.logo ? row.logo : '/assets/img/placeholder-image.png'}" class="table-row-thumbnail" />`,
      width: '50px',
    },
    {
      title: "Courier Name",
      selector: "courier",
    },
    {
      title: "City",
      selector: "location_name",
    },
    {
      title: "Sub Location",
      selector: "sub_location_name",
    },
    {
      title: "International",
      selector: "international",
      cell: row => `<span class="label ${row.international ? 'true' : ''}">${row.international ? 'International' : 'Local'}</span>`
    },
    {
      title: "Status",
      selector: "is_active",
      cell: row => `<span class="label ${row.is_active ? 'success' : ''}">${row.is_active ? 'Active' : 'Inactive'}</span>`
    }
  ];




  rowActions = row => {
    let actions = [];
    if (row.is_active == false) {
      actions.push('Activate');
      actions.push('Edit');
      actions.push('Delete');
    }
    else {
      actions.push('Deactivate');
      actions.push('Edit');
      actions.push('Delete');

    }
    return actions;
  }


  getVendors() {
    this.vendorService.getVendorsList(1, 250).then(resp => {
      if (resp) {
      let filters = [
      ];

      if (!this.is_vendor) {
        let vendors = [];
        vendors = resp.data.results.map(vendor => {
          return {
            value: vendor.id,
            label: vendor.name
          }
        });
        filters.push({
          title: "Vendor",
          key: "vendor_id",
          values: vendors
        });

      }
      this.vendorFilter = filters;

    }
  })
}


onFilter(filters) {
  this.pageNumber = 1;
  let tempFilterString: string = "";
  for (let i = 0; i < filters.length; i++) {
    if (filters[i].value) {
      tempFilterString += '&' + filters[i].key + '=' + filters[i].value;
    }
  }
  this.filterString = tempFilterString;
  this.getLocalCourierList();
}


  getLocalCourierList() {
    this.loading = true;
    if(this.is_vendor) {
      this.logisticConfigurationService.getIntegratedCourierList(this.pageNumber, this.pageSize, this.vendor_id, this.is_vendor).then(resp => {
        this.loading = false;
        if (resp) {
          this.courierList = resp.data.results;
          this.count = resp.data.count;
        }
      });
    } else {
      this.logisticConfigurationService.getIntegratedCourierList(this.pageNumber, this.pageSize, this.filterString, this.is_vendor).then(resp => {
        this.loading = false;
        if (resp) {
          this.courierList = resp.data.results;
          this.count = resp.data.count;
        }
      });
    }

  }


  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getLocalCourierList();
  }


  onRowAction(data) {
    let dialogRef;
    if(data.action =="Edit") {

    dialogRef = this.dialog.open(EditCourierIntegrationDialog, {
      width: "600px",
      data: data.row
    });


  } else if(data.action == "Delete") {
    dialogRef = this.dialog.open(DeleteIntegratedCourier, {
      width: "600px",
      data: data.row
    });
  } else if(data.action == "Deactivate") {
    dialogRef = this.dialog.open(DeactivateIntegratedCourier, {
      width: "600px",
      data: data.row
    });
  }  else if(data.action == "Activate") {
    this.loading = true;
    this.logisticConfigurationService.updateIntegratedCourier({id: data.row.id,is_active:data.row.is_active = true}).then(resp => {
      if(resp) {
        this.loading = false;
        this.snackbar.open("Integrated courier activated.", "", {duration: 2000});
      }
    })
    this.getLocalCourierList();

  }
  dialogRef.afterClosed().subscribe(updated => {
    if (updated) {
      this.getLocalCourierList();
    }
  });

  }


  showVendorColumnAndFilter() {
    if (!this.is_vendor) {
      this.column.push({
        title: "Vendor",
        selector: "vendor_name"
      })
    }
  }

  ngOnInit(): void {
    this.getLocalCourierList();
    this.getVendors();
  }
}


@Component({
  selector: 'courier-integration-dialog',
  templateUrl: '../dialogs/courier-integration-dialog.html',
  styleUrls: ['./courier-integrations.component.scss']
})
export class CourierIntegrationDialog {
  constructor(
    public dialogRef: MatDialogRef<CourierIntegrationDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private logisticConfigurationService: LogisticConfigurationService,
    private vendorService: VendorsService,
    private authservice: AuthService,

  ) {
  }

  loading: boolean = false;
  fields: any;
  location_name:any;
  location:any;
  location_id:any;
  sub_location_names:any;
  sub_location_ids:any;
  sub_locations:any;
  location_list:any;
  sub_location_list:any;
  vendors: any[];
  vendor:any;
  is_vendor = this.authservice.user.is_vendor;
  vendor_id = this.authservice.user.vendor_id;

  


  courierIntegrationForm = this.fb.group({
    vendor_id: [this.vendor_id],
    credentials: this.fb.group({}),
  })

  getVendors() {
    this.loading = true;
    this.vendorService.getVendorsList(1,250).then((resp)=>{
      this.loading = false;
      if (resp) {
        this.vendors = resp.data.results
      }
    })
  }



  getFields() {
    this.loading = true;
    let credentials = (this.courierIntegrationForm.get("credentials") as FormGroup);
    this.logisticConfigurationService.getFields(this.data.id).then((resp) => {
      this.loading = false;
      if (resp) {
        console.log(resp.data);
        this.fields = resp.data.fields;
        resp.data.fields.forEach(item => {
          credentials.addControl(item.name, new FormControl(item.value || '', [Validators.required]));
        });
      }
    })
  }

  selectVendor(event) {
    this.courierIntegrationForm.patchValue({
      vendor_id: event.value.id
    })
    console.log(this.courierIntegrationForm.value);
    
  }


  getLocation() {
    this.loading = true;
    this.logisticConfigurationService.getLocation().then((resp) => {
      this.loading = false;
      if (resp) {
        console.log(resp.data);
        this.location_list = resp.data;
      }
    })
  }

  getSubLocation(id) {
    this.loading = true;
    this.logisticConfigurationService.getSubLocation(id).then((resp) => {
      this.loading = false;
      if (resp) {
        console.log(resp.data);
        this.sub_location_list = resp.data;
      }
    })
  }

  onLocationSelect(event) {
    this.location_id = event.value.id;
    this.location_name = event.value.title;
    this.getSubLocation(event.value.id);
  }



  mapSubLocationID(data) {
    return data.id;
  }


  mapSubLocationName(data) {
    return data.title;
    
  }



  onSave() {
    this.loading = true;
    let mainObj = this.courierIntegrationForm.value;
    mainObj.courier_id = this.data.id;
    mainObj.location_id = this.location_id;
    mainObj.location_name = this.location_name;
    mainObj.sub_location_id = this.sub_locations.map(this.mapSubLocationID).join(",")
    mainObj.sub_location_name = this.sub_locations.map(this.mapSubLocationName).join(",")
    this.logisticConfigurationService.createIntegratedCourier(mainObj).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Courier integrated.", "", { duration: 3000 });
        this.dialogRef.close(true);
      }
    });
  }



  ngOnInit(): void {
    this.getFields();
    this.getLocation();
    this.getVendors();
  }
}



@Component({
  selector: 'edit-courier-integration-dialog',
  templateUrl: '../dialogs/edit-courier-integration-dialog.html',
  styleUrls: ['./courier-integrations.component.scss']
})
export class EditCourierIntegrationDialog {
  constructor(
    public dialogRef: MatDialogRef<EditCourierIntegrationDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private logisticConfigurationService: LogisticConfigurationService,
    private vendorService: VendorsService,
    private authservice: AuthService,

  ) {
  }

  loading: boolean = false;
  fields: any;
  location:any[];
  location_name:any;
  location_list:any;
  sub_location_list:any;
  location_id:any;
  sub_location_names:any;
  sub_location_ids:any;
  sub_locations:any;
  vendors: any[];
  vendor:any;
  is_vendor = this.authservice.user.is_vendor;
  vendor_id = this.authservice.user.vendor_id;


  courierIntegrationForm = this.fb.group({
    vendor_id: [this.vendor_id],
    credentials: this.fb.group({}),
  })


  getVendors() {
    this.loading = true;
    this.vendorService.getVendorsList(1,250).then((resp)=>{
      this.loading = false;
      if (resp) {
        this.vendors = resp.data.results
      }
    })
  }


  selectVendor(event) {
    this.courierIntegrationForm.patchValue({
      vendor_id: event.value.id
    })
    console.log(this.courierIntegrationForm.value);
    
  }



  getFieldData() {
    this.loading = true;
    let credentials = (this.courierIntegrationForm.get("credentials") as FormGroup);
    this.logisticConfigurationService.getIntegratedCourierDetails(this.data.id).then((resp) => {
      this.loading = false;
      if (resp) {
        let fields;
        this.fields = resp.data.courier_fields.fields;
        fields = resp.data.courier_fields.fields;
        this.vendor = {id:resp.data.courier_credentials.vendor_id}
        fields.forEach(item => {
          credentials.addControl(item.name, new FormControl(item.value || ''));
        });
        this.getSubLocation(resp.data.courier_credentials.location_id);
        this.location = Object.assign([], {id:resp.data.courier_credentials.location_id, title:resp.data.courier_credentials.location_name}) ;
        let subLocationID = resp.data.courier_credentials.sub_location_id.split(",");
        let subLocationName = resp.data.courier_credentials.sub_location_name.split(",");
        this.sub_locations = subLocationID.map((id, i) => {
          return {
            id,
            title: subLocationName[i]
          }
        })
        this.courierIntegrationForm.patchValue(resp.data.courier_credentials);
      }
    })
  }

  compareData(ob1, ob2)
  {
    return ob1.id == ob2.id
  }

  getLocation() {
    this.loading = true;
    this.logisticConfigurationService.getLocation().then((resp) => {
      this.loading = false;
      if (resp) {
        console.log(resp.data);
        this.location_list = resp.data;
      }
    })
  }

  onLocationSelect(event) {
    this.location_id = event.value.id;
    this.location_name = event.value.title;
    this.getSubLocation(event.value.id);
  }

  getSubLocation(id) {
    this.loading = true;
    this.logisticConfigurationService.getSubLocation(id).then((resp) => {
      this.loading = false;
      if (resp) {
        this.sub_location_list = resp.data;
      }
    })
  }


  mapSubLocationID(data) {
    return data.id;
  }


  mapSubLocationName(data) {
    return data.title;    
  }


  onSave() {
    this.loading = true;
    let mainObj = this.courierIntegrationForm.value;
    mainObj.id = this.data.id;
    mainObj.location_id = this.location_id;
    mainObj.location_name = this.location_name;
    mainObj.sub_location_id = this.sub_locations.map(this.mapSubLocationID).join(",")
    mainObj.sub_location_name = this.sub_locations.map(this.mapSubLocationName).join(",")
    this.logisticConfigurationService.updateIntegratedCourier(mainObj).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Integrated courier updated.", "", { duration: 3000 });
        this.dialogRef.close(true);
      }
    });
  }



  ngOnInit(): void {
    this.getFieldData();
    this.getLocation();
    this.getVendors();
  }
}

@Component({
  selector: 'delete-integrated-courier-dialog',
  templateUrl: '../dialogs/delete-integrated-courier.html',
})
export class DeleteIntegratedCourier {
  constructor(
    public dialogRef: MatDialogRef<DeleteIntegratedCourier>,
    @Inject(MAT_DIALOG_DATA) public data,
    private logisticConfigurationService: LogisticConfigurationService,
    private snackBar: MatSnackBar
  ) {}

  loading: boolean = false;

  onDelete() {
    this.loading = true;
    this.logisticConfigurationService.deleteIntegratedCourier(this.data.id).then(resp => {
      if(resp) {
        this.loading = false;
        this.snackBar.open("Integrated courier deleted.", "", {duration: 2000});
        this.dialogRef.close(true);
      }
    })
  }

  ngOnInit(): void {
    
  }
}


@Component({
  selector: 'deactivate-integrated-courier',
  templateUrl: '../dialogs/deactivate-integrated-courier-dialog.html',
})
export class DeactivateIntegratedCourier {
  constructor(
    public dialogRef: MatDialogRef<DeactivateIntegratedCourier>,
    @Inject(MAT_DIALOG_DATA) public data,
    private logisticConfigurationService: LogisticConfigurationService,
    private snackBar: MatSnackBar
  ) {}

  loading: boolean = false;

  onDeactivate() {
    this.loading = true;
    this.logisticConfigurationService.updateIntegratedCourier({id: this.data.id,is_active:this.data.is_active = false}).then(resp => {
      if(resp) {
        this.loading = false;
        this.snackBar.open("Integrated courier deactivated.", "", {duration: 2000});
        this.dialogRef.close(true);
      }
    })
  }

  ngOnInit(): void {
    console.log(this.data);
    
  }
}

