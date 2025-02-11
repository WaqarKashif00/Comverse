import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { ShippingService } from './shipping.service';
import { Router } from '@angular/router';
import { ProductsService } from '../../products/products.service';
import { ShippingRegionService } from '../shipping-regions/shipping-region.service';


@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {

  constructor(
    private shippingService: ShippingService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  URLS = URLS;
  loading: boolean = false;
  shippingMethods = [];
  zoneCount = null;

  // displayedColumns: Column[] = [
  //   {
  //     title: "Title",
  //     selector: "name",
  //     clickable: true
  //   },
  //   {
  //     title: "Amount",
  //     selector: "amount"
  //   }
  // ];
  // rowActions = ["Delete"];

  goBack() {
    this.router.navigate([URLS.configuration]);
  }

  manageZones() {
    this.router.navigate([URLS.zones]);
  }
  manageShippingRates() {
    this.router.navigate([URLS.shippingRates]);
  }

  getShippingMethods() {
    this.loading = true;
    this.shippingService.getShippingMethods(1, 50).then(resp => {
      this.loading = false;
      if (resp) {
        this.shippingMethods = resp.data.results;
      }
    })
  }

  getZoneCount() {
    this.shippingService.getZoneCount().then(resp => {
      if (resp) {
        this.zoneCount = resp.data;
      }
    })
  }


  onNewShippingMethod() {
    let dialogRef = this.dialog.open(AddShippingDialog, {
      width: "600px"
    });

    dialogRef.afterClosed().subscribe(added => {
      if (added) {
        this.getShippingMethods();
      }
    });
  }

  onCellClick(data) {
    let dialogRef = this.dialog.open(EditShippingDialog, {
      width: "600px",
      data: {
        shipping: data.row
      }
    });

    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        this.getShippingMethods();
      }
    });
  }

  onRowAction(data) {
    let dialogRef = this.dialog.open(DeleteShippingDialog, {
      width: "600px",
      data: {
        shipping: data.row
      }
    });

    dialogRef.afterClosed().subscribe(deleted => {
      if (deleted) {
        this.getShippingMethods();
      }
    });
  }

  ngOnInit(): void {
    this.getZoneCount();

  }

}


@Component({
  selector: 'add-shipping-dialog',
  templateUrl: './dialogs/add-shipping-dialog.html',
})
export class AddShippingDialog {
  constructor(
    public dialogRef: MatDialogRef<AddShippingDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private shippingService: ShippingService,
    private snackbar: MatSnackBar
  ) { }

  loading: boolean = false;
  shippingForm = this.fb.group({
    name: ["", [Validators.required, Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    amount: [0, [Validators.required, Validators.pattern('^[0-9]+$')]]
  });

  onSubmit() {
    this.loading = true;
    this.shippingService.createShipping(this.shippingForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Shipping method created successfuly.", "", { duration: 3000 });
        this.dialogRef.close(true);
      }
    })
  }
}


