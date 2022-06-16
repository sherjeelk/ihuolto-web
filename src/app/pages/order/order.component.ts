import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {ApiService} from "../../services/api.service";
import {DataserviceService} from "../../services/dataservice.service";
import {Router} from "@angular/router";
import {UtilService} from "../../services/util.service";
import {TranslationService} from "../../services/translation.service";
import {MatDialog} from "@angular/material/dialog";
import {TermsconditionComponent} from "../../termscondition/termscondition.component";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  public cancel = false;
  public acceptTerm = false;
  public addCoupon = false;
  // orderSubmit? : any;
  orderSubmit: FormGroup;
  orderData: any;
  serviceData: any;
  // ImageToUpload: File = null;
  imageUrl: any = {
    one: '',
    two: '',
    three: '',
    four: '',
  };

  imageFile: any = {
    one: '',
    two: '',
    three: '',
    four: '',
  };
  uploadForm = new FormData();
  applied = false;
  readButton = false;
  private addImage = false;

  constructor(public dialog: MatDialog,private util: UtilService, private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router, private apiService: ApiService, public data: DataserviceService, public api: ApiService, public translation: TranslationService) {
    this.orderSubmit = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^.+@[^\\.].*\\.[a-z]{2,}$')]],
      streetBuilding: ['', [Validators.required, Validators.minLength(3)]],
      postcode: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
      city: ['', Validators.required],
      anyNote: ['', Validators.required]

    });
  }


  ngOnInit(): void {
  }


  openSnackBar() {
    this.snackBar.open('not valid', '');
  }


  removeImage(img: any): any {
    this.imageUrl[img] = '';
    this.imageFile[img] = null;
    this.uploadForm = new FormData();
    for (const key of Object.keys(this.imageFile)) {
      if (key) {
        this.uploadForm.append('files', this.imageFile[key]);
      }
    }
  }

  onFileChange(event: any, which: any): void {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = (mFile) => {

        this.imageUrl[which] = reader.result as string;
        this.imageFile[which] = file;
        this.uploadForm.append('files', file);
        this.addImage = true;

      };

    }
  }

  imageUpload(): void {
    // show progress
    if (this.addImage) {
      this.data.loading = true;
      console.log('this is upload form', this.uploadForm);
      this.api.uploadImage(this.uploadForm).subscribe(res => {
        console.log('Response Of Image Upload::', res);
        this.data.order.images = res;
        this.postOrder();
      }, error => {
        this.data.loading = false;
        // this.utils.presentSnackBar('Error While Uploading Images!');
      });
    } else {
      this.postOrder();
    }

  }

  postOrder(): void {
    console.log(this.data.order.images);
    if (this.orderSubmit.valid) {
      console.log('form value', this.orderSubmit.value);
      const body: any = {
        f_name: this.orderSubmit.value.firstName,
        l_name: this.orderSubmit.value.lastName,
        phone: this.orderSubmit.value.phone,
        email: this.orderSubmit.value.email,
        street_building: this.orderSubmit.value.streetBuilding,
        postcode: this.orderSubmit.value.postcode,
        city: this.orderSubmit.value.city,
        note: this.orderSubmit.value.anyNote,
        images: this.data.order.images, // Images of propertycontactPhone
        // this.orderSubmit.value
        area: this.data.serviceData.meterSqValue,
        service: this.data.selectedService?.name,
        products: this.data.serviceData.brandValue,
        contactMe: this.data.contactMe,
        total: this.data.total,
date:  new Date().toISOString()
      }
      console.log('this is post order body',this.data.order.subService)
      if (this.data.order.subService) {

        console.log('this is sub service', this.data.order)
        body.subService = this.data.order.subService
      }
      console.log(this.orderSubmit.value, body);
      //  post order here
      this.apiService.order(body).subscribe(data => {
        this.orderData = data;
        console.log('form data has been submitted', data);
        this.router.navigateByUrl('/pages/order-success');

      }, error => {
        console.log( 'data not submitted');
      });
    } else {
      console.log('bhai form bhar');
      this.openSnackBar();

    }


  }


  acceptTerms($event: MatCheckboxChange) {
    this.acceptTerm = $event.checked;
  }


  cancelPolicy($event: MatCheckboxChange) {
    this.cancel = $event.checked;
  }

  order() {


  }

  onSearchChange(value: any) {
    if (value.value.length === 5) {
      console.log('this is value of postcode', value.value);
      this.getPostCode(value.value);
    }
  }

  couponEvent($event: MatCheckboxChange) {
    this.addCoupon = $event.checked;
  }

  addCouponCode(coupon: HTMLInputElement) {
    const originalPrice = (100 * ((this.data.total - this.data.absoluteCharge) / (100 + this.data.percentageCharge)))

    const body = {
      coupon: coupon.value,
      total: originalPrice
    }
    this.data.couponValue = coupon.value;
    this.api.discountCoupon(body).subscribe(data => {
      console.log('coupon', data);
      this.data.couponData = data;
      if(data.status === 1){
        this.data.applyCoupon(data);
        this.util.presentSnackBar(this.translation.getLang() === 'en' ?'Your coupon applied successfully':'Kupongin käyttö onnistui')
        this.applied = true;
        this.readButton = true;
      }
      else {
        console.log('coupon not found' )
        this.util.presentSnackBar(this.translation.getLang() === 'en' ?'Your coupon code is not valid ':
          'Kuponkikoodisi ei ole kelvollinen',1000)
        this.data.couponValue = '';
       }

    }, error => {
      console.log(error.message);
      this.util.presentSnackBar(this.translation.getLang() === 'en' ? 'Your coupon code is not valid':'Kuponkikoodisi ei ole kelvollinen', 1000)

    })
    coupon.value = '';
  }

  RemoveCouponCode(coupon: HTMLInputElement) {
    this.applied = false;
    this.readButton = false;
    console.log('coupon data 1', this.data.couponValue)
    this.data.couponValue = '';
    // this.data.removeCoupon(this.data.couponValue);
    if (this.data.selectedService?.type === 2) {
      this.data.calculateTotal();
    } else {
      this.data.calculateTotal(this.data.subServicePrice.price[this.data.service1.type])
    }
    this.util.presentSnackBar(this.translation.getLang() === 'en' ? 'Your coupon removed successfully':'Kupongin poistaminen onnistui')





    // console.log('coupon data 2', this.data.couponValue)
    // console.log('coupon removed', this.data.couponData);
    // this.data.applyCoupon(this.data.couponValue);


  }
  openDialog() {
    console.log('open dialog');
    const dialogRef = this.dialog.open(TermsconditionComponent, {
      width: '600px',
      height: '600px'
    });
  }

  private getPostCode(postCode: any) {
    this.api.getPostCode(postCode).subscribe(data => {
      if (data.length > 0) {
        // this.postcodeError = false;
        this.orderSubmit.get('city')!.patchValue(this.util.titleCase(data[0].name));
      } else {
        // this.postcodeError = true;
        // this.customerDetailForm.get('city').setErrors({incorrect: true});
        this.orderSubmit.get('city')!.patchValue('');

        this.util.presentSnackBar(this.translation.getLang() === 'en' ?'It appears to be a invalid postcode!':'Se näyttää olevan virheellinen postinumero!');
      }
    });
  }
}
