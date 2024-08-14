import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { environment } from 'src/environments/environment';
import { JobPostingService } from './../job-posting.service';


@Component({
  selector: 'app-job-posting',
  templateUrl: './job-posting.component.html',
  styleUrls: ['./job-posting.component.scss']
})
export class JobPostingComponent implements OnInit {

  constructor(
    private jobPostingService: JobPostingService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  
  loading: boolean = false;
  URLS = URLS;


  columns: Column[] = [
    {
      title: "Job Title",
      selector: "job_title",
      clickable: true
    },
    {
      title: "Posting Date",
      selector: "created_at",
      pipe: 'date',
      dateFormat: 'h:mm a MMM d'
    },
    {
      title: "Expiry Date",
      selector: "job_expiry_date",
      pipe: 'date',
      dateFormat: 'h:mm a MMM d'
    },
    {
      title: "Submissions",
      selector: "0",
    },
    {
      title: "Status",
      selector: "is_active",
      cell: row => `<span class="label ${row.is_active ? 'success' : ''}">${row.is_active ? 'Active' : 'Inactive'}</span>`
    },
  ];


  jobPostingList = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;


  rowActions = row => {
    let actions = [];
    if(row.is_active ===true){
      actions.push('Deactivate');
      actions.push('Edit');
      actions.push('Delete');
    }
    else{
      actions.push('Activate');
      actions.push('Edit');
      actions.push('Delete');
    }
    return actions;
  }


  getJobPostingList() {
    this.loading = true;
    this.jobPostingService.getJobPostingList().then(resp => {
      this.loading = false;
      if(resp) {
        this.jobPostingList = resp.data.results;
        this.totalCount = resp.data.count;
      }
    });
  }


  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getJobPostingList();
  }

  onRowAction(data) {
    if(data.action === "Delete"){
      let dialogRef = this.dialog.open(JobPostingDeleteDialog, {
        width: "600px",
        data: {
          jobPosting: data.row
        }
      });
  
      dialogRef.afterClosed().subscribe(deleted => {
        if (deleted) {
          this.getJobPostingList();
        }
      });
    }
    else if(data.action === "Edit"){
    this.router.navigate(["/", URLS.jobPosting, URLS.editJobPosting, data.row.id]);
    }
    else if(data.action === "Activate" || data.action === "Deactivate"){
      let dialogRef = this.dialog.open(JobPostingStatusChangeDialog, {
        width: "600px",
        data: {
          action:data.action,
          jobPosting: data.row
        }
      });
  
      dialogRef.afterClosed().subscribe(deleted => {
        if (deleted) {
          this.getJobPostingList();
        }
      });
    }
  }


  onCellClick(data) {
    this.router.navigate(["/", URLS.jobPosting, URLS.jobDetail, data.row.id]);
  }


  ngOnInit(): void {
    this.getJobPostingList();
  }

}



@Component({
  selector: 'job-posting-delete-dialog',
  templateUrl: '../dialogs/job-posting-delete-dialog.html',
})
export class JobPostingDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<JobPostingDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar,
    private jobPostingService: JobPostingService,) {
  }

  loading: boolean = false;


  deleteJobPosting() {
    this.loading = true;
    this.jobPostingService.deleteJobPosting(this.data.jobPosting.id).then(resp => {
      if (resp) {
        this.loading = false;
        this.snackbar.open("Job posting deleted successfully.", "", { duration: 2000 });
        this.dialogRef.close(true);
      }
    });
  }
}

// Status Change

@Component({
  selector: 'job-posting-status-change-dialog',
  templateUrl: '../dialogs/job-posting-status-change-dialog.html',
})
export class JobPostingStatusChangeDialog {
  constructor(
    public dialogRef: MatDialogRef<JobPostingStatusChangeDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar,
    private jobPostingService: JobPostingService,
    ) {
  }

  loading: boolean = false;


  changeStatus() {
    this.loading = true;
    this.jobPostingService.changeStatus(this.data.jobPosting.id,this.data.action).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Status changed successfully.", "", { duration: 3000 });
        this.dialogRef.close(true);
      }
    });
  }
}




