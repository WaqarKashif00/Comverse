import { LoyalityService } from './loyality.service';
import { Component, Inject, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { FormBuilder, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-loyality',
  templateUrl: './loyality.component.html',
  styleUrls: ['./loyality.component.scss']
})
export class LoyalityComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private router: Router,
    private snackbarService: MatSnackBar,
    private loyalityService: LoyalityService,
    public dialog: MatDialog
  ) { }

  URLS = URLS;
  loading = false;
  storeCurrency = environment.currency;
  loyalityDetails: any;
  ruleID:any;

  loyalityForm = this.fb.group({
    amount_equal_point: [null],
    point_equal_amount: [null],
    start_loyalty_amount: [null],
    minimum_orders_loyalty_start: [null],
    minimum_point_redeem: [null],
    is_paid: [false],
    rules: this.fb.array([])
  })


  addRule() {
    (this.loyalityForm.get("rules") as FormArray).push(
      this.fb.group({
        spending_amount: [0],
        no_of_point: [null],
        no_of_order: [null],
        start_date: [null],
        end_date: [null],
        type: ['amount'],
        paid_order: [false],
        is_active: [true]
      })
    )
  }


  removeRule(index) {
    if ((this.loyalityForm.get("rules") as FormArray).at(index).get('id')) {
    let ruleID = (this.loyalityForm.get("rules") as FormArray).at(index).get('id').value;
      let dialogRef = this.dialog.open(DeleteLoyaltyRuleDialog, {
        width: "600px",
        data: {
          ruleID: ruleID,
          ruleNumber: index + 1
        }
      });
      dialogRef.afterClosed().subscribe(updated => {
        if (updated) {
          this.removeRuleAfterConfirmation(index);
        }
      });

    } else {
      (this.loyalityForm.get('rules') as FormArray).removeAt(index)

    }
  }

  removeRuleAfterConfirmation(index) {
    (this.loyalityForm.get('rules') as FormArray).removeAt(index);
  }

  onSubmit() {
    this.loading = true;
    this.loyalityService.createLoyality(this.loyalityForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbarService.open("Loyality created successfully.", "", { duration: 3000 });
        this.router.navigate(['/', URLS.featuredApps]);
      }
    });
  }

  getLoyality() {
    this.loading = true;
    this.loyalityService.getLoyality().then((resp) => {
      this.loading = false;
      if (resp) {
        this.loyalityDetails = resp.data;
        for (let i = 0; i < this.loyalityDetails.rules.length; i++) {
          (this.loyalityForm.get("rules") as FormArray).push(
            this.fb.group({
              id: [null],
              spending_amount: [{value:null, disabled:true}],
              no_of_point: [{value:null, disabled:true}],
              no_of_order: [{value:null, disabled:true}],
              start_date: [{value:"", disabled:true}],
              end_date: [{value:"", disabled:true}],
              type: [{value:"amount", disabled:true}],
              paid_order: [{value:false, disabled:true}],
              is_active: [{value:true, disabled:true}]
            })
          )
        }
        this.loyalityForm.patchValue(this.loyalityDetails);
      }
    })
  }

  ngOnInit(): void {
    this.getLoyality();
  }

}


@Component({
  selector: 'delete-rule-dialog',
  templateUrl: './dialog/delete-rule-dialog.html',
})
export class DeleteLoyaltyRuleDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteLoyaltyRuleDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar,
    private loyaltyService: LoyalityService
  ) {
    this.ruleID = data.ruleID;
  }

  loading: boolean = false;
  ruleID = null;
  ruleNumber = this.data.ruleNumber;

  onDelete() {
    this.loading = true;
    this.loyaltyService.deleteRule(this.ruleID).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Rule deleted.", "", { duration: 3000 });
        this.dialogRef.close(true);
      }
    })
  }
}
