import { Component, OnInit ,Inject} from '@angular/core';
import URLS from 'src/app/shared/urls';
import { JobPostingService } from './../job-posting.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router,ActivatedRoute } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import { FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';


@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit {

  constructor(
    private jobPostingService: JobPostingService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackbarService: MatSnackBar,
    private route: ActivatedRoute,
    ) { 
      this.jobPostingID = this.route.snapshot.params.id;
    }

  loading: boolean = false;
  URLS = URLS;
  jobPostingID:any;


  onClick(){
    this.router.navigate(["/", URLS.jobPosting, URLS.editJobPosting, this.jobPostingID]);

  }


  columns: Column[] = [
    {
      title: "Name",
      selector: "first_name",
      clickable: true
    },
    {
      title: "Email",
      selector: "email",
    },
    {
      title: "City",
      selector: "city",
    },
    {
      title: "Phone",
      selector: "phone_no",
    },
    {
      title: "CV",
      selector: "upload_cv",
      clickable: true,
    cell: row => `<a class="link-color" href="upload_cv" target="_blank" ${row.upload_cv ? 'success' : 'href="upload_cv '}">View</a>`
    },
    {
      title: "Status",
      selector: "status",
      cell: row => `<span class="label ${row.status == 'Hired' ? 'success' : ''}${row.status == 'Rejected' ? 'warning' : ''}">${row.status}</span>`

    },
  ];


  applicantList = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;
  rowActions: string[] = ["Change Status"];
  mobeen:boolean = true;
  jobPostingDetails:any = [];
  job_title:string;
  job_id:any;
  job_expiry:any;
  created_at:any;
  active:any;


  getapplicantList() {
    this.loading = true;
    this.jobPostingService.getApplicantList(this.jobPostingID).then(resp => {
      this.loading = false;
      if(resp) {
        this.applicantList = resp.data.results;
        this.totalCount = resp.data.count;
      }
    });
  }


  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getapplicantList();
  }

  onRowAction(data) {
    let dialogRef = this.dialog.open(JobPostingDetailStatusChangeDialog, {
      width: "600px",
      data: {
        jobPostingDetail: data.row
      }
    });

    dialogRef.afterClosed().subscribe(deleted => {
      if (deleted) {
        this.getapplicantList();
      }
    });
  }

  onCellClick(data) {
    this.router.navigate(["/", URLS.jobPosting, URLS.applicantDetail, data.row.id]);
  }

  getJobPostingDetils() {
    this.loading =true;
    this.jobPostingService.getJobPosting(this.jobPostingID).then((resp=> {
      this.loading = false;
      if (resp) {
        this.jobPostingDetails = resp.data;
        this.job_title = resp.data.job_title;
        this.job_id = resp.data.id;
        this.created_at = resp.data.created_at;
        this.job_expiry = resp.data.job_expiry_date;
        this.active = resp.data.is_active;
      }
    }))
  }


  ngOnInit(): void {
    this.getapplicantList();
    this.getJobPostingDetils();
  }

}

// Status Change


@Component({
  selector: 'job-posting-detail-status-change-dialog',
  templateUrl: '../dialogs/job-posting-detail-status-change-dialog.html',
})
export class JobPostingDetailStatusChangeDialog {
  constructor(
    public dialogRef: MatDialogRef<JobPostingDetailStatusChangeDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    private jobPostingService: JobPostingService,
    ) {
  }

  loading: boolean = false;

  applicatStatus = this.fb.group({
    status_slect: [''],
  
  })
  jobPostingChangeStatus() {
    this.loading = true;
    this.jobPostingService.jobPostingChangeStatus(this.data.jobPostingDetail.id,this.applicatStatus.value.status_slect).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Status changed successfully.", "", { duration: 3000 });
        this.dialogRef.close(true);
      }
    });
  }
}