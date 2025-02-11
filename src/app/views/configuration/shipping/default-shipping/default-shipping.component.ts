import { AuthService } from 'src/app/auth/auth.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShippingService } from '../shipping.service';
import URLS from 'src/app/shared/urls';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../../products/products.service';
// import { VendorsService } from '../../../vendors/vendors.service';

@Component({
  selector: 'app-default-shipping',
  templateUrl: './default-shipping.component.html',
  styleUrls: ['./default-shipping.component.scss']
})
export class DefaultShippingComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private shippingService: ShippingService,
    private snackbar: MatSnackBar,
    private productsService: ProductsService,
    private router: Router,
    private authservice: AuthService,
    private route: ActivatedRoute,

  ) {
    this.shippingRateId = this.route.snapshot.paramMap.get('id') ? this.route.snapshot.paramMap.get('id') : null ;
  }
  URLS = URLS
  is_vendor = this.authservice.user.is_vendor;
  zoneId = null
  loading: boolean = false;
  productGroups : []
  zones = []
  selectedRegions : []
  vendors : []
  shippingRateId = ""

  rateForm = this.fb.group({
    title: ["Default Shipping", [Validators.required, Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
    zone: ["", [Validators.required]],
    condition_type : ["", [Validators.required]],
    rules : this.fb.array([
      this.fb.group({
        title: ['', [Validators.required, Validators.pattern(/^[^!"`'#%:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
        conditional_rates : this.fb.array([
          this.fb.group({
            min_value: ['', [Validators.required]],
            max_value: ['', [Validators.required]],
            amount: ['', [Validators.required]]
          })
        ])
      })
    ])
  });

  createNewCondition(index)
  {
    (this.rateForm.get('rules.'+index+'.conditional_rates') as FormArray).push(
      this.fb.group({
        min_value: ['', [Validators.required]],
        max_value: ['', [Validators.required]],
        amount: ['', [Validators.required]]
      })
    )
  }

  createNewRule()
  {
    (this.rateForm.get('rules') as FormArray).push(
      this.fb.group({
        title: ['', [Validators.required]],
        conditional_rates : this.fb.array([
          this.fb.group({
            min_value: ['', [Validators.required]],
            max_value: ['', [Validators.required]],
            amount: ['', [Validators.required]]
          })
        ])
      })
    )
  }

  goBack()
  {
    this.router.navigate([URLS.shippingRates]);
  }

  deleteCondition(i, j){
    (this.rateForm.get('rules.' + i + '.conditional_rates') as FormArray).removeAt(j);
  }

  deleteRule(i){
    (this.rateForm.get('rules') as FormArray).removeAt(i);
  }

  duplicateRule(i){
    
    let childLength2 = this.rateForm.get('rules.'+i+'.conditional_rates').value.length
    let dummy =  this.fb.array([])
    for (let i = 0; i < childLength2; i++) {
      dummy.push(this.fb.group({
        min_value: ['', [Validators.required]],
        max_value: ['', [Validators.required]],
        amount: ['', [Validators.required]]
      }))
    }
    (this.rateForm.get('rules') as FormArray).push(
      this.fb.group({
        title: ['', [Validators.required, Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
        conditional_rates : dummy
      })
    ) 
    this.rateForm.get('rules.'+(this.rateForm.value.rules.length - 1)).patchValue(this.rateForm.get('rules.' + i).value)
    
  }

  getZones()
  {
    this.shippingService.getDefaultZones(this.shippingRateId).then(resp => {
      this.loading = false;
      if (resp)
      {
        this.zones = [...resp.data.results]
        
      }
    })
  }

  onSubmit() {
    this.loading = true;
    if(this.shippingRateId)
    {
      //update existing shipping
      this.rateForm.value.id = this.shippingRateId
      this.rateForm.value.default = true
      this.shippingService.updateShippingRate(this.rateForm.value).then(resp => {
        this.loading = false;
        if(resp) {
          this.snackbar.open("shipping rate updates successfuly.", "", {duration: 3000});
          this.router.navigate([URLS.shippingRates]);
        }
      }) 
    }
    else{
      // create new shipping
      this.rateForm.value.default = true
      this.shippingService.createShippingRate(this.rateForm.value).then(resp => {
        this.loading = false;
        if(resp) {
          this.snackbar.open("shipping rate created successfuly.", "", {duration: 3000});
          this.router.navigate([URLS.shippingRates]);
        }
      })
    }
  }

  addEmptyConditions(conditionArrayLength) {
    let dummy =  this.fb.array([])
    for (let i = 0; i < conditionArrayLength; i++) {
      dummy.push(this.fb.group({
        min_value: ['', [Validators.required]],
        max_value: ['', [Validators.required]],
        amount: ['', [Validators.required]]
      }))
    }
    (this.rateForm.get('rules') as FormArray).push(
      this.fb.group({
        title: ['', [Validators.required, Validators.pattern(/^[^!"`'#%,:;<>={}~\$\(\)\*\+\/\\\?\[\]\^\|]+$/)]],
        conditional_rates : dummy
      })
    )
  }

  ngOnInit() {
    this.loading = true
    if (this.shippingRateId)
    {
      // edit shipping rate 
      this.shippingService.getSingleShippingRate(this.shippingRateId).then((resp) => {
        if(resp)
        {
          this.loading = false ;
          (this.rateForm.get('rules') as FormArray).removeAt(0)
          if(resp.data.rules.length) {
            for (let i = 0; i < resp.data.rules.length; i++) {
              let conditionArray = resp.data.rules[i].conditional_rates.length
              this.addEmptyConditions(conditionArray)
            }
          }
          this.rateForm.patchValue(resp.data)
          this.getZones()
          this.zones.push({
            title: resp.data.zone_name,
            id: resp.data.zone
          })
        }
      })
    }
    else 
    {
      // create new shipping rate
      this.getZones()
    }
  }
}