@Component({
  selector: 'zone-dialog',
  styleUrls: ['./shipping.component.scss'],
  templateUrl: './dialogs/zone-dialog.html',
})
export class AddZoneDialog {
  constructor(
    public dialogRef: MatDialogRef<AddZoneDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private shippingService: ShippingService,
    private shippingRegionService: ShippingRegionService,
    private snackbar: MatSnackBar
  ) {
    this.zoneId = this.data ? this.data.zoneId : null //for editing zone
  }
  zoneId = null;
  loading: boolean = false;
  citiesCheck: boolean = true;
  regions: [];
  countries: [];
  cities: [];
  selectedRegions: [];
  zoneForm = this.fb.group({
    title: ["", [Validators.required], Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)],
    region: [[], [Validators.required, Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    country: [[ Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    city: [[Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]]
  });

  getRegions() {
    this.shippingRegionService.getShippingRegionList(1, 50).then(resp => {
      this.loading = false;
      if (resp) {
        this.regions = resp.data.results;
      }
    })
  }

  getCountries() {
    if (this.zoneForm.value.region.length == 1) {
      this.countries = []
      this.cities = []
      this.shippingRegionService.getCountryList(this.zoneForm.value.region[0], 1, 100).then(resp => {
        if (resp) {
          this.countries = resp.data.results;
        }
      })
    }
  }

  getCities() {
    if (this.zoneForm.value.country.length == 1) {
      this.cities = []
      this.shippingRegionService.getzoneCityList(this.zoneForm.value.country[0], this.zoneId, 1, 500).then(resp => {
        if (resp) {
          this.cities = resp.data.results;
          console.log(this.cities.length);

          if (this.cities.length == 0) {

            this.citiesCheck = false;
          } else {
            this.citiesCheck = true
          }
        }
      })
    }
  }




  onSubmit() {

    this.loading = true;

    if (this.zoneId) {
      //update existing zone
      this.zoneForm.value.id = this.zoneId
      this.shippingService.updateZone(this.zoneForm.value).then(resp => {
        this.loading = false;
        if (resp) {
          this.snackbar.open("zone created successfuly.", "", { duration: 3000 });
          this.dialogRef.close(true);
        }
      })
    }
    else {
      //create new zone
      this.shippingService.createZone(this.zoneForm.value).then(resp => {
        this.loading = false;
        if (resp) {
          this.snackbar.open("zone created successfuly.", "", { duration: 3000 });
          this.dialogRef.close(true);
        }
      })
    }

  }

  ngOnInit() {
    this.loading = true
    this.regions = []
    this.countries = []
    this.cities = []

    if (this.zoneId) {
      // edit zone
      this.shippingService.getSingleZones(this.zoneId).then((resp) => {
        if (resp) {
          this.zoneForm.controls['title'].setValue(resp.data.title)
          this.zoneForm.controls['region'].setValue(resp.data.region)
          this.zoneForm.controls['country'].setValue(resp.data.country)
          this.zoneForm.controls['city'].setValue(resp.data.city)

          this.getRegions()
          this.getCountries()
          this.getCities()

        }
      })
    }
    else {
      // create new zone
      this.getRegions()
    }
  }
}


@Component({
  selector: 'delete-zone-dialog',
  templateUrl: './dialogs/delete-zone-dialog.html',
})
export class DeleteZoneDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteShippingDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private shippingService: ShippingService,
    private snackbar: MatSnackBar
  ) {
    this.zoneId = data.zoneId;
    this.zoneName = data.zoneName;
  }

  loading: boolean = false;
  zoneName = ""
  zoneId = null

  onDelete() {
    this.loading = true;
    this.shippingService.deleteZone(this.zoneId).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Zone deleted.", "", { duration: 3000 });
        this.dialogRef.close(true);
      }
    })
  }
}


@Component({
  selector: 'edit-shipping-dialog',
  templateUrl: './dialogs/edit-shipping-dialog.html',
})
export class EditShippingDialog {
  constructor(
    public dialogRef: MatDialogRef<EditShippingDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private shippingService: ShippingService,
    private snackbar: MatSnackBar
  ) {
    this.shippingForm.patchValue(data.shipping);
  }

  loading: boolean = false;
  shippingForm = this.fb.group({
    id: [null],
    name: ["", [Validators.required, Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    amount: [0, [Validators.required, Validators.pattern('^[0-9]+$')]]
  });

  onSubmit() {
    this.loading = true;
    this.shippingService.updateShipping(this.shippingForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Shipping method updated successfuly.", "", { duration: 3000 });
        this.dialogRef.close(true);
      }
    })
  }
}


@Component({
  selector: 'delete-shipping-dialog',
  templateUrl: './dialogs/delete-shipping-dialog.html',
})
export class DeleteShippingDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteShippingDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private shippingService: ShippingService,
    private snackbar: MatSnackBar
  ) {
    this.shipping = data.shipping;
  }

  loading: boolean = false;
  shipping = null;

  onDelete() {
    this.loading = true;
    this.shippingService.deleteShipping(this.shipping.id).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Shipping method deleted.", "", { duration: 3000 });
        this.dialogRef.close(true);
      }
    })
  }
}


@Component({
  selector: 'view-zone-dialog',
  styleUrls: ['./shipping.component.scss'],
  templateUrl: './dialogs/view-zone.html',
})
export class ViewZoneDialog {
  constructor(
    public dialogRef: MatDialogRef<AddZoneDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private shippingService: ShippingService,
    private shippingRegionService: ShippingRegionService,
    private snackbar: MatSnackBar
  ) {
    this.zoneId = this.data ? this.data.zoneId : null
  }
  zoneId = null;
  loading: boolean = false;
  citiesCheck: boolean = true;
  regions: [];
  countries: [];
  cities: [];

  title: string = '';
  region: string = '';
  country: any;
  city = [];

  selectedRegions: [];


  ngOnInit() {
    this.loading = true
    this.regions = []
    this.countries = []
    this.cities = []

    if (this.zoneId) {
      this.shippingService.getVendorZones(this.zoneId).then((resp) => {
        if (resp) {
          this.title = resp.data.title;
          this.region = resp.data.region;
          this.country = resp.data.country;
          this.city = resp.data.city;
        }
      })
    }

  }
}