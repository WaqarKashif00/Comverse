import { Component, OnInit, Inject, Input, Output } from '@angular/core';
import URLS from 'src/app/shared/urls';
import { Router } from '@angular/router';
import { StoreLocatorService } from './../store-locator.service';
import { CdkDragDrop, CdkDragSortEvent, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-store-locator',
  templateUrl: './store-locator.component.html',
  styleUrls: ['./store-locator.component.scss']
})
export class StoreLocatorComponent implements OnInit {

  constructor(private router: Router, private storeLocatorService: StoreLocatorService, public dialog: MatDialog, private fb: FormBuilder) { }

  URLS = URLS;
  loading: boolean = false;
  citiesId;
  mainId;
  cities = [];
  citiesActions: string[] = [];
  activecities = null;


  mainCitiesSort(event: CdkDragDrop<any[]>) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.cities, event.previousIndex, event.currentIndex);
      this.sortFillterCall(this.cities, "city");
    }
  }


  citiesSort(event: CdkDragDrop<any[]>, mainIndex) {
    let storeLocation = this.cities[mainIndex].store_location;
    moveItemInArray(storeLocation, event.previousIndex, event.currentIndex);
    this.sortFillterCall(storeLocation, "store_location");
  }

  getMainCities() {
    this.loading = true;
    this.storeLocatorService.getMainCities().then(resp => {
      this.loading = false;
      if (resp) {
        this.cities = resp.data;
      }
    });
  }

  mainindex(index) {
    let mainCities = this.cities[index];
    this.mainId = mainCities;
  }

  toggleMainCities(index) {
    let mainCities = this.cities[index];
    this.mainId = mainCities;
    if (mainCities.open) {
      mainCities.open = false;
    } else {
      mainCities.loading = true;
      mainCities.open = true;
      mainCities.store_location = [];
      this.getStoreLocation(index);
    }
  }

  toggleCities(index) {
    let mainCities = this.cities[index];
    this.mainId = mainCities;
  }


  sortFillterCall(citiesArray, type) {
    this.loading = true;
    let citiesData = citiesArray.map((category, index) => {
      return {
        id: category.id,
        position: index + 1
      }
    });
    if (type === "city") {
      this.loading = true;
      this.storeLocatorService.updateCitiesPosition(type, citiesData).then(resp => {
        this.loading = false;
      });
    }
    else {
      this.loading = true;
      this.storeLocatorService.updateStorePosition(type, citiesData).then(resp => {
        this.loading = false;
      });
    }
  }

  storeLocation(mainIndex, subIndex) {
    let mainCities = this.cities[mainIndex];
    let storeLocation = mainCities.store_location[subIndex];
    storeLocation.open = false;
  }


  rowActionsToggle(event, id, is_active, type) {
    event.stopPropagation();
    let actions = [];
    is_active ? actions.push("Deactivate") : actions.push("Activate");
    actions.push("Edit")
    actions.push("Delete");
    this.citiesActions = actions;
    this.activecities = {
      id,
      type,
      is_active
    }
  }


  rowActionsToggleMain(event, id, type) {
    event.stopPropagation();
    let actions = ["Edit"];
    actions.push("Delete");
    this.citiesActions = actions;
    this.activecities = {
      id,
      type,
    }
  }


  AddCities() {
    let dialogRef = this.dialog.open(AddCitiesDialog, {
      width: "600px",
    });

    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        this.getMainCities();
      }
    });
  }

  EditCities() {
    let dialogRef = this.dialog.open(EditCitiesDialog, {
      width: "600px",
      data: {
        id: this.mainId.id,
        name: this.mainId.name
      }
    });

    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        this.getMainCities();
      }
    });
  }


  AddLocator() {
    let dialogRef = this.dialog.open(AddLocatorDialog, {
      width: "600px",
      data: {
        locator: this.citiesId.id
      }
    });

    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        this.getMainCities();
      }
    });
  }


  EditLocator() {
    let dialogRef = this.dialog.open(EditLocatorDialog, {
      width: "600px",
      data: {
        id: this.citiesId.id,
      }
    });

    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        this.getMainCities();
      }
    });
  }


  DeleteRecord(id, type) {
    if (type === "sub") {
      let dialogRef = this.dialog.open(DeleteDialog, {
        width: "600px",
        data: {
          data: this.citiesId,
          id: id,
          type: type,
        }
      });

      dialogRef.afterClosed().subscribe(updated => {
        if (updated) {

          this.getMainCities();
        }
      });
    }
    else {
      let dialogRef = this.dialog.open(DeleteDialog, {
        width: "600px",
        data: {
          data: this.mainId,
          id: this.mainId.id,
          type: type,
        }
      });

      dialogRef.afterClosed().subscribe(updated => {
        if (updated) {
          this.getMainCities();
        }
      });
    }
  }


  mainCities(mainIndex) {
    let mainCities = this.cities[mainIndex];
    this.citiesId = mainCities;
  }

  getStoreLocation(mainIndex) {
    let mainCities = this.cities[mainIndex];
    this.citiesId = mainCities;
    this.storeLocatorService.getStoreLocation(mainCities.id).then(resp => {
      mainCities.loading = false;
      if (resp) {
        mainCities.store_location = resp.data;
      }
    })
  }

  toggleStoreLocation(mainIndex, subIndex) {
    let storeLocation = this.cities[mainIndex].store_location[subIndex];
    this.citiesId = storeLocation;
  }


  onCitiesAction(action) {
    let id = this.activecities.id;
    let type = this.activecities.type;
    let status;

    if (action === "Edit") {
      if (type === "main") {
        this.EditCities();
      } else if (type === "sub") {
        this.EditLocator()
      }
    } else if (action === "Deactivate") {
      status = false;
      this.changeStatus(id, type, status);

    } else if (action === "Activate") {
      status = true;
      this.changeStatus(id, type, status);

    } else if (action === "Delete") {
      this.DeleteRecord(id, type);
    }
  }


  changeStatus(id, type, status) {
    this.storeLocatorService.changeStatus(id, type, status).then(resp => {
      if (resp) {
        this.getMainCities();
        if (resp.data.detail) {
          this.getMainCities();
        }
      }
    });
  }

  ngOnInit(): void {
    this.getMainCities();
  }

}


