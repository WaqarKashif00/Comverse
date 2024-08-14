import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { CourierIntegrationDialog } from '../courier-integrations/courier-integrations.component';
import { LogisticConfigurationService } from '../logistic-configuration.service';

@Component({
  selector: 'app-add-courier-integrations',
  templateUrl: './add-courier-integrations.component.html',
  styleUrls: ['./add-courier-integrations.component.scss']
})
export class AddCourierIntegrationsComponent implements OnInit {

  constructor(
    private logisticConfigurationService: LogisticConfigurationService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  loading: boolean = false;
  URLS = URLS;

  localCouriers = [];
  InternationalCouriers = [];


    getCouriers() {
      this.loading = true;
      this.logisticConfigurationService.getCourierList().then((resp)=> {
        this.loading = false;
        if(resp) {
          console.log(resp)
          this.localCouriers = resp.data.local_courier;
          this.InternationalCouriers = resp.data.int_courier;
        }
      })
    }

    onCourierClick(data){
      let dialogRef = this.dialog.open(CourierIntegrationDialog, {
        width: "600px",
        data: data
      });
  
      dialogRef.afterClosed().subscribe(closed => {
        if (closed) {
        }
      });
    }


  ngOnInit(): void {    
    this.getCouriers();
  }

}
