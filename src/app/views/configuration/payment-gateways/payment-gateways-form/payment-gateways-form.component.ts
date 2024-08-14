import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import URLS from 'src/app/shared/urls';
import { PaymentGatewayService } from './../payment-gateways.service';

@Component({
  selector: 'app-payment-gateways-form',
  templateUrl: './payment-gateways-form.component.html',
  styleUrls: ['./payment-gateways-form.component.scss']
})
export class PaymentGatewaysFormComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private snackbarService: MatSnackBar,
    private router: Router,
    private paymentGatewayService: PaymentGatewayService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
  ) {
    this.paymentGatewayId = this.route.snapshot.paramMap.get('id') ? this.route.snapshot.paramMap.get('id') : null;
  }

  URLS = URLS;
  loading: boolean = false;
  gatewayType: string = '';
  fields: any;
  paymentGatewayId;

  paymentGatewayForm = this.fb.group({
    type: ['', [Validators.required]],
    gateway_name: ['', [Validators.required]],
    credentials: this.fb.group({}),
    test_mode: [false],
    title: [''],
    description: [''],
    is_active: [true]
  });

  selectedPaymentGateway = this.paymentGatewayForm.get("type").value;
  previousControlName = [];

  getGatewaylist() {
    this.loading = true;
    this.paymentGatewayService.getGatewaysList().then((resp) => {
      this.loading = false;
      if (resp) {
        this.gatewayType = resp.data;
      }
    })
  }

  getEditGatewaylist() {
    this.loading = true;
    this.paymentGatewayService.getEditGatewaysList().then((resp) => {
      this.loading = false;
      if (resp) {
        this.gatewayType = resp.data;
      }
    })
  }


  onGatewayTypeChange(event) {
    this.loading = true;
    let type = event.value ? event.value : event;
    let credential = (this.paymentGatewayForm.get("credentials") as FormGroup);
    this.paymentGatewayService.getFields(type).then((resp) => {
      this.loading = false;
      if (resp) {
        if (this.selectedPaymentGateway) {
          if (type === this.selectedPaymentGateway) {
            resp.data.forEach(item => {
              this.previousControlName.push(item.name);
              credential.addControl(item.name, new FormControl(item.value || ''));
            });
          } else {
            this.previousControlName.forEach(item => {
              credential.removeControl(item);
            });
            this.previousControlName = [];
            resp.data.forEach(item => {
              this.previousControlName.push(item.name);
              credential.addControl(item.name, new FormControl(item.value || ''));
            });
          }
        } else {
          resp.data.forEach(item => {
            this.previousControlName.push(item.name);
            credential.addControl(item.name, new FormControl(item.value || ''));
          });
        }
        this.fields = resp.data;
        this.selectedPaymentGateway = type;
        if (this.paymentGatewayId) {
          (this.paymentGatewayForm.controls['type'] as FormControl).disable();
          (this.paymentGatewayForm.controls['type'] as FormControl).updateValueAndValidity();
        }
      }
    })
  }

  getGatewayDetail() {
    this.loading = true;
    let credential = (this.paymentGatewayForm.get("credentials") as FormGroup);
    this.paymentGatewayService.getPaymentGatewayDetail(this.paymentGatewayId).then((resp) => {
      this.loading = false;
      if (resp) {
        this.paymentGatewayForm.addControl('id', new FormControl(null));
        let mainObj = {};
        let credentials = {};
        this.onGatewayTypeChange(resp.data.type);
        let fields;
        if (resp.data.test_mode) {
          fields = Object.keys(resp.data.credentials.TEST);
          fields.forEach(item => {
            credential.addControl(item, new FormControl(item.value || ''));
          });
          credentials = resp.data.credentials.TEST;
        } else {
          fields = Object.keys(resp.data.credentials.LIVE);
          fields.forEach(item => {
            credential.addControl(item, new FormControl(item.value || ''));
          });
          credentials = resp.data.credentials.LIVE;
        }
        mainObj["id"] = resp.data.id
        mainObj['type'] = resp.data.type;
        mainObj['test_mode'] = resp.data.test_mode;
        mainObj['is_active'] = resp.data.is_active;
        mainObj["credentials"] = credentials;
        mainObj['gateway_name'] = resp.data.gateway_name;
        this.paymentGatewayForm.patchValue(mainObj);
      }
    })
  }


  onSubmit() {
    this.loading = true;
    let mainObj;
    if (this.paymentGatewayForm.get("type").value === "manual") {
      mainObj = this.paymentGatewayForm.value;
      delete mainObj.credentials;
      delete mainObj.test_mode;
    } else {
      mainObj = this.paymentGatewayForm.value;
      delete mainObj.title;
      delete mainObj.description;
      let live = mainObj.credentials;
      if (this.paymentGatewayForm.get("test_mode").value === true) {
        mainObj.credentials = { "TEST": live }
      } else {
        mainObj.credentials = { "LIVE": live }
      }
    }
    if (this.paymentGatewayId) {
      this.paymentGatewayService.updatePaymentGateway(mainObj).then((resp) => {
        this.loading = false;
        if (resp) {
          this.router.navigate(['/', URLS.paymentGateways]);
          this.snackbarService.open("Paymentgateway updated successfully.", "", { duration: 3000 });
        }
      })
    } else {
      this.paymentGatewayService.createPaymentGateway(mainObj).then((resp) => {
        this.loading = false;
        if (resp) {
          this.snackbarService.open("Paymentgateway added successfully.", "", { duration: 3000 });
          this.router.navigate(['/', URLS.paymentGateways]);
        }
      })
    }
  }

  ngOnInit(): void {
    if (this.paymentGatewayId) {
      this.getGatewayDetail();
      this.getEditGatewaylist();
    } else {
      this.getGatewaylist();
    }
  }

}