// Add Cities Dialogs
@Component({
  selector: 'add-cities-dialog',
  templateUrl: '../dialogs/add-cities-dialog.html',
})
export class AddCitiesDialog {
  constructor(
    public dialogRef: MatDialogRef<AddCitiesDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private storeLocatorService: StoreLocatorService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
  }

  loading: boolean = false;
  createcitiesForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]],
  })

  onSubmit() {
    this.loading = true;
    this.storeLocatorService.createCities(this.createcitiesForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.loading = false;
        this.dialogRef.close(true);
      }
    });
  }
}



// Edite Cities Dialogs

@Component({
  selector: 'edit-cities-dialog',
  templateUrl: '../dialogs/edit-cities-dialog.html',
})

export class EditCitiesDialog {
  constructor(
    public dialogRef: MatDialogRef<EditCitiesDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private storeLocatorService: StoreLocatorService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
  }


  loading: boolean = false;
  cities = [];

  updatecitiesForm = this.fb.group({
    id: [null],
    name: ['', [Validators.required, Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]],
  })

  getFormPatch() {
    this.updatecitiesForm.patchValue(this.data)
  }

  onSubmit() {
    this.loading = true;
    this.storeLocatorService.updateCities(this.updatecitiesForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.loading = false;
        this.dialogRef.close(true);
      }
    });
  }

  ngOnInit(): void {
    this.getFormPatch();
  }
}


// Add Locator Dialog

@Component({
  selector: 'add-locator-dialog',
  templateUrl: '../dialogs/add-locator-dialog.html',
})
export class AddLocatorDialog {
  constructor(
    public dialogRef: MatDialogRef<AddLocatorDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private storeLocatorService: StoreLocatorService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
  }

  loading: boolean = false;
  createLocatorForm = this.fb.group({
    title: ['', [Validators.required , Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    contact: ['', [Validators.required, Validators.pattern('(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})')]],
    zip_code: ['', [Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]],
    longitude: ['', [Validators.required, Validators.pattern(/^(\+|-)?(?:90(?:(?:\.0{1,7})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,7})?))$/)]],
    latitude: ['', [Validators.required, Validators.pattern(/^(\+|-)?(?:90(?:(?:\.0{1,7})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,7})?))$/)]],
    address: ['', [Validators.required, Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]],
    province: ['', [Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]],
    area: ['', [Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]],
    store_city: [this.data.locator],
    is_active: [false],
  })


  onSubmit() {
    this.loading = true;
    this.createLocatorForm
    this.storeLocatorService.createLocator(this.createLocatorForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.loading = false;
        this.dialogRef.close(true);
      }
    });
  }
}

// Edit Locator

@Component({
  selector: 'edit-locator-dialog',
  templateUrl: '../dialogs/edit-locator-dialog.html',
})
export class EditLocatorDialog {
  constructor(
    public dialogRef: MatDialogRef<EditLocatorDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private storeLocatorService: StoreLocatorService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
  }

  loading: boolean = false;

  getLocatorDetail() {
    this.loading = true;
    this.storeLocatorService.getLocatorDetail(this.data.id).then(resp => {
      this.loading = false;
      if (resp) {
        this.updateLocatorForm.patchValue(resp.data);
      }
    });
  }

  updateLocatorForm = this.fb.group({
    id: [null],
    title: ['', [Validators.required, Validators.pattern(/^[^!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    contact: ['', [Validators.required, Validators.pattern('(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})')]],
    zip_code: ['', [Validators.required, Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]],
    longitude: ['', [Validators.required, Validators.pattern(/^(\+|-)?(?:90(?:(?:\.0{1,7})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,7})?))$/)]],
    latitude: ['', [Validators.required, Validators.pattern(/^(\+|-)?(?:90(?:(?:\.0{1,7})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,7})?))$/)]],
    address: ['', [Validators.required, , Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]],
    province: ['', [Validators.required, Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]],
    area: ['', [Validators.required, Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]],
    store_city: [this.data.locator],
    is_active: [false],
  })

  onSubmit() {
    this.loading = true;
    this.updateLocatorForm
    this.storeLocatorService.updateLocator(this.updateLocatorForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.loading = false;
        this.dialogRef.close(true);
      }
    });
  }


  ngOnInit(): void {
    this.getLocatorDetail();
  }
}


// Delete Dialogs
@Component({
  selector: 'delete-dialog',
  templateUrl: '../dialogs/delete-dialog.html',
})
export class DeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private storeLocatorService: StoreLocatorService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
  }

  cities = [];
  loading: boolean = false;

  createcitiesForm = this.fb.group({
    name: ['', [Validators.required]],
  })

  getMainCities() {
    this.loading = true;
    this.storeLocatorService.getMainCities().then(resp => {
      this.loading = false;
      if (resp) {
        this.cities = resp.data;
      }
    });
  }


  deleteItem() {
    this.loading = true;
    this.storeLocatorService.deleteItem(this.data.id, this.data.type).then(resp => {
      this.loading = false;
      if (resp) {
        this.loading = false;
        this.dialogRef.close(true);
        this.getMainCities();
      }
    })
  }
}
