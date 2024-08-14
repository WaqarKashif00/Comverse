import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { EmailConfigurationService } from '../email-configuration.service';

@Component({
  selector: 'app-email-provider',
  templateUrl: './email-provider.component.html',
  styleUrls: ['./email-provider.component.scss']
})
export class EmailProviderComponent implements OnInit {

  constructor(
    private emailConfigurationService: EmailConfigurationService,
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
      title: "Provider type",
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

  navigateToEmailConfiguration() {
    this.router.navigate([URLS.emailConfiguration]);
  }

  getServiceProviderList() {
    this.loading = true;
    this.emailConfigurationService.getServiceProviderList().then(resp => {
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
    let dialogRef = this.dialog.open(EmailServiceProviderDialog, {
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
      let dialogRef = this.dialog.open(EmailServiceProviderDialog, {
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
      let dialogRef = this.dialog.open(EmailServiceProviderDeleteDialog, {
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
  selector: 'email-provider-delete-dialog',
  templateUrl: 'dialogs/email-provider-delete-dialog.html',
})
export class EmailServiceProviderDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<EmailServiceProviderDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private emailConfigurationService: EmailConfigurationService,
    private snackBar: MatSnackBar
  ) {}

  loading: boolean = false;
  provider_type = this.data.configuration.provider_type
  onDelete() {
    this.loading = true;
    this.emailConfigurationService.deleteServiceProvider(this.data.configuration.id).then(resp => {
      if(resp) {
        this.snackBar.open("Email Service Provider deleted.", "", {duration: 2000});
        this.dialogRef.close(true);
      }
    })
  }
}


@Component({
  selector: 'email-provider-dialog',
  templateUrl: 'dialogs/email-provider-dialog.html',
  styleUrls: ['./email-provider.component.scss']

})
export class EmailServiceProviderDialog {
  constructor(
    public dialogRef: MatDialogRef<EmailServiceProviderDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private emailConfigurationService: EmailConfigurationService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) { }

  loading: boolean = false;
  providerType: string = '';
  fields: any;
  ProviderId;

  serviceProviderForm = this.fb.group({
    title: ['',[Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\\\?\[\]\^\|]+$/)]],
    provider_type: [''],
    credentials: this.fb.group({}),
    from_email: [''],
    default: [''],
    is_active: ['']
  })

  selectedProvider = this.serviceProviderForm.get("provider_type").value;
  previousControlName = [];

  onTypeChange(event) {
    this.loading = true;
    let type = event.value ? event.value : event;
    let credential = (this.serviceProviderForm.get("credentials") as FormGroup);
    this.emailConfigurationService.getFields(type).then((resp) => {
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
        if (this.data.configuration.id) {
          (this.serviceProviderForm.controls['provider_type'] as FormControl).disable();
          (this.serviceProviderForm.controls['provider_type'] as FormControl).updateValueAndValidity();
        }
      }
    })

  }


  getProviderTypes() {
    this.loading = true;
    this.emailConfigurationService.getAllProviderTypes().then((resp)=> {
      this.loading = false;
      if (resp) {
        console.log(resp)
        this.providerType = resp.data;
      }
    })
  }

  getProviderDetails() {
    this.loading = true;
    let credential = (this.serviceProviderForm.get("credentials") as FormGroup);
    this.emailConfigurationService.getServiceProviderDetail(this.data.configuration.id).then((resp)=> {
      this.loading = false;
      if (resp) {
        this.serviceProviderForm.addControl('id', new FormControl(null, [Validators.required]));
        this.onTypeChange(resp.data.provider_type);
        let fields;
        fields = Object.keys(resp.data.credentials);
        fields.forEach(item => {
          credential.addControl(item, new FormControl(item.value || '', [Validators.required]));
        });
        this.serviceProviderForm.patchValue(resp.data)
      }
    })
  }



  onSave() {
    this.loading = true;
    let emailApiCall: any;
    let mainObj = this.serviceProviderForm.value;
    if (this.data) {
      mainObj.id = this.data.configuration.id;
      emailApiCall = this.emailConfigurationService.updateServiceProvider(mainObj)
    } else {
      emailApiCall = this.emailConfigurationService.createServiceProvider(mainObj)

    }
    emailApiCall.then(resp => {
      this.loading = false;
      if (resp) {
        this.snackBar.open("Email Service Provider saved.", "", { duration: 2000 });
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
