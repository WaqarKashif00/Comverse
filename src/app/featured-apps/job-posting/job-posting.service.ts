import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import Axios from 'axios';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';
import { id } from '@swimlane/ngx-charts';


@Injectable({
  providedIn: 'root'
})
export class JobPostingService {

  constructor(private authservice: AuthService, private snackbar: MatSnackBar) { }

  

  // // Get Job Posting List

  getJobPostingList() {
    return Axios.get( environment.backend_url + '/jobposting/jobs_list' ,{
      headers: {
        Authorization: this.authservice.token
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authservice.signout();
      }
    });
  }

  
  createJobPosting(data) {
    return Axios.post( environment.backend_url + '/jobposting/jobview', data, {
      headers: {
        Authorization: this.authservice.token
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authservice.signout();
      }
    });
  }


  
  deleteJobPosting(id) {
    return Axios.delete(environment.backend_url + '/jobposting/jobview/' + id, {
      headers: {
        Authorization: this.authservice.token
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authservice.signout();
      }
    });
  }

  getSingleJobPosting(id) {
    return Axios.get( environment.backend_url + '/jobposting/jobview/'+ id, {
      headers: {
        Authorization: this.authservice.token
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authservice.signout();
      }
    });
  }


  updateJobPosting(data) {
    return Axios.put( environment.backend_url + '/jobposting/jobview', data, {
      headers: {
        Authorization: this.authservice.token
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authservice.signout();
      }
    });
  }

  
  changeStatus(id,currentstatus) {
    let data:any

    if(currentstatus ==='Activate'){
      data = {
        id:id,
        is_active:true,
      }
    }
    else{
      data = {
        id:id,
        is_active:false,
      }
    }
    return Axios.put(environment.backend_url + '/jobposting/job_status_change' ,data,{
      headers: {
        Authorization: this.authservice.token
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authservice.signout();
      }
    });
  }

  
  getApplicantList(id) {
    return Axios.get( environment.backend_url + '/jobposting/job_applications?job_id=' +id,{
      headers: {
        Authorization: this.authservice.token
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authservice.signout();
      }
    });
  }
// For jobDetails Second Api 
  getJobPosting(id) {
    return Axios.get( environment.backend_url + '/jobposting/jobview/'+ id + '?application_job_detail=true', {
      headers: {
        Authorization: this.authservice.token
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authservice.signout();
      }
    });
  }


  jobPostingChangeStatus(id,currentstatus) {
    let data:any

      data = {
        id:id,
        status:currentstatus,
      }
    return Axios.put(environment.backend_url + '/jobposting/application_status_change' ,data,{
      headers: {
        Authorization: this.authservice.token
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authservice.signout();
      }
    });
  }


  getApplicantDetail(id) {
    return Axios.get( environment.backend_url + '/jobposting/application_detail/'+ id, {
      headers: {
        Authorization: this.authservice.token
      }
    })
    .catch(error => {
      if (error.response.data.detail == "Session expired, Reopen the application!") {
        this.authservice.signout();
      }
    });
  }
}
