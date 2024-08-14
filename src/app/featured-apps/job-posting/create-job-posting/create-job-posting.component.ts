import { Component, OnInit } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { JobPostingService } from './../job-posting.service';



@Component({
  selector: 'app-create-job-posting',
  templateUrl: './create-job-posting.component.html',
  styleUrls: ['./create-job-posting.component.scss']
})
export class CreateJobPostingComponent implements OnInit {

  constructor(
    private jobPostingService: JobPostingService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackbarService: MatSnackBar,) { }

  loading: boolean = false;
  URLS = URLS;


  createJobPostingForm = this.fb.group({
    job_title: ['', [Validators.required,Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]],
    is_active: [false],
    job_expiry_date: [''],
    job_city: ['',[Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]],
    department: ['', [Validators.required,Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]],
    working_hours: ['', [Validators.required ,Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]],
    qualification: ['', [Validators.required,Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]],
    no_of_positions: [''],
    age_limit: ['', [Validators.required,Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]],
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
    // Other Section
    comments: ['',[Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]],
    additional_requirements: ['',[Validators.pattern(/^[^!`'#%:;<>={}~\$\\\*\+\/\\\?\[\]\^\|]+$/)]],
  })


  onSubmit() {
    this.loading = true;
    this.jobPostingService.createJobPosting(this.createJobPostingForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbarService.open('Jop created', "", { duration: 3000 });
        this.router.navigate(['/', URLS.jobPosting]);
      }
    })
  }

  ngOnInit(): void {
  }

}
