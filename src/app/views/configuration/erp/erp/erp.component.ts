import { Component, OnInit ,Inject } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import { ERPService } from './../erp.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {VendorsService } from '../../../vendors/vendors.service';



@Component({
  selector: 'app-erp',
  templateUrl: './erp.component.html',
  styleUrls: ['./erp.component.scss']
})
export class ErpComponent implements OnInit {

  constructor(
    private erpService: ERPService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackbarService: MatSnackBar,

  ) { }


  loading: boolean = false;
  URLS = URLS;
  panelOpenState = false;


  columns: Column[] = [
    {
      title: "Title",
      selector: "title",
      clickable: true
    },
    {
      title: "Type",
      selector: "type",
    },
    {
      title: "Status",
      selector: "is_active",
      cell: row => `<span class="label ${row.is_active ? 'success' : ''}">${row.is_active ? 'Active' : 'Inactive'}</span>`
    },
  ];


  erpList = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  syncSettingDetails: any
  pageSize: number = 20;
  rowActions: string[] = ["Delete"];


  getDefaultSettingDetail() {
    this.loading = true;
    this.erpService.getDefaultSettingDetail().then(resp => {
      this.loading = false;
      if(resp) {
        this.syncSettingDetails = resp.data
        for(let i = 0; i<this.syncSettingDetails.triggers.length; i++){
          (
            this.createSettingForm.get('triggers') as FormArray
          ).push(this.fb.group({
            id:[null],
            is_tag:[false],
            is_active:[false],
            type:[''],
            tags:['']
          }))
        }
        this.createSettingForm.patchValue(this.syncSettingDetails);
      }
    });
  }


  getERPList() {
    this.loading = true;
    this.erpService.getERPList().then(resp => {
      this.loading = false;
      if(resp) {
        this.erpList = resp.data.results;
        this.totalCount = resp.data.count;
      }
    });
  }


  onDefaultSettingSubmit() {
    this.loading = true;
    this.erpService.saveSetting(this.createSettingForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbarService.open("Setting created successfully.", "", { duration: 3000 });
      }
    });
  }


  createSettingForm = this.fb.group({
    update_hold_quantity:[false,],
    scheduler_sync:[false],
    scheduler_type:[''],
    scheduler_duration:[''],
    restricted_tag_items:[''],
    triggers: this.fb.array([])
  })


  addTriggers() {
    (this.createSettingForm.get("triggers")as FormArray).push(
      this.fb.group({
        is_tag:[false],
        is_active:[false],
        type:[''],
        tags:['']
      })
    )
  }


  removeTriggers(index,id) {
    if(id) {
      this.loading = true;
      this.erpService.removeTrigger(id.value).then(resp => {
        this.loading = false;
        if (resp) {
           (this.createSettingForm.get("triggers") as FormArray).removeAt(index);
          this.snackbarService.open("Trigger removed successfully.", "", { duration: 3000 });
        }
      });
    } else {
      (this.createSettingForm.get("triggers") as FormArray).removeAt(index);
    }
  }


  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getERPList();
  }


  onRowAction(data) {
    let dialogRef = this.dialog.open(ERPDeleteDialog, {
      width: "600px",
      data: {
        erp: data.row
      }
    });

    dialogRef.afterClosed().subscribe(deleted => {
      if (deleted) {
        this.getERPList();
      }
    });
  }


  onCellClick(data) {
    this.EditERPIntegration(data);
  }


  PopUpForIntegration() {
    let dialogRef = this.dialog.open(AddERPIntegration, {
      width: "600px",
      // data: {
      //   erp: data.row
      // }
    });

    dialogRef.afterClosed().subscribe(post => {
      if (post) {
        this.getERPList();
      }
    });
  }


  EditERPIntegration(data) {
    let dialogRef = this.dialog.open( EditERPIntegration, {
      width: "600px",
      data: {
        erp: data.row
      }
    });

    dialogRef.afterClosed().subscribe(post => {
      if (post) {
        this.getERPList();
      }
    });
  }


  ngOnInit(): void {
    this.getERPList();
    this.getDefaultSettingDetail();
  }

}

// Add ERP Dialogs

