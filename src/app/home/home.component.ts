import { Component, OnInit } from '@angular/core';
import {DataserviceService} from "../services/dataservice.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  isLinear=true;
  constructor(public dataService : DataserviceService) { }

  ngOnInit(): void {
    this.dataService.calculateTax();
  }

}
