import { Component, OnInit } from '@angular/core';
import {TranslationService} from "../services/translation.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public translationService: TranslationService) { }
  public showLang = false;
  MyFunction: any;
  ngOnInit(): void {
  }
  changeLanguage(code: string) {
    this.translationService.changeLanguage(code);
  }

  dropdown() {
    this.showLang = !this.showLang
  }

}
