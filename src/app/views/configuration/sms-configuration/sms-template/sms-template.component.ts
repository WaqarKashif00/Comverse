import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { SMSConfigurationService } from '../smsconfiguration.service';

@Component({
  selector: 'app-sms-template',
  templateUrl: './sms-template.component.html',
  styleUrls: ['./sms-template.component.scss']
})
export class SmsTemplateComponent implements OnInit {

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

  navigateToMessageConfiguration() {
    this.router.navigate([URLS.smsConfiguration]);
  }

  getMessageTemplateList() {
    this.loading = true;
    this.smsConfigurationService.getSmsTemplateList().then(resp => {
      this.loading = false;
      if(resp) {
        this.template_list = resp.data;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getMessageTemplateList();
  }

  onCreate() {
    let dialogRef = this.dialog.open(MessageTemplateDialog, {
      width: "1200px",
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.getMessageTemplateList();
      }
    });
  }

  onRowAction(data) {
    if (data.action === "Edit") {
      let dialogRef = this.dialog.open(MessageTemplateDialog, {
        width: "1200px",
        data: {
          configuration: data.row
        }
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.getMessageTemplateList();
        }
      });
    }
   else if(data.action === "Delete") {
      let dialogRef = this.dialog.open(MessageTemplateDeleteDialog, {
        width: "600px",
        data: {
          configuration: data.row
        }
      });
      dialogRef.afterClosed().subscribe(deleted => {
        if(deleted) {
          this.getMessageTemplateList();
        }
      });
    }
  }

  ngOnInit(): void {
    this.getMessageTemplateList();
  }

}


@Component({
  selector: 'sms-template-delete-dialog',
  templateUrl: 'dialogs/sms-template-delete-dialog.html',
})
export class MessageTemplateDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<MessageTemplateDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private smsConfigurationService: SMSConfigurationService,
    private snackBar: MatSnackBar
  ) {}

  loading: boolean = false;
  title = this.data.configuration.title
  onDelete() {
    this.loading = true;
    this.smsConfigurationService.deleteSmsTemplate(this.data.configuration.id).then(resp => {
      if(resp) {
        this.snackBar.open("SMS Template deleted.", "", {duration: 2000});
        this.dialogRef.close(true);
      }
    })
  }
}


@Component({
  selector: 'sms-template-dialog',
  templateUrl: 'dialogs/sms-template-dialog.html',
  styleUrls: ['./sms-template.component.scss']

})
export class MessageTemplateDialog {
  constructor(
    public dialogRef: MatDialogRef<MessageTemplateDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private smsConfigurationService: SMSConfigurationService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) { }

  loading: boolean = false;
  provider_list = [];
  restrictedNumberTags:string[] = [];
  paramterList = [];
  triggerList = [];
  @ViewChild('textarea') private textarea;


  messageTemplateForm = this.fb.group({
    title: ['',[Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    service_provider: [],
    trigger: [''],
    is_active: [false],
    restriction_on_sms: [false],
    restricted_numbers: [''],
    message: [''],
  })

  addText(text){
    this.textarea.nativeElement.focus();
    let startPos = this.textarea.nativeElement.selectionStart;
    let value = this.textarea.nativeElement.value;
    this.textarea.nativeElement.value = value.substring(0, startPos) +'{{'+ text + "}}"+ value.substring(startPos, value.length);
    this.textarea.nativeElement.selectionEnd = startPos;
  }

  reset(){
      this.textarea.nativeElement.value='';
  }

  getSingleEmailTemplate() {
    this.loading = true;
    this.smsConfigurationService.getSingleSmsTemplate(this.data.configuration.id).then((resp)=>{
      this.loading = false;
      if (resp) {
        this.restrictedNumberTags = resp.data.restricted_numbers ? resp.data.restricted_numbers.split(",").filter(tag => tag) : [];
        this.messageTemplateForm.patchValue(resp.data)
      }
    })
  }

  getProviders() {
    this.loading = true;
    this.smsConfigurationService.getProviderList().then((resp)=> {
      this.loading = false;
      if (resp) {
        this.provider_list = resp.data;
      } 
    })
  }


  getTriggers() {
    this.loading = true;
    this.smsConfigurationService.getTriggers().then((resp)=> {
      this.loading = false;
      if (resp) {
        this.triggerList = resp.data;
      }
    })
  }

  onTriggerChange(event) {
    this.loading = true;
    this.smsConfigurationService.getVariables(event.value).then((resp)=> {
      this.loading = false;
      if (resp) {
        this.paramterList = resp.data;
      }
    })
  }



  onSave() {
    this.loading = true;
    let mainObj = this.messageTemplateForm.value;
    mainObj.restricted_numbers = this.restrictedNumberTags.length ? this.restrictedNumberTags.join(",") : "";
    if (this.data) {
      mainObj.id = this.data.configuration.id;
      this.smsConfigurationService.updateSmsTemplate(mainObj).then((resp)=> {
        this.loading = false;
        if (resp){
          this.snackBar.open("SMS Template saved.", "", { duration: 2000 });
          this.dialogRef.close(true);
        }
      })
    } else {
      this.smsConfigurationService.createSmsTemplate(mainObj).then((resp)=> {
        this.loading = false;
        if (resp){
          this.snackBar.open("SMS Template saved.", "", { duration: 2000 });
          this.dialogRef.close(true);
        }
      })
    }
  }

  ngOnInit(): void {
    this.getProviders();
    this.getTriggers();
    if (this.data) {
      this.getSingleEmailTemplate();
    }
  }
}