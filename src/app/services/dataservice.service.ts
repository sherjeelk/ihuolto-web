import {Injectable} from '@angular/core';
import {Service} from "../models/Service";
import {ApiService} from "./api.service";
import * as _ from "lodash";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataserviceService {
  step = {service: false, order: false};
  services: any;
  service1: any
  subServicePrice: any;
  selectedService?: Service;
  oldMeterSq:any;
  loading = false;
  contactMe = false;
  serviceData: any = {
    meterSqValue: 0,
    brandValue: []
  };
  customProduct: any =[];
  total = 0
  index = 0;
  images: [] = []
  allProducts: any = [];
  areaChange = new BehaviorSubject<number>(50)

  order: any = {};

  couponData: any;
  public subTotal = 0;
  couponValue: any;
  grandTotal: number = 0;
  subService: any;
  public percentageCharge = 0;
  public absoluteCharge = 0;

  constructor(private apiService: ApiService) {
  }

  calculateTotal(price = 0) {
    this.total = price
    this.subTotal = price;
    if (price === 0){
      for (let product of this.serviceData.brandValue) {
        this.subTotal = this.subTotal +  product.price;
      }
    }
    console.log('this is total', this.total)
    console.log('this is subtotal', this.subTotal)
    console.log('this is per tax', this.percentageCharge)
    console.log('this is ab tax', this.absoluteCharge)
    this.total = Math.round(this.subTotal + (this.subTotal > 0 ? this.absoluteCharge: 0));
    // this.total = this.total + this.grandTotal;

  }

  applyCoupon (data:any) {
    console.log('data value', data);
    const originalPrice = (100 * ((this.total - this.absoluteCharge) / (100 + this.percentageCharge)))
    console.log('data originalPrice', originalPrice);
    console.log('this is original price', originalPrice);
    if(data) {
      console.log('this is coupon data', data);
      let discountedTotal: number;
      discountedTotal =  originalPrice - data.discount;
      console.log('this is discounted total', discountedTotal);
       this.total = (discountedTotal + (discountedTotal * (this.percentageCharge/100)) + this.absoluteCharge);
       this.total = Number(this.total.toFixed(2));
      console.log('this is total charge',this.total)
    }
    else {
      console.log('coupon code is not applied')
      const originalPrice = (100 * ((this.total - this.absoluteCharge) / (100 + this.percentageCharge)))
      console.log('this is original price', originalPrice);

    }
  }

  removeCoupon (removeValue:any) {
    console.log('data  removed value', removeValue);
    const originalPrice = (100 * ((this.total - this.absoluteCharge) / (100 + this.percentageCharge)))
    console.log('this is original price', originalPrice);

    if(removeValue) {
      console.log('this is coupon remove data', removeValue);
      this.calculateTotal();
    }
    else {
      console.log('discount', removeValue.discount)

    }
  }
  calculateTax() {
    this.apiService.getAllPricing().subscribe((charge: any) => {
      console.log('these are all pricing', charge);
      let percentageCharge = 0
      let absoluteCharge = 0
      charge.forEach((el:any) => {
        if (el.enable && el.type.toLowerCase() === 'percentage') {
          percentageCharge = percentageCharge + el.value;
          this.percentageCharge = percentageCharge
        } else if (el.enable && el.type.toLowerCase() === 'absolute') {
                absoluteCharge = absoluteCharge + el.value;
                this.absoluteCharge = absoluteCharge;
        }
      })

    }, (error: any) => {
      console.log('An error occurred while getting all charges', error);
    })
  }

  //function to remove products which is in brands array
   removeProduct(product: any) {
    console.log('this is service to be removed',this.serviceData.brandValue);



    _.remove(this.serviceData.brandValue, {id: product.id});

    for(const el of this.allProducts) {
      if (el.id === product.id) {
        el.checked = false;
      }

      if (this.serviceData.brandValue.length === 0){
        // todo
      }
    }

    this.calculateTotal();
    console.log('product removed from selected services array');
  }

}
