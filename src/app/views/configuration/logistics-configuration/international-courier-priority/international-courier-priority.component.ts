import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import URLS from 'src/app/shared/urls';
import { VendorsService } from 'src/app/views/vendors/vendors.service';
import { LogisticConfigurationService } from '../logistic-configuration.service';

@Component({
  selector: 'app-international-courier-priority',
  templateUrl: './international-courier-priority.component.html',
  styleUrls: ['./international-courier-priority.component.scss']
})
export class InternationalCourierPriorityComponent implements OnInit {

  constructor(
    private logisticConfigurationService: LogisticConfigurationService,
    private authservice: AuthService,
    private vendorService: VendorsService,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
  ) { }

  URLS = URLS;
  loading: boolean = false;
  defaultPriority = [];
  advancePriorrity = [];
  storeID = null;
  stores = [];
  countries = [];
  errorIndex = null;
  isValid = true;
  internationalCouriers = [];

  defaultSortChanged(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.defaultPriority, event.previousIndex, event.currentIndex);
  }


  advancePrioritySortChanged(event: CdkDragDrop<any[]>, index) {
    moveItemInArray(this.advancePriorrity[index].courier_priority, event.previousIndex, event.currentIndex);
  }



  getCountries() {
    this.loading = true;
    this.logisticConfigurationService.getCountries().then((resp)=> {
      this.loading = false;
      if(resp) {
        this.countries = resp.data;
      }
    })
  }

  getAdvancePriority() {
    this.loading = true;
    this.logisticConfigurationService.getAdvanceInternationalPriority().then(resp => {
      this.loading = false;
      if (resp) {
        this.advancePriorrity = resp.data;
      }
    });
  }


  onChange(event, index) {
    let isSelected = false;
    for (let i = 0; i < this.advancePriorrity.length; i++) {
      if (event.value == this.advancePriorrity[i].country_id && index != i) {
        isSelected = true;
        break
      }
    }
    if (!isSelected) {
      this.errorIndex = null;
      this.isValid = true
      this.advancePriorrity[index].courier_priority = this.internationalCouriers;
    } else {
      this.errorIndex = index;
      this.isValid = false;
    }

  }


  getCourierPriority() {
    this.loading = true;
    this.logisticConfigurationService.getSingleInternationalAdvancePriority().then(resp => {
      this.loading = false;
      if (resp) {
        console.log(resp.data);
        this.internationalCouriers = resp.data;
      }
    });
  }


  addNewCountyrPriorirty() {
    let object = {
      courier_priority: []
    }

    this.advancePriorrity.push(object)
  }


  onRemove(id, index) {
    if(id) {
      this.loading = true;
      this.logisticConfigurationService.deleteCountryPriority(id).then((resp) => {
        this.loading = false;
        if (resp) {
          this.advancePriorrity.splice(index);
          this.snackbar.open("Country priority removed.", "", { duration: 3000 });
  
        }
      })
    } else {
      this.advancePriorrity.splice(index);

    }
  
  }

  getDefaultPriority() {
    this.loading = true;
    this.logisticConfigurationService.getDefaultInternationalPriority(this.storeID).then(resp => {
      this.loading = false;
      if (resp) {
        console.log(resp.data);
        this.defaultPriority = resp.data.results;
      }
    });
  }

  onStoreSelect() {
    this.getDefaultPriority();
  }

  saveDefaultPriority() {
    let payload = this.defaultPriority.map((courier, i) => {
      return {
        id: courier.id,
        priority: i
      }
    });

    this.loading = true;
    this.logisticConfigurationService.updateDefaultInternationalPriority(payload).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Default international priority saved.", "", { duration: 3000 });
        console.log(resp.data);
      }
    });
  }


  saveAdvancePriority() {
    this.loading = true;
    let payload = { country_data: this.advancePriorrity }
    this.logisticConfigurationService.updateCountryPriority(payload).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Country priority saved.", "", { duration: 3000 });
      }
    });
  }

  ngOnInit(): void {
    this.getDefaultPriority();
    this.getCountries();
    this.getCourierPriority();
    this.getAdvancePriority();

  }
}
