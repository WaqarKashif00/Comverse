import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { JobPostingService } from './../job-posting.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router,ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-applicant-detail',
  templateUrl: './applicant-detail.component.html',
  styleUrls: ['./applicant-detail.component.scss']
})
export class ApplicantDetailComponent implements OnInit {

    
  constructor(
    private jobPostingService: JobPostingService,
    private router: Router,
    private dialog: MatDialog,
    private snackbarService: MatSnackBar,
    private route: ActivatedRoute,
    ) { 
      this.jobDetailID = this.route.snapshot.params.id

    }


  loading: boolean = false;
  URLS = URLS;
  jobDetailID:any;
  jobDetail:any;
  name:any;
  email:any;
  city:any;
  phone:any;
  status:any;
  jobid:any;


  getapplicantList() {
    this.loading = true;
    this.jobPostingService.getApplicantDetail(this.jobDetailID).then(resp => {
      this.loading = false;
      if(resp) {
        this.jobDetail = resp.data.results;
        this.email = resp.data.email;
        this.city = resp.data.city;
        this.phone = resp.data.phone_no;
        this.name = resp.data.first_name;
        this.jobid = resp.data.job_info;
      }
    });
  }


  back(){
    this.router.navigate(["/", URLS.jobPosting, URLS.jobDetail, this.jobid]);
  }


  ngOnInit(): void {
    this.getapplicantList();
  }

}
