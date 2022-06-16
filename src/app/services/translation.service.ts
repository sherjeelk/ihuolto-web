import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

/**
 * This service is used to load the language in the app,
 * it fetches the language file and make it available
 * depending on the chosen language
 */
export class TranslationService {

  public languages = [{name: 'English', value: 'en'}, {name: 'Finnish', value: 'fi'}];
  public ready = false;
  public lang: string | null = 'fi';
  private translations: any;

  constructor(private http: HttpClient) {
    this.init();
  }

  /**
   * This function can be called to find any word in current language
   * @param key is the key of the word
   */
  public getString(key: string) {
     // console.log('Key', key, this.translations);
    return this.translations ? this.translations[key] : '';
  }

  /**
   * This function is supposed to be called when language is changed
   * @param code is the language code e.g en (English),es(Spanish),ar(Arabic)
   */
  public changeLanguage(code: string) {
    this.ready = false;
    this.lang = code;
    console.log('Lang is change', code);
    localStorage.setItem('lang', code);
    this.loadLang();
  }

  private async init() {
    this.lang = localStorage.getItem('lang');
    console.log('Stored lang is ', this.lang);
    if (this.lang === 'fi') {
      localStorage.setItem('lang', 'fi');
      this.lang = 'fi';
    }
    this.lang = this.lang || 'fi';
    this.loadLang();
  }

  public getLang(){
    return this.lang;
  }

  /**
   * This function loads the language file and set the contents
   * to local private object, it uses lang variable to identify
   * chosen language
   */
  private loadLang() {
    this.http.get<any>(`../assets/json/${this.lang}.json`).subscribe(data => {
      console.log('Lang', data);
      this.translations = data;
      this.ready = true;
    }, error => {
      console.log('Unable to load translations', error);
      this.ready = true;
    });
  }
}
