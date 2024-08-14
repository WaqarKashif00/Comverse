import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { ApplicantDetailComponent } from './applicant-detail/applicant-detail.component';
import { CreateJobPostingComponent } from './create-job-posting/create-job-posting.component';
import { EditJobPostingComponent } from './edit-job-posting/edit-job-posting.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { JobPostingComponent } from './job-posting/job-posting.component';



const routes: Routes = [
  {path: '', component:JobPostingComponent },
  {path: URLS.createJobPosting, component:CreateJobPostingComponent },
  {path: URLS.editJobPosting + '/:id', component:EditJobPostingComponent },
  {path: URLS.jobDetail + '/:id', component:JobDetailComponent },
  {path: URLS.applicantDetail + '/:id', component:ApplicantDetailComponent },


];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class JobPostingRoutingModule { }