@Component({
  selector: 'add-erp-integration-dialog',
  templateUrl: '../dialogs/add-erp-integration-dialog.html',
  styleUrls: ['./erp.component.scss']
})
export class AddERPIntegration {
  constructor(
    public dialogRef: MatDialogRef<AddERPIntegration>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private erpService: ERPService,
    private router: Router,
    private vendorsService: VendorsService,
  ) {}


  loading: boolean = false;
  vendors: any[] = [];
  locations: any[] = [];
  subLocations: any[] = [];
  pageNumber: number = 1;
  typeList: any[] = [];
  typeField: any[] = [];
  previousControlName = [];


  createIntegrationForm = this.fb.group({
    type: [''],
    title: [''],
    unique_identifier: [''],
    sync_zero_inventory: [false],
    order_posting: [false],
    add_hash: [false],
    auto_schedule: [false],
    inventory_percentage: [''],
    location: [null],
    sub_location: [[],''],
    vendor: [[],''],
    credentials: this.fb.group({}),
  })


  selectedType = this.createIntegrationForm.get("type").value;


  getVendors() {
    this.vendorsService.getVendorsList(this.pageNumber, 50).then(resp => {
      if(resp) {
        this.vendors = this.vendors.concat(resp.data.results);
      }
    });
  }


  getLocations() {
    this.erpService.getLocationList().then(resp => {
      if(resp) {
        this.locations=resp.data ? [{id:1,name:"PAk"}]:[];
      }
    });
  }


  getTypeList() {
    this.erpService.getTypeList().then(resp => {
      if(resp) {
        this.typeList = resp.data
        console.log(this.createIntegrationForm.value);
      }
    });
  }


  getSubLocations() {
    this.erpService.getSubLocationList(this.createIntegrationForm.get('location').value).then(resp => {
      if(resp) {
        this.subLocations=resp.data ? [{id:2,title:"India"},{id:3,title:"China"}]:[];
      }
    });
  }


  loadMore() {
    this.pageNumber++;
    this.getVendors();
  }


  onTypeSelect(event){
    this.loading = true;
    let type = event.value ? event.value : event;
    let credential = (this.createIntegrationForm.get("credentials") as FormGroup);

    this.erpService.getFieldList(event.value).then(resp => {
        if (resp) {
          if (this.selectedType) {
            if (type === this.selectedType) {
              resp.data.forEach(item => {
                this.previousControlName.push(item.name);
                credential.addControl(item.name, new FormControl(item.value || ''));
              });
            } else {
              this.previousControlName.forEach(item => {
                credential.removeControl(item);
              });
              this.previousControlName = [];
              resp.data.forEach(item => {
                this.previousControlName.push(item.name);
                credential.addControl(item.name, new FormControl(item.value || ''));
              });
            }
          } else {
            resp.data.forEach(item => {
              this.previousControlName.push(item.name);
              credential.addControl(item.name, new FormControl(item.value || ''));
            });
          }
          this.typeField = resp.data;
          this.selectedType = type;

        }
      }
  )}

  onSubmit() {
    console.log(this.createIntegrationForm.value)
      this.loading = true;
      this.erpService.saveIntegartion(this.createIntegrationForm.value).then(resp => {
        this.loading = false;
        if (resp) {
          this.snackBar.open("Integration created successfully.", "", { duration: 3000 });
          this.dialogRef.close(true);
        }
      });
  }


  ngOnInit(): void {
    
    this.getVendors();
    this.getLocations();
    this.getTypeList();
  }
}


// Edite ERP
@Component({
  selector: 'edit-erp-integration-dialog',
  templateUrl: '../dialogs/edit-erp-integration-dialog.html',
  styleUrls: ['./erp.component.scss']
})
export class EditERPIntegration {
  constructor(
    public dialogRef: MatDialogRef<AddERPIntegration>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private erpService: ERPService,
    private router: Router,
    private vendorsService: VendorsService,
  ) {}


  loading: boolean = false;
  credentailDetail: any
  vendors: any[] = [];
  locations: any[] = [];
  subLocations: any[] = [];
  pageNumber: number = 1;
  erpList = [];
  typeList: any[] = [];
  typeField: any[] = [];
  previousControlName = [];


  getVendors() {
    this.loading = true;
    this.vendorsService.getVendorsList(this.pageNumber, 50).then(resp => {
    this.loading = false;
      if(resp) {
        this.vendors = this.vendors.concat(resp.data.results);
      }
    });
  }


