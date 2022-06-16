import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import * as moment from 'moment';
import * as _ from 'lodash';
import {Service} from "../../models/Service";
import {UtilService} from "../../services/util.service";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {DataserviceService} from "../../services/dataservice.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatRadioChange} from "@angular/material/radio";
import {TranslationService} from "../../services/translation.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponentComponent} from "../../dialog-component/dialog-component.component";

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {
  productData = []; // refer plunker
  counter: number = 0;
  today = moment();
  newProduct: any[] = [];
  progress = false;
  serviceType: any[] = [];
  public show = 3;
  cancelContactForm = false;
  outdoor=false;

  pages = {
    total: 0,
    current: 0,
    limit: 3,
    start: 0
  };

  // activeService: boolean = false;
  // btn_continue = true;
  contactForm = false;
  SubmitDetails: FormGroup;
  allService: Service[] = [];

  allBrands: any = [];
  // serviceData: any = {
  //   meterSqValue: 50,
  //   brandValue: [],
  // }
  serviceId: string = '';
  // picker1: any;
  minDate: any;
  productInProgress = false;
  maxDate: any;
  // selectedTime: any;
  addNewProductForm = this.fb.group({
    name: ['', Validators.required],
    desc: ['', Validators.required]
  })
  more: boolean[] = []
  public price: number = 450;
  ranges = [
    {
      min: 0,
      max: 200,
      price: {
        3: 420,
        4: 600,
        5: 350,
        6 :300
      }
    },
    // {
    //   min: 120,
    //   max: 200,
    //   price: {
    //     3: 600,
    //     4: 900,
    //     5: 450
    //   }
    // },
    {
      min: 200,
      max: 250,
      price: {
        3: 0,
        4: 750,
        5: 0,
        6 :300
      }
    },
  ]
  public filteredBrands: any = [];
  public brandId: number = 0;

  constructor(private apiService: ApiService, public util: UtilService,
              public data: DataserviceService, private fb: FormBuilder,
              private change: ChangeDetectorRef, public translation: TranslationService, private dialog: MatDialog) {

    this.SubmitDetails = this.fb.group({
        phone: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
        email: ['', [Validators.required, Validators.email, Validators.pattern('^.+@[^\\.].*\\.[a-z]{2,}$')]],
        u_name: ['', Validators.required]

      }
    );
    this.getItems();

  }

  ngOnInit(): void {
    this.getServices();
    console.log(this.today);
    this.getSubServiceData();
    this.data.subServicePrice = this.ranges[0];

  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }


  changeArea(event: any) {
    this.data.areaChange.next(event.value);
    this.data.contactMe = false;
    this.data.step.service = false;
    this.data.index = 0;
    this.change.detectChanges();
    for (const range of this.ranges) {
      if (this.data.serviceData.meterSqValue <= range.max && this.data.serviceData.meterSqValue >= range.min) {
        this.data.subServicePrice = range
        this.data.total = 0;
        this.serviceId = '';

        console.log('data value of subservice price ', this.data.subServicePrice)
      }
    }
  }

  changeAreaAlert(event: any) {
    if (this.data.selectedService?.type === 2 ) {
      this.changeArea(event);
     if(this.data.serviceData.brandValue.length > 0){
       const dialogRef = this.dialog.open(DialogComponentComponent, {
         data: {data: '', type: 2},
         width: '250px',
       });
       dialogRef.afterClosed().subscribe( data => {
         if (data === 1) {
           this.data.oldMeterSq = this.data.serviceData.meterSqValue;
           this.getProducts();
         } else {
           if (this.data.oldMeterSq){
             this.data.serviceData.meterSqValue = this.data.oldMeterSq
           } else {
             console.log('old data', this.data.oldMeterSq);
           }
         }
       });
     } else {
       this.data.oldMeterSq = this.data.serviceData.meterSqValue;
       this.getProducts(1);
     }
    } else {
      this.data.oldMeterSq = this.data.serviceData.meterSqValue;
      this.changeArea(event);
    }
  }

  selectService(service: Service) {

    console.log('I selected this service', service);
    this.data.selectedService = service;
    this.data.serviceData.brandValue = [];
    this.data.serviceData.brandValue = [];
    this.data.order.subService = undefined;
    this.data.calculateTotal();
    this.data.contactMe = false;
    this.data.step.service = false;
    this.data.index = 0;
    this.data.serviceData.meterSqValue = 0;
    this.data.areaChange.next(0);
    if (service.type === 2) {
      this.getAllBrands();
      this.data.serviceData.meterSqValue = 0;

    } else {
      this.data.allProducts = [];
    }

    this.change.detectChanges();

  }

  addProduct($event: MatCheckboxChange, item: any) {
    console.log($event);
    // console.log(item);
    if ($event.checked) {
      item.checked = $event.checked;
      this.data.serviceData.brandValue.push(item);
      this.data.calculateTotal();
      console.log('item', item, this.data.total);

    } else {
      _.remove(this.data.serviceData.brandValue, item);
      this.data.calculateTotal();
    }


  }

  continue() {

    if (this.data.serviceData.meterSqValue > 0)
    {
      this.data.index = 0;
      this.data.step.service = true;

      setTimeout(() => {
        this.data.index = 1;
      }, 30);

    } else {
      console.log('correct form details');
    }
    // this.data.services=this.serviceData;
    // console.log(this.data.services);
    console.log('services data', this.data.serviceData);

  }

  getProducts(type?: number) {
    this.pages.limit = 3;
    console.log('Modifying Brand Id');
    if (this.productInProgress) {
      return;
    }
    this.productInProgress = true;
    this.data.contactMe = false;
    this.data.step.service = false;
    this.data.index = 0;
    this.apiService.getProducts(this.brandId, this.pages.start, this.pages.limit, this.outdoor ? -1 : this.data.serviceData.meterSqValue).subscribe(data => {

      console.log('data', data);
      this.data.allProducts = data;
      if (this.data.allProducts.length === 0) {
        if(this.brandId){
          this.util.presentSnackBar(this.translation.getLang() === 'en' ? 'No products found' : 'Tuotteita ei löytynyt');
        }
      } else {
        this.data.allProducts.forEach((el: { checked: boolean; }) => {
          el.checked = false;
        });
      }
      this.data.allProducts.forEach((el: any) => {
        const found = _.filter(this.data.serviceData.brandValue, {id: el.id})
        el.checked = found.length > 0;

      });

      this.productInProgress = false;

      console.log('these are products', data);

    }, error => {
      this.productInProgress = false;
      console.log('products not loading', error);
    });
  }

  onsubmitQuery() {
    if (this.SubmitDetails.valid) {
      console.log('form value', this.SubmitDetails.value);
    }
  }

  contactMe(contact: boolean) {
    if (contact) {
      this.data.selectedService = undefined;
      this.data.serviceData.brandValue = [];
      this.data.allProducts = [];
      console.log('size value and service selected value is blank', this.data.serviceData);
      this.data.step.service = true;
      this.data.serviceData.meterSqValue = undefined;
      this.data.index = 0;
      this.data.contactMe = true;

      setTimeout(() => {
        this.data.index = 1;
      }, 30);
      console.log('services data', this.data.serviceData);
    } else {
      this.contactForm = false;
    }
  }

  getDescription(product: any) {
    product.desc = product.desc.replaceAll('&lt;', '<');
    if (product.expanded) {
      return product.desc;
    } else if (product.desc.length <= 75) {
      return product.desc;

    } else if (product.desc.length > 75) {
      return product.desc.slice(0, 75) + '...';
    }
  }

  changeCustomExpandedState(product: any) {
    this.data.allProducts.forEach((item: { expanded: boolean; }) => {
      if (item === product) {
        item.expanded = !item.expanded;
      } else {
        item.expanded = false;
      }
    });
  }

  addNewProduct() {

    const exist = _.find(this.newProduct, {name: this.addNewProductForm.get('name')?.value});
    console.log('Exist', exist);
    if (!this.addNewProductForm.valid) {
      this.util.presentSnackBar(this.translation.getLang() === 'en' ? 'The form is not valid' : 'Lomake ei kelpaa', 1000);
    } else if (exist) {
      this.util.presentSnackBar(this.translation.getLang() === 'en' ? 'The Product name is already exist' : 'Tuotenimi on jo käytössä', 1000)
    } else {
      this.newProduct.push(this.addNewProductForm.value);
      this.data.customProduct = this.newProduct;

    }
    this.addNewProductForm.reset();
    this.contactForm = !this.contactForm;
  }

  removeProduct(product: any) {
    _.remove(this.newProduct, product);
  }

  applianceType($event: MatRadioChange) {
    console.log($event)
    if ($event.value === '1') {
      this.outdoor=true;
      this.filteredBrands = _.filter(this.allBrands, item => item.outdoor);
      console.log('outdoor selected', this.filteredBrands, this.allBrands);
      this.getProducts();
    } else {
      this.outdoor=false;
      console.log('Indoor selected')
      this.filteredBrands = _.filter(this.allBrands, item => item.indoor);
      this.getProducts();
    }
  }

  getSubServiceData() {
    this.progress = true;
    this.apiService.getAllSubService('subService').subscribe(data => {
      this.progress = false;
      console.log('subService', data);
      this.serviceType = data;
    }, error => {
      this.progress = true;
      this.util.presentSnackBar(this.translation.getLang() === 'en' ? 'Error while loading services' : 'Virhe ladatessa palveluita', 1000);
    })
  }

  addService(service: any) {
    this.data.service1 = service
    this.data.order.service = this.data.selectedService;
    this.data.order.subService = service.name;
    console.log("service name", this.data.order.subService)
    this.data.calculateTotal(this.data.subServicePrice.price[service.type]);
    this.serviceId = service.id;
  }

  getItems() {
    console.log(this.counter + 'dat size' + this.productData.length)

    for (let i = this.counter + 1; i < this.productData.length; i++) {
      this.newProduct.push(this.productData[i]);
      if (i % 10 == 0) break;
    }
    this.counter += 3;

  }

  /**
   * This function used to display more then 3 product
   */
  showMore() {
    this.pages.limit = 1000;
    this.progress = true
    this.apiService.getProducts(this.brandId, this.pages.start, this.pages.limit, this.outdoor ? 0 : this.data.serviceData.meterSqValue).subscribe(data => {
      this.progress = false;
      this.data.allProducts = data

      console.log('limited data', data);
      this.data.allProducts.forEach((el: { checked: boolean; id: any; }) => {
        el.checked = !!_.find(this.data.serviceData.brandValue, {id: el.id});
      });
    }, error => {
      this.progress = false;
      this.util.presentSnackBar(this.translation.getLang() === 'en' ? 'Error while loading products' : 'Virhe ladatessa tuotteita', 0,);
    })

  }

  cancelContact() {
    this.contactForm = !this.contactForm;
  }

  private getServices() {

    // console.log('sdfss', this.serviceType)
    this.apiService.getAllService('service').subscribe(data => {
      this.allService = data;
      this.data.selectedService = this.allService[0];
      this.selectService(this.data.selectedService);
      console.log('these are services', data);
    }, error => {
      console.log('these are services', error);
    });
  }

  private getAllBrands() {
    this.progress = true
    this.apiService.getAllBrands().subscribe(data => {
      this.allBrands = data;
      this.progress = false

      console.log('these are brands', this.allBrands);
    }, error => {
      console.log('not brands', error);
      this.progress = false

    });
  }
}
