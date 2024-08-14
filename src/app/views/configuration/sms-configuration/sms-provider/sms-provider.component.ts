import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { SMSConfigurationService } from '../smsconfiguration.service';

@Component({
  selector: 'app-sms-provider',
  templateUrl: './sms-provider.component.html',
  styleUrls: ['./sms-provider.component.scss']
})
export class SmsProviderComponent implements OnInit {

  constructor(
    private smsConfigurationService: SMSConfigurationService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  loading: boolean = false;
  URLS = URLS;
  columns: Column[] = [
    {
      title: "Title",
      selector: "title",
    },
    {
      title: "Provider Type",
      selector: "provider_type",
    },
    {
      title: "Status",
      selector: "is_active",
      cell: row => `<span class="label ${row.is_active ? 'success' : ''}">${row.is_active ? 'Active' : 'Inactive'}</span>`
    },
  ];
  rowActions = ["Edit", "Delete"]
  service_providers = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;

  navigateToMessageConfiguration() {
    this.router.navigate([URLS.smsConfiguration]);
  }

  getServiceProviderList() {
    this.loading = true;
    this.smsConfigurationService.getServiceProviderList().then(resp => {
      this.loading = false;
      if(resp) {
        this.service_providers = resp.data;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getServiceProviderList();
  }

  onCreate() {
    let dialogRef = this.dialog.open(MessageServiceProviderDialog, {
      width: "600px",
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.getServiceProviderList();
      }
    });
  }

  onRowAction(data) {
    if (data.action === "Edit") {
      let dialogRef = this.dialog.open(MessageServiceProviderDialog, {
        width: "600px",
        data: {
          configuration: data.row
        }
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.getServiceProviderList();
        }
      });
    }
   else if(data.action === "Delete") {
      let dialogRef = this.dialog.open(MessageServiceProviderDeleteDialog, {
        width: "600px",
        data: {
          configuration: data.row
        }
      });
      dialogRef.afterClosed().subscribe(deleted => {
        if(deleted) {
          this.getServiceProviderList();
        }
      });
    }
  }

  ngOnInit(): void {
    this.getServiceProviderList();
  }

}

@Component({
  selector: 'sms-provider-delete-dialog',
  templateUrl: 'dialogs/sms-provider-delete-dialog.html',
})
export class MessageServiceProviderDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<MessageServiceProviderDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private smsConfigurationService: SMSConfigurationService,
    private snackBar: MatSnackBar
  ) {}

  loading: boolean = false;
  provider_type = this.data.configuration.provider_type
  onDelete() {
    this.loading = true;
    this.smsConfigurationService.deleteServiceProvider(this.data.configuration.id).then(resp => {
      if(resp) {
        this.snackBar.open("SMS Service Provider deleted.", "", {duration: 2000});
        this.dialogRef.close(true);
      }
    })
  }
}


@Component({
  selector: 'sms-provider-dialog',
  templateUrl: 'dialogs/sms-provider-dialog.html',
})
export class MessageServiceProviderDialog {
  constructor(
    public dialogRef: MatDialogRef<MessageServiceProviderDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private smsConfigurationService: SMSConfigurationService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) { }

  loading: boolean = false;
  providerType: string = '';
  fields: any;
  ProviderId;

  serviceProviderForm = this.fb.group({
    title: ['',[Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    provider_type: [''],
    credentials: this.fb.group({}), 
  })


  selectedProvider = this.serviceProviderForm.get("provider_type").value;
  previousControlName = [];

  onTypeChange(event) {
    this.loading = true;
    let type = event.value ? event.value : event;
    let credential = (this.serviceProviderForm.get("credentials") as FormGroup);
    this.smsConfigurationService.getFields(type).then((resp) => {
      this.loading = false;
      if (resp) {
        if (this.selectedProvider) {
          if (type === this.selectedProvider) {
            resp.data.forEach(item => {
              this.previousControlName.push(item.name);
              credential.addControl(item.name, new FormControl(item.value || '', [Validators.required]));
            });
          } else {
            this.previousControlName.forEach(item => {
              credential.removeControl(item);
            });
            this.previousControlName = [];
            resp.data.forEach(item => {
              this.previousControlName.push(item.name);
              credential.addControl(item.name, new FormControl(item.value || '', [Validators.required]));
            });
          }
        } else {
          resp.data.forEach(item => {
            this.previousControlName.push(item.name);
            credential.addControl(item.name, new FormControl(item.value || '', [Validators.required]));
          });
        }
        this.fields = resp.data;
        this.selectedProvider = type;
        if (this.data) {
          (this.serviceProviderForm.controls['provider_type'] as FormControl).disable();
          (this.serviceProviderForm.controls['provider_type'] as FormControl).updateValueAndValidity();
        }
      }
    })
  }


  getProviderTypes() {
    this.loading = true;
    this.smsConfigurationService.getAllProviderTypes().then((resp)=> {
      this.loading = false;
      if (resp) {
        this.providerType = resp.data;
      }
    })
  }

  getProviderDetails() {
    this.loading = true;
    let credential = (this.serviceProviderForm.get("credentials") as FormGroup);
    this.smsConfigurationService.getServiceProviderDetail(this.data.configuration.id).then((resp)=> {
      this.loading = false;
      if (resp) {
        this.serviceProviderForm.addControl('id', new FormControl(null, Validators.required));
        this.onTypeChange(resp.data.provider_type);
        let fields;
        fields = Object.keys(resp.data.credentials);
        fields.forEach(item => {
          credential.addControl(item, new FormControl(item.value || '', Validators.required));
        });
        this.serviceProviderForm.patchValue(resp.data)
      }
    })
  }


  onSave() {
    this.loading = true;
    let smsApiCall: any;
    let mainObj = this.serviceProviderForm.value;
    if (this.data) {
      mainObj.id = this.data.configuration.id;
      smsApiCall = this.smsConfigurationService.updateServiceProvider(mainObj)
    } else {
      smsApiCall = this.smsConfigurationService.createServiceProvider(mainObj)

    }
    smsApiCall.then(resp => {
      this.loading = false;
      if (resp) {
        this.snackBar.open("SMS Service Provider saved.", "", { duration: 2000 });
        this.dialogRef.close(true);
      }
    })
  }

  ngOnInit(): void {
    this.getProviderTypes();
    if (this.data) {
      this.getProviderDetails();
    } 
  }
}
