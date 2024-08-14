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
  selector: 'app-courier-priority',
  templateUrl: './courier-priority.component.html',
  styleUrls: ['./courier-priority.component.scss']
})
export class CourierPriorityComponent implements OnInit {

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
  cities = [];
  errorIndex = null;
  isValid = true;




  defaultSortChanged(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.defaultPriority, event.previousIndex, event.currentIndex);
  }

  advancePrioritySortChanged(event: CdkDragDrop<any[]>, index) {
    moveItemInArray(this.advancePriorrity[index].courier_priority, event.previousIndex, event.currentIndex);
  }

  getCities() {
    this.loading = true;
    this.logisticConfigurationService.getCities().then((resp) => {
      this.loading = false;
      if (resp) {
        this.cities = resp.data;
      }
    })
  }


  getDefaultPriority() {
    this.loading = true;
    this.logisticConfigurationService.getDefaultPriority(this.storeID).then(resp => {
      this.loading = false;
      if (resp) {
        this.defaultPriority = resp.data.results;
      }
    });
  }


  getAdvancePriority() {
    this.loading = true;
    this.logisticConfigurationService.getAdvancePriority().then(resp => {
      this.loading = false;
      if (resp) {
        this.advancePriorrity = resp.data;
      }
    });
  }


  onChange(event, index) {
    let isSelected = false;
    for (let i = 0; i < this.advancePriorrity.length; i++) {
      if (event.value == this.advancePriorrity[i].main_city_id && index != i) {
        isSelected = true;
        break
      }
    }
    if (!isSelected) {
      this.errorIndex = null;
      this.isValid = true
      this.getSinglePriority(event.value, index);
    } else {
      this.errorIndex = index;
      this.isValid = false;
    }

  }


  getSinglePriority(id, index) {
    this.loading = true;
    this.logisticConfigurationService.getSingleAdvancePriority(id).then(resp => {
      this.loading = false;
      if (resp) {
        console.log(resp.data);
        this.advancePriorrity[index].courier_priority = resp.data;
      }
    });
  }


  addNewCityPrioorirty() {
    let object = {
      main_city_id: null,
      courier_priority: []
    }

    this.advancePriorrity.push(object)
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
    this.logisticConfigurationService.updateDefaultPriority(payload).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Default priority saved.", "", { duration: 3000 });
      }
    });
  }


  saveAdvancePriority() {
    this.loading = true;
    let payload = { city_data: this.advancePriorrity }
    this.logisticConfigurationService.updateCityPriority(payload).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("City priority saved.", "", { duration: 3000 });
      }
    });
  }

  onRemove(id, index) {
    if(id) {
      this.loading = true;
      this.logisticConfigurationService.deleteCityPriority(id).then((resp) => {
        this.loading = false;
        if (resp) {
          this.advancePriorrity.splice(index)
          this.snackbar.open("City priority removed.", "", { duration: 3000 });
  
        }
      })
    } else {
      this.advancePriorrity.splice(index)
    }


  }

  ngOnInit(): void {
    this.getDefaultPriority();
    this.getAdvancePriority();
    this.getCities();
  }
}