  getLocations() {
    this.loading = true;
    this.erpService.getLocationList().then(resp => {
    this.loading = false;
      if(resp) {
        this.locations = resp.data;
      }
    });
  }


  getFieldList() {
    this.loading = true;
    this.erpService.getFieldList(this.createIntegrationForm.get('type').value).then(resp => {
    this.loading = false;
      if(resp) {
        this.locations = resp.data;
      }
    });
  }


  
  getIntegrationDetail() {
    this.loading = true;
    let credential = (this.createIntegrationForm.get("credentials") as FormGroup);
    this.erpService.getIntegrationDetail(this.data.erp.id).then(resp => {
    this.loading = false;
      if (resp) {
        this.credentailDetail = resp.data;

        this.onTypeSelect(resp.data.type);
        let fields;
        if (resp.data) {
          fields = Object.keys(resp.data.credentials);
          fields.forEach(item => {
            credential.addControl(item, new FormControl(item.value || ''));
          });
          this.typeField = resp.data.credentials;
          this.erpService.getSubLocationList(resp.data.location).then(resp => {
            if(resp) {
              this.subLocations = resp.data;
            }
          });
          this.createIntegrationForm.patchValue(resp.data);
        }
      }});
  }


  compareType(obj1,obj2) {
    return obj1.type == obj2.type
  }


  onTypeSelect(event){
    this.loading = true;
    let type = event.value ? event.value : event;
    let credential = (this.createIntegrationForm.get("credentials") as FormGroup);
    this.erpService.getFieldList(event).then(resp => {
      this.loading = false;
        if (resp) {
          if (this.selectedType) {
            if (type === this.selectedType) {
              resp.data.forEach(item => {
                this.previousControlName.push(item.name);
                credential.addControl(item.name, new FormControl(item.value || ''));
              });
            } else {
              this.previousControlName.forEach(item => {
                credential.removeControl(item);
              });
              this.previousControlName = [];
              resp.data.forEach(item => {
                this.previousControlName.push(item.name);
                credential.addControl(item.name, new FormControl(item.value || ''));
              });
            }
          } else {
            resp.data.forEach(item => {
              this.previousControlName.push(item.name);
              credential.addControl(item.name, new FormControl(item.value || ''));
            });
          }
          this.typeField = resp.data;
          this.selectedType = type;

        }
      }
  )}



  getSubLocations() {
    this.erpService.getSubLocationList(this.createIntegrationForm.get('location').value).then(resp => {
      if(resp) {
        this.subLocations = resp.data;
      }
    });
  }


  loadMore() {
    this.pageNumber++;
    this.getVendors();
  }


  createIntegrationForm = this.fb.group({
    
    id: [null],
    type: [''],
    title: [''],
    unique_identifier: [''],
    sync_zero_inventory: [false],
    order_posting: [false],
    add_hash: [false],
    auto_schedule: [false],
    inventory_percentage: [''],
    location: [null],
    sub_location: [[],''],
    vendor: [[],''],
    credentials: this.fb.group({}),
  })

  selectedType = this.createIntegrationForm.get("type").value;


  compareData(obj1, obj2) {
    return obj1.id == obj2.id
  }


  onSubmit() {
      this.loading = true;
      this.createIntegrationForm.patchValue(this.data.id)
      this.erpService.updateIntegartion(this.createIntegrationForm.value).then(resp => {
        this.loading = false;
        if (resp) {
          this.snackBar.open("Integration Update successfully.", "", { duration: 3000 });
          this.dialogRef.close(true);
        }
      });
  }

  ngOnInit(): void {
    this.getVendors();
    this.getLocations();
    this.getIntegrationDetail();
  }
}


// Delete Integration

@Component({
  selector: 'erp-delete-dialog',
  templateUrl: '../dialogs/erp-delete-dialog.html',
})
export class ERPDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<ERPDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar,
    private erpService: ERPService,) {
  }


  loading: boolean = false;
  deleteERP() {
    this.loading = true;
    this.erpService.deleteERPIntegration(this.data.erp.id).then(resp => {
      if (resp) {
        this.snackbar.open("ERP Integration deleted successfully.", "", { duration: 3000 });
        this.dialogRef.close(true);
      }
    });
  }
}
