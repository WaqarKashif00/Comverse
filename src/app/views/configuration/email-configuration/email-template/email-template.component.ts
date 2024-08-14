import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder ,Validators} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { EmailConfigurationService } from '../email-configuration.service';

@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.scss']
})
export class EmailTemplateComponent implements OnInit {

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
      title: "Trigger",
      selector: "trigger",
    },
    {
      title: "Status",
      selector: "is_active",
      cell: row => `<span class="label ${row.is_active ? 'success' : ''}">${row.is_active ? 'Active' : 'Inactive'}</span>`
    },
  ];

  rowActions = ["Edit", "Delete"]
  template_list = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;

  navigateToEmailConfiguration() {
    this.router.navigate([URLS.emailConfiguration]);
  }

  getEmailTemplateList() {
    this.loading = true;
    this.emailConfigurationService.getEmailTemplateList().then(resp => {
      this.loading = false;
      if(resp) {
        this.template_list = resp.data;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getEmailTemplateList();
  }

  onCreate() {
    let dialogRef = this.dialog.open(EmailTemplateDialog, {
      width: "1200px",
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.getEmailTemplateList();
      }
    });
  }

  onRowAction(data) {
    if (data.action === "Edit") {
      let dialogRef = this.dialog.open(EmailTemplateDialog, {
        width: "1200px",
        data: {
          configuration: data.row
        }
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.getEmailTemplateList();
        }
      });
    }
   else if(data.action === "Delete") {
      let dialogRef = this.dialog.open(EmailTemplateDeleteDialog, {
        width: "600px",
        data: {
          configuration: data.row
        }
      });
      dialogRef.afterClosed().subscribe(deleted => {
        if(deleted) {
          this.getEmailTemplateList();
        }
      });
    }
  }

  ngOnInit(): void {
    this.getEmailTemplateList();
  }

}


@Component({
  selector: 'email-template-delete-dialog',
  templateUrl: 'dialogs/email-template-delete-dialog.html',
})
export class EmailTemplateDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<EmailTemplateDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private emailConfigurationService: EmailConfigurationService,
    private snackBar: MatSnackBar
  ) {}

  loading: boolean = false;
  onDelete() {
    this.loading = true;
    this.emailConfigurationService.deleteEmailTemplate(this.data.configuration.id).then(resp => {
      if(resp) {
        this.snackBar.open("Email Template deleted.", "", {duration: 2000});
        this.dialogRef.close(true);
      }
    })
  }
}


@Component({
  selector: 'email-template-dialog',
  templateUrl: 'dialogs/email-template-dialog.html',
  styleUrls: ['./email-template.component.scss']

})
export class EmailTemplateDialog {
  constructor(
    public dialogRef: MatDialogRef<EmailTemplateDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private emailConfigurationService: EmailConfigurationService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) { }

  @ViewChild('textarea') private textarea;
  loading: boolean = false;
  paramterList = [];
  triggerList = [];
  provider_list = [];
  emailCCTags:string[] = [];
  emailBCCTags:string[] = [];
  emailRestrictedTags:string[] = [];




  addText(text){
    this.textarea.nativeElement.focus();
    let startPos = this.textarea.nativeElement.selectionStart;
    let value = this.textarea.nativeElement.value;
    this.textarea.nativeElement.value = value.substring(0, startPos) +'{{'+ text + "}}"+ value.substring(startPos, value.length);
    this.textarea.nativeElement.selectionEnd = startPos;
  }


  emailTemplateForm = this.fb.group({
    title: ['',[Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    subject: ['',[Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    service_provider: [0],
    trigger: [''],
    is_active: [false],
    allow_cc_email: [false],
    allow_bcc_email: [false],
    cc_email: [''],
    bcc_email: [''],
    restriction_on_email: [false],
    restricted_emails: [''],
    template: [''],
  })

  onSave() {
    this.loading = true;
    let mainObj = this.emailTemplateForm.value;
    mainObj.cc_email = this.emailCCTags.length ? this.emailCCTags.join(",") : "";
    mainObj.bcc_email = this.emailBCCTags.length ? this.emailBCCTags.join(",") : "";
    mainObj.restricted_emails = this.emailRestrictedTags.length ? this.emailRestrictedTags.join(",") : "";
    if (this.data) {
      mainObj.id = this.data.configuration.id;
      this.emailConfigurationService.updateEmailTemplate(mainObj).then((resp)=> {
        this.loading = false;
        if (resp){
          this.snackBar.open("Email Template saved.", "", { duration: 2000 });
          this.dialogRef.close(true);
        }
      })
    } else {
      this.emailConfigurationService.createEmailTemplate(mainObj).then((resp)=> {
        this.loading = false;
        if (resp){
          this.snackBar.open("Email Template saved.", "", { duration: 2000 });
          this.dialogRef.close(true);
        }
      })
    }

  }

  getSingleEmailTemplate() {
    this.loading = true;
    this.emailConfigurationService.getSingleEmailTemplate(this.data.configuration.id).then((resp)=>{
      this.loading = false;
      if (resp) {
        this.emailCCTags = resp.data.cc_email ? resp.data.cc_email.split(",").filter(tag => tag) : [];
        this.emailBCCTags = resp.data.bcc_email ? resp.data.bcc_email.split(",").filter(tag => tag) : [];
        this.emailRestrictedTags = resp.data.restricted_emails ? resp.data.restricted_emails.split(",").filter(tag => tag) : [];
        this.emailTemplateForm.patchValue(resp.data)
      }
    })
  }

  getProviders() {
    this.loading = true;
    this.emailConfigurationService.getProviderList().then((resp)=> {
      this.loading = false;
      if (resp) {
        this.provider_list = resp.data;
      }
    })
  }

  getTriggers() {
    this.loading = true;
    this.emailConfigurationService.getTriggers().then((resp)=> {
      this.loading = false;
      if (resp) {
        this.triggerList = resp.data;
      }
    })
  }

  onTriggerChange(event) {
    this.loading = true;
    this.emailConfigurationService.getVariables(event.value).then((resp)=> {
      this.loading = false;
      if (resp) {
        this.paramterList = resp.data;
      }
    })
  }

  ngOnInit(): void {
    this.getProviders();
    this.getTriggers();
    if (this.data) {
    this.getSingleEmailTemplate();
    }
  }
}