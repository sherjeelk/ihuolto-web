import { Injectable } from '@angular/core';
import {AppConstants} from "../AppConstants";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public BASE_URL = AppConstants.BASE_URL;

  constructor(private snackBar: MatSnackBar) { }


  /**
   * Convert to title case string e.g; price > Price
   * @param text
   */
  public titleCase(text: any): string {
    return text.replace(/\w\S*/g,  (txt: any) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  /**
   * Display a snack bar
   * @param msg Message to be displayed
   * @param duration Duration of message, how long it should be on screen
   */
  public presentSnackBar(msg: string, duration = 5000): void {
    this.snackBar.open(msg, '', {duration});
  }


}
