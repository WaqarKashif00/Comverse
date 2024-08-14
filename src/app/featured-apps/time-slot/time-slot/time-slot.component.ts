import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { TimeSlotService } from './../time-slot.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-time-slot',
  templateUrl: './time-slot.component.html',
  styleUrls: ['./time-slot.component.scss']
})
export class TimeSlotComponent implements OnInit {

  constructor(
    private timeSlotService: TimeSlotService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,

  ) { }

  loading: boolean = false;
  URLS = URLS;
  columns: Column[] = [
    {
      title: "Title",
      selector: "title",
      clickable: true
    },
    {
      title: "From Time",
      selector: "from_time",
    },
    {
      title: "To Time ",
      selector: "to_time",
    },
  ];

  daysArray=[
    {
      value:"monday",
      title:"Monday"
    },
    {
      value:"tuesday",
      title:"Tuesday"
    },
    {
      value:"wednesday",
      title:"Wednesday"
    },
    {
      value:"thursday",
      title:"Thursday"
    },
    {
      value:"friday",
      title:"Friday"
    },
    {
      value:"saturday",
      title:"Saturday"
    },
    {
      value:"sunday",
      title:"Sunday"
    }
  ]

  rowActions = ["Delete"]
  timeSlots = [];
  totalCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 20;


  getTimeSlot() {
    this.loading = true;
    this.timeSlotService.getTimeSlotList(this.pageNumber, this.pageSize).then(resp => {
      this.loading = false;
      if(resp) {
        this.timeSlots = resp.data.results;
        this.totalCount = resp.data.count;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getTimeSlot();
  }

  onCellClick(data) {
    this.router.navigate(["/", URLS.timeSlot, URLS.editTimeSlot, data.row.id]);
  }

  onRowAction(data) {
    if(data.action === "Delete") {
      let dialogRef = this.dialog.open(TimeSlotDeleteDialog, {
        width: "600px",
        data: {
          timeSlot: data.row
        }
      });

      dialogRef.afterClosed().subscribe(deleted => {
        if(deleted) {
          this.getTimeSlot();
        }
      });
    }
  }

    timeSlotSettingForm = this.fb.group({
      day: [[]],
      enable_slots: [false],
      message: ['', [Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]],
      day_count:[null]
    })

    getTimeSlotSettings() {
      this.loading = true;
      this.timeSlotService.getTimeSlotSettings().then((resp)=> {
        this.loading = false;
        if(resp) {
          this.timeSlotSettingForm.patchValue(resp.data);
        }
       })
    }

    onSubmit() {
      this.loading = true;
      this.timeSlotService.createTimeSlotSetting(this.timeSlotSettingForm.value).then((resp)=> {
        this.loading = false;
        if (resp) {
        this.snackbar.open("Time slot setting updated.", "", {duration: 3000});
        }
      })
    }


  ngOnInit(): void {
    this.getTimeSlot();
    this.getTimeSlotSettings();
  }

}


@Component({
  selector: 'delete-time-slot-dialog.',
  templateUrl: '../dialogs/delete-time-slot-dialog.html',
})
export class TimeSlotDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<TimeSlotDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data,
    private timeSlotService: TimeSlotService,
    private snackBar: MatSnackBar
  ) {}

  loading: boolean = false;

  onDelete() {
    this.loading = true;
    this.timeSlotService.deleteTimeSlot(this.data.timeSlot.id).then(resp => {
      if(resp) {
        this.loading = false;
        this.snackBar.open("Delivery Time Slot deleted.", "", {duration: 2000});
        this.dialogRef.close(true);
      }
    })
  }
}