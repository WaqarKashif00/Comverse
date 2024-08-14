import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { JobPostingService } from './../job-posting.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router,ActivatedRoute } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import { FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';




@Component({
  selector: 'app-edit-job-posting',
  templateUrl: './edit-job-posting.component.html',
  styleUrls: ['./edit-job-posting.component.scss']
})
export class EditJobPostingComponent implements OnInit {

  
  constructor(
    private jobPostingService: JobPostingService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackbarService: MatSnackBar,
    private route: ActivatedRoute,
    ) { 
      this.jobPostingID = this.route.snapshot.params.id

    }


  loading: boolean = false;
  URLS = URLS;
  jobPostingID:number;


  editJobPostingForm = this.fb.group({
    id:[null],
    job_title: ['', [Validators.required ,Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]],
    status: [false],
    job_expiry_date: [''],
    job_city: ['',[Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]],
    department: ['', [Validators.required,Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]],
    working_hours: ['', [Validators.required]],
    qualification: ['', [Validators.required,Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]],
    no_of_positions: [''],
    age_limit: ['', [Validators.required ,Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]],
    gender_preference: [''],
    experience: [''],
    requirements: ['', [Validators.required,Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]],  
    responsibilities: ['',[Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]],
    knowledge_required: ['',[Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]],
    middle_name: [false],
    age: [false],
    religion: [false],
    gender: [false],
    country: [false],
    zip_code: [false],
    cnic: [false],
    issue_date: [false],
    date_of_birth: [false],
    marital_status: [false],
    title: [false],
    address_present: [false],
    city: [false],
    language: [false],
    expiry_date: [false],
    degree: [false],
    institution: [false],
    grade: [false],
    degree_start: [false],
    degree_end: [false],
    reference_name: [false],
    relationship_type: [false],
    company: [false],
    email: [false],
    phone: [false],
    employer_name: [false],
    experience_position: [false],
    experience_start: [false],
    experience_end: [false],
    certification_name: [false],
    certification_start: [false],
    certification_end: [false],
    comments: ['',[Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]],
    additional_requirements: ['',[Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]],
  })


  getJobPostingDetils() {
    this.loading =true;
    this.jobPostingService.getSingleJobPosting(this.jobPostingID).then((resp=> {
      this.loading = false;
      if (resp) {
        this.editJobPostingForm.patchValue(resp.data)
      }
    }))
  }


  onSubmit() {
    this.loading = true;
    this.jobPostingService.updateJobPosting(this.editJobPostingForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbarService.open('jop posting updated', "", { duration: 3000 });
        this.router.navigate(['/', URLS.jobPosting]);
      }
    })
  }


  ngOnInit(): void {
    this.getJobPostingDetils();
  }

}
