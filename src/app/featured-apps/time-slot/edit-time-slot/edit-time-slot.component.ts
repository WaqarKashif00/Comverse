import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { TimeSlotService } from '../time-slot.service';

@Component({
  selector: 'app-edit-time-slot',
  templateUrl: './edit-time-slot.component.html',
  styleUrls: ['./edit-time-slot.component.scss']
})
export class EditTimeSlotComponent implements OnInit {

  constructor(
    private timeSlotService: TimeSlotService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,

  ) {
    this.timeSlotID = this.route.snapshot.paramMap.get('id');
  }


  loading: boolean = false;
  URLS = URLS;
  timeSlotID: any;
  timeSlotDetails: any;
  cityList: any;

  createTimeSlotForm = this.fb.group({
    id: [null],
    title: ['', [Validators.required, Validators.pattern(/^[^!"`'#%:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    to_time: ['', [Validators.required]],
    from_time: ['', [Validators.required]],
    day: [[],  [Validators.required]],
    city: [[],  [Validators.required]],
    slot_details: this.fb.array([])
  })


  addTimeSlot() {
    (this.createTimeSlotForm.get("slot_details") as FormArray).push(
      this.fb.group({
        slot_title: ['',[Validators.required, Validators.pattern(/^[^!"`'#%:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
        order_capacity: [null],
        day_count: [null],
      })
    )
  }

  getTimeSlot() {
    this.loading = true;
    this.timeSlotService.getSingleTimeSlot(this.timeSlotID).then((resp) => {
      this.loading = false;
      if (resp) {
        this.timeSlotDetails = resp.data;
        for (let i = 0; i < this.timeSlotDetails.slot_details.length; i++) {
          (this.createTimeSlotForm.get("slot_details") as FormArray).push(
            this.fb.group({
              id: [null],
              slot_title: ['', [Validators.required, Validators.pattern(/^[^!"`'#%:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
              order_capacity: [null],
              day_count: [null],
            })
          )
        }
        this.createTimeSlotForm.patchValue(resp.data)
      }
    })
  }
  removeTimeSlot(index) {
    let timeSlotID = (this.createTimeSlotForm.get("slot_details") as FormArray).at(index).get('id');
    if (timeSlotID) {
      let timeSlotTitle = (this.createTimeSlotForm.get("slot_details") as FormArray).at(index).get('slot_title').value;
      let dialogRef = this.dialog.open(TimeSlotDetailDeleteDialog, {
        width: "600px",
        data: {
          id: timeSlotID.value,
          title: timeSlotTitle
        }
      });
      dialogRef.afterClosed().subscribe(updated => {
        if (updated) {
          this.removeTimeSlotAferConfirmation(index);
        }
      });
    } else {
      this.removeTimeSlotAferConfirmation(index);
    }
  }


  removeTimeSlotAferConfirmation(index) {
    (this.createTimeSlotForm.get("slot_details") as FormArray).removeAt(index);
  }


  getCities() {
    this.loading = true;
    this.timeSlotService.getCities().then((resp) => {
      this.loading = false;
      if (resp) {
        this.cityList = resp.data
      }
    })
  }


  onSubmit() {
    this.loading = true;
    this.timeSlotService.updateTimeSlot(this.createTimeSlotForm.value).then((resp) => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Time slot updated.", "", { duration: 3000 });
        this.router.navigate(["/", URLS.timeSlot]);
      }
    })
  }


  ngOnInit(): void {
    this.getTimeSlot();
    this.getCities();
  }

}


@Component({
  selector: 'delete-time-slot-detail.',
  templateUrl: '../dialogs/delete-time-slot-detail.html',
})
export class TimeSlotDetailDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<TimeSlotDetailDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private timeSlotService: TimeSlotService,
    private snackBar: MatSnackBar
  ) { }

  loading: boolean = false;

  onDelete() {
    this.loading = true;
    this.timeSlotService.deleteTimeSlotDetail(this.data.id).then(resp => {
      if (resp) {
        this.loading = false;
        this.snackBar.open("Time Slot deleted.", "", { duration: 2000 });
        this.dialogRef.close(true);
      }
    })
  }
}