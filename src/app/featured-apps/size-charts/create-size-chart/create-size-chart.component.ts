import { SizeChartsService } from './../size-charts.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Column } from 'src/app/shared/datatable/datatable.component';
import URLS from 'src/app/shared/urls';
import { environment } from 'src/environments/environment';
import { FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-create-size-chart',
  templateUrl: './create-size-chart.component.html',
  styleUrls: ['./create-size-chart.component.scss']
})
export class CreateSizeChartComponent implements OnInit {

  constructor(
    private sizeChartService: SizeChartsService,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackbarService: MatSnackBar) { }


  loading: boolean = false;
  URLS = URLS;
  storeCurrency = environment.currency;

  createSizeChartForm = this.fb.group({
    title: ['', [Validators.required, Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    is_active: [false],
    header_bg_color: [''],
    grid_bg_color: [''],
    grid_header_color: [''],
    border_color: [''],
    grid_text_color: [''],
    first_row_heading: [false],
    first_column_heading: [false],
    default_setting: [false],
    chart: this.fb.array([
      this.fb.group({
        values: this.fb.array([
          this.fb.group({
            column: ['', [Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]]
          })
        ])
      })
    ])
  })


  addRow() {
    let formObj = (this.createSizeChartForm.get('chart') as FormArray).at(0).value;
    let length = formObj.values.length;
    let newFormArray = this.fb.array([]);
    for (let i = 0; i < length; i++) {
      newFormArray.push(
        this.fb.group({
          column: ['', [Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]]
        })
      )
    }
    (this.createSizeChartForm.get("chart") as FormArray).push(
      this.fb.group({
        values: newFormArray
      })
    )
  }

  addColumn() {
    let length = this.createSizeChartForm.get("chart").value.length
    for (let i = 0; i < length; i++) {
      ((this.createSizeChartForm.get("chart") as FormArray).at(i).get('values') as FormArray).push(
        this.fb.group({
          column: ['', [Validators.pattern(/^[^!`'#%:;<>={}~\$\\*\+\/\\\?\[\]\^\|]+$/)]]
        })
      )
    }
  }

  deleteRow(index) {
    let length = this.createSizeChartForm.get("chart").value.length
    if (length > 1) {
      (this.createSizeChartForm.get('chart') as FormArray).removeAt(index)
    }
  }

  deleteColumn(index) {
    let colLength = (this.createSizeChartForm.get("chart") as FormArray).at(0).get('values').value.length
    if (colLength > 1) {
      let length = this.createSizeChartForm.get("chart").value.length
      for (let i = 0; i < length; i++) {
        ((this.createSizeChartForm.get("chart") as FormArray).at(i).get('values') as FormArray).removeAt(index)
      }
    }
  }

  onDefaultSetting() {
    let settingType = this.createSizeChartForm.get('default_setting').value;
    if (settingType === false) {
      (this.createSizeChartForm.controls['header_bg_color'] as FormControl).setValidators([Validators.required]);
      (this.createSizeChartForm.controls['grid_header_color'] as FormControl).setValidators([Validators.required]);
      (this.createSizeChartForm.controls['grid_bg_color'] as FormControl).setValidators([Validators.required]);
      (this.createSizeChartForm.controls['grid_text_color'] as FormControl).setValidators([Validators.required]);
      (this.createSizeChartForm.controls['border_color'] as FormControl).setValidators([Validators.required]);

      // For Enabling
      (this.createSizeChartForm.controls['header_bg_color'] as FormControl).enable();
      (this.createSizeChartForm.controls['grid_header_color'] as FormControl).enable();
      (this.createSizeChartForm.controls['grid_bg_color'] as FormControl).enable();
      (this.createSizeChartForm.controls['grid_text_color'] as FormControl).enable();
      (this.createSizeChartForm.controls['border_color'] as FormControl).enable();

      (this.createSizeChartForm.controls['header_bg_color'] as FormControl).updateValueAndValidity();
      (this.createSizeChartForm.controls['grid_header_color'] as FormControl).updateValueAndValidity();
      (this.createSizeChartForm.controls['grid_bg_color'] as FormControl).updateValueAndValidity();
      (this.createSizeChartForm.controls['grid_text_color'] as FormControl).updateValueAndValidity();
      (this.createSizeChartForm.controls['border_color'] as FormControl).updateValueAndValidity();

    } else {
      (this.createSizeChartForm.controls['header_bg_color'] as FormControl).clearValidators();
      (this.createSizeChartForm.controls['grid_header_color'] as FormControl).clearValidators();
      (this.createSizeChartForm.controls['grid_bg_color'] as FormControl).clearValidators();
      (this.createSizeChartForm.controls['grid_text_color'] as FormControl).clearValidators();
      (this.createSizeChartForm.controls['border_color'] as FormControl).clearValidators();

      // For disabling

      (this.createSizeChartForm.controls['header_bg_color'] as FormControl).disable();
      (this.createSizeChartForm.controls['grid_header_color'] as FormControl).disable();
      (this.createSizeChartForm.controls['grid_bg_color'] as FormControl).disable();
      (this.createSizeChartForm.controls['grid_text_color'] as FormControl).disable();
      (this.createSizeChartForm.controls['border_color'] as FormControl).disable();

      (this.createSizeChartForm.controls['header_bg_color'] as FormControl).updateValueAndValidity();
      (this.createSizeChartForm.controls['grid_header_color'] as FormControl).updateValueAndValidity();
      (this.createSizeChartForm.controls['grid_bg_color'] as FormControl).updateValueAndValidity();
      (this.createSizeChartForm.controls['grid_text_color'] as FormControl).updateValueAndValidity();
      (this.createSizeChartForm.controls['border_color'] as FormControl).updateValueAndValidity();
    }
  }

  getDefaultSetting() {
    this.loading = true;
    this.sizeChartService.getSettingDetail().then(resp => {
      this.loading = false;
      if (resp) {
        this.createSizeChartForm.patchValue(resp.data);
      }
    });
  }


  onSubmit() {
    this.loading = true;
    this.sizeChartService.createSizeChart(this.createSizeChartForm.value).then(resp => {
      this.loading = false;
      if (resp) {
        this.snackbarService.open('Size chart created', "", { duration: 3000 });
        this.router.navigate(['/', URLS.sizeChart]);
      }
    })
  }

  ngOnInit(): void {
    this.getDefaultSetting();
  }

}
