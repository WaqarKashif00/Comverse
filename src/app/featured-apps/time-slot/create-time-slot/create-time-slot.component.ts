import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { TimeSlotService } from '../time-slot.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-time-slot',
  templateUrl: './create-time-slot.component.html',
  styleUrls: ['./create-time-slot.component.scss']
})
export class CreateTimeSlotComponent implements OnInit {

  constructor(
    private timeSlotService: TimeSlotService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) { }


  loading: boolean = false;
  URLS = URLS;
  cityList: any;

  createTimeSlotForm = this.fb.group({
    title: ['', [Validators.required, Validators.pattern(/^[^!"`'#%:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    to_time: ['', [Validators.required]],
    from_time: ['', [Validators.required]],
    day: [[], [Validators.required]],
    city: [[], [Validators.required]],
    slot_details: this.fb.array([])
  })


  addTimeSlot() {
    (this.createTimeSlotForm.get("slot_details") as FormArray).push(
      this.fb.group({
        slot_title: ['',[Validators.required, Validators.pattern(/^[^!"`'#%:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)],],
        order_capacity: [null],
        day_count: [null],
      })
    )
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

  removeTimeSlot(index) {
    (this.createTimeSlotForm.get("slot_details") as FormArray).removeAt(index);
  }

  onSubmit() {
    this.loading = true;
    this.timeSlotService.createTimeSlot(this.createTimeSlotForm.value).then((resp) => {
      this.loading = false;
      if (resp) {
        this.snackbar.open("Time slot created.", "", { duration: 3000 });
        this.router.navigate(["/", URLS.timeSlot]);
      }
    })
  }

  ngOnInit(): void {
    this.getCities();
  }

}
