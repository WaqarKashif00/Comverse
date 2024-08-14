import { SizeChartsService } from './../size-charts.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { environment } from 'src/environments/environment';
import { FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-size-chart',
  templateUrl: './edit-size-chart.component.html',
  styleUrls: ['./edit-size-chart.component.scss']
})
export class EditSizeChartComponent implements OnInit {

  constructor(
    private sizeChartService: SizeChartsService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackbarService: MatSnackBar,
    private route: ActivatedRoute,
    
    ) {
      this.sizeChartID = this.route.snapshot.params.id
     }


  loading: boolean = false;
  URLS = URLS;
  storeCurrency = environment.currency;
  sizeChartID:any;
  sizeChartDetails:any;
  editSizeChartForm = this.fb.group({
    id:[null],
    title: ['', [Validators.required, Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    is_active: [false],
    header_bg_color: [''],
    grid_bg_color: [''],
    grid_header_color: [''],
    border_color: [''],
    grid_text_color: [''],
    default_setting: [false],
    first_row_heading: [false],
    first_column_heading: [false],
    chart: this.fb.array([])
  })



  addRow() {
    let formObj = ((this.editSizeChartForm.get("chart") as FormArray).at(0).get('values') as FormArray ).value;
    let length = formObj.length;
    let newFormArray = this.fb.array([]);
    for (let i = 0; i < length; i++) {
      newFormArray.push(
        this.fb.group({
          column: ['', [Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]]
        })
      )
    }
    (this.editSizeChartForm.get("chart") as FormArray).push(
      this.fb.group({
        values: newFormArray
      })
    )
  }

  addColumn() {
    let length = this.editSizeChartForm.get("chart").value.length
    for (let i = 0; i < length  ; i++) {
      ((this.editSizeChartForm.get("chart") as FormArray).at(i).get('values') as FormArray ).push(
        this.fb.group({
          column:['', [Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]]
        })
      )
    }
  }

  deleteRow(index) {
    let length = this.editSizeChartForm.get("chart").value.length
    if (length > 1) {
      (this.editSizeChartForm.get('chart') as FormArray).removeAt(index)
    }
  }

  deleteColumn(index) {
    let colLength = (this.editSizeChartForm.get("chart") as FormArray).at(0).get('values').value.length
    if (colLength > 1) {
      let length = this.editSizeChartForm.get("chart").value.length
      for (let i = 0; i < length; i++) {
        ((this.editSizeChartForm.get("chart") as FormArray).at(i).get('values') as FormArray ).removeAt(index)
      }
    }
  }

  getSizeChartDetail() {
    this.loading = true;
    this.sizeChartService.getSingleSizeChart(this.sizeChartID).then(resp => {
      this.loading = false;
      if(resp) {
        this.sizeChartDetails = resp.data;
        for (let i = 0; i < this.sizeChartDetails.chart.length; i++) {
          (this.editSizeChartForm.get("chart") as FormArray).push(
            this.fb.group({
              values: this.fb.array([])
            })
          )
          for (let j = 0; j < this.sizeChartDetails.chart[i].values.length  ; j++) {
            ((this.editSizeChartForm.get("chart") as FormArray).at(i).get('values') as FormArray ).push(
              this.fb.group({
                column:['', [Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]]
              })
            )
          }
        }
        this.editSizeChartForm.patchValue(resp.data)
        this.onDefaultSetting();
      }
    });
  }

  onDefaultSetting() {
    let settingType = this.editSizeChartForm.get('default_setting').value;
    if (settingType === false) {
      (this.editSizeChartForm.controls['header_bg_color'] as FormControl).setValidators([Validators.required]);
      (this.editSizeChartForm.controls['grid_header_color'] as FormControl).setValidators([Validators.required]);
      (this.editSizeChartForm.controls['grid_bg_color'] as FormControl).setValidators([Validators.required]);
      (this.editSizeChartForm.controls['grid_text_color'] as FormControl).setValidators([Validators.required]);
      (this.editSizeChartForm.controls['border_color'] as FormControl).setValidators([Validators.required]);

      // For enabling

      (this.editSizeChartForm.controls['header_bg_color'] as FormControl).enable();
      (this.editSizeChartForm.controls['grid_header_color'] as FormControl).enable();
      (this.editSizeChartForm.controls['grid_bg_color'] as FormControl).enable();
      (this.editSizeChartForm.controls['grid_text_color'] as FormControl).enable();
      (this.editSizeChartForm.controls['border_color'] as FormControl).enable();


      (this.editSizeChartForm.controls['header_bg_color'] as FormControl).updateValueAndValidity();
      (this.editSizeChartForm.controls['grid_header_color'] as FormControl).updateValueAndValidity();
      (this.editSizeChartForm.controls['grid_bg_color'] as FormControl).updateValueAndValidity();
      (this.editSizeChartForm.controls['grid_text_color'] as FormControl).updateValueAndValidity();
      (this.editSizeChartForm.controls['border_color'] as FormControl).updateValueAndValidity();

    } else {
      (this.editSizeChartForm.controls['header_bg_color'] as FormControl).clearValidators();
      (this.editSizeChartForm.controls['grid_header_color'] as FormControl).clearValidators();
      (this.editSizeChartForm.controls['grid_bg_color'] as FormControl).clearValidators();
      (this.editSizeChartForm.controls['grid_text_color'] as FormControl).clearValidators();
      (this.editSizeChartForm.controls['border_color'] as FormControl).clearValidators();

      // For disabling 

      (this.editSizeChartForm.controls['header_bg_color'] as FormControl).disable();
      (this.editSizeChartForm.controls['grid_header_color'] as FormControl).disable();
      (this.editSizeChartForm.controls['grid_bg_color'] as FormControl).disable();
      (this.editSizeChartForm.controls['grid_text_color'] as FormControl).disable();
      (this.editSizeChartForm.controls['border_color'] as FormControl).disable();

      (this.editSizeChartForm.controls['header_bg_color'] as FormControl).updateValueAndValidity();
      (this.editSizeChartForm.controls['grid_header_color'] as FormControl).updateValueAndValidity();
      (this.editSizeChartForm.controls['grid_bg_color'] as FormControl).updateValueAndValidity();
      (this.editSizeChartForm.controls['grid_text_color'] as FormControl).updateValueAndValidity();
      (this.editSizeChartForm.controls['border_color'] as FormControl).updateValueAndValidity();

    }
  }

  onSubmit() {
    this.loading = true;
    this.sizeChartService.updateSizeChart(this.editSizeChartForm.value).then(resp => {
      this.loading = false;
      if(resp) {
        this.snackbarService.open('Size chart updated', "", { duration: 3000 });
        this.router.navigate(['/', URLS.sizeChart]);
      }
    })
  }

  ngOnInit(): void {
    this.getSizeChartDetail()
  }

}
