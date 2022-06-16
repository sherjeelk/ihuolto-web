import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppConstants} from "../AppConstants";
import {Observable} from "rxjs";
import {Service} from "../models/Service";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private headers:any;

  constructor(private http: HttpClient) { }

  public  getAllService(serviceType: any): Observable<Service[]> {
    return this.http.get<Service[]>(AppConstants.API.All_SERVICES + `?serviceType=${serviceType}`);
  }

  public  getAllSubService(serviceType: any): Observable<Service[]> {
    return this.http.get<Service[]>(AppConstants.API.All_SERVICES + `?serviceType=${serviceType}`);
  }
    public  getAllProducts(service: Service): Observable<any[]> {
    return this.http.get<any[]>(AppConstants.API.All_PRODUCTS + '?service='+ service.id );
  }

  public  getAllBrands(): Observable<any[]> {
    return this.http.get<any[]>(AppConstants.API.All_Brands );
  }
  // public getProducts(brand: number, start: number, limit: number = 50, range?: number):Observable<any[]>{
  //   return  this.http.get<any[]>(AppConstants.API.All_PRODUCTS + `?brand=${brand}&_limit=${limit}&_start=${start}`);
  // }

  public getProducts(brand: number, start: number, limit: number = 50, range: number = -1):Observable<any[]>{
    if(range === -1){
      return  this.http.get<any[]>(AppConstants.API.All_PRODUCTS + `?brand=${brand}&_limit=${limit}&_start=${start}&outdoor=true`);

    }
    else {
      return this.http.get<any[]>(AppConstants.API.All_PRODUCTS + `?brand=${brand}&_limit=${limit}&_start=${start}&_min_lte=${range}&_max_gte=${range}`);

    }
  }
  public getLimitedProducts( start: number, limit: number = 50):Observable<any[]>{
    return  this.http.get<any[]>(AppConstants.API.All_PRODUCTS + `?_limit=${limit}&_start=${start}`);
  }
  public order(body:any):Observable<any>{
    return  this.http.post<any>( AppConstants.API.Order, body);
  }
  public discountCoupon(body:any):Observable<any>{
    return this.http.post<any>(AppConstants.API.COUPON, body);
  }
   uploadImage(body: FormData): Observable<any>{
    return this.http.post(AppConstants.API.UPLOAD_IMAGES, body);
  }

  getPostCode(postCode: any): Observable<any>{
    return this.http.get(AppConstants.API.POSTCODE + `?postcode=${postCode}`);
  }

  public getAllPricing(): Observable<any[]> {
    return this.http.get<any[]>(AppConstants.API.All_PRICING);
  }
}
