import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DataserviceService} from "../../services/dataservice.service";
import * as _ from 'lodash';
import {MatDialog} from "@angular/material/dialog";
import {DialogComponentComponent} from "../../dialog-component/dialog-component.component";
import {TranslationService} from "../../services/translation.service";
@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements OnInit {

  area = 0;

  constructor( public  data : DataserviceService, public dialog: MatDialog, public cd: ChangeDetectorRef, public translation: TranslationService) { }

  ngOnInit(): void {
    this.data.areaChange.subscribe(data => {
      console.log(data);
      this.area = data;
      // this.cd.detectChanges();
    })
  }

  /**
   * This function used to remove product form info card
   * @param prod
   */

  removeProduct(prod: any) {
    console.log('prod', prod)
    if(this.data.serviceData.brandValue.length > 1)
    {
      console.log('brand array' , this.data.serviceData.brandValue);
      this.data.removeProduct(prod);
      for(const el of this.data.serviceData.brandValue) {
        if (el.id === prod.id) {
          el.checked = false;
        }
      }
      let unCheckedProd = _.find(this.data.allProducts, {id: prod.id})
      console.log('Unchecked', unCheckedProd)
      unCheckedProd.checked = false;
      console.log('service removed',  _.find(this.data.serviceData.brandValue, {id : prod.id}));
    }
    else {
      const dialogRef = this.dialog.open(DialogComponentComponent, {
        width: '250px',
        data: {data: prod, type: 1}
      });
      console.log('service not removed');
    }

    // _.remove(this.data.serviceData.brandValue, {id : prod.id})
    // let unCheckedProd = _.find(this.data.allProducts, {id: prod.id})
    // console.log('Unchecked', unCheckedProd)
    // unCheckedProd.checked = false;

  }
}
