import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from "@angular/material/card";
import {MatStepperModule} from "@angular/material/stepper";
import { InfoCardComponent } from './pages/info-card/info-card.component';
import { OrderComponent } from './pages/order/order.component';
import { ServiceComponent } from './pages/service/service.component';
import { FooterComponent } from './footer/footer.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSliderModule} from "@angular/material/slider";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {HttpClientModule} from "@angular/common/http";
import { ToastrModule } from 'ngx-toastr';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {OrderSuccessComponent} from "./pages/order-success/order-success.component";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {NgxMatTimepickerModule} from "ngx-mat-timepicker";
import {MatIconModule} from "@angular/material/icon";
import {SafeHtmlPipe} from "./services/SafeHtml";
import {MatRadioModule} from "@angular/material/radio";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { LanguagePipe } from './pipes/language.pipe';
import { DialogComponentComponent } from './dialog-component/dialog-component.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    InfoCardComponent,
    OrderComponent,
    ServiceComponent,
    FooterComponent,
    OrderSuccessComponent,
    SafeHtmlPipe,
    LanguagePipe,
    DialogComponentComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatStepperModule,
        MatProgressBarModule,
        MatSliderModule,
        MatCheckboxModule,
        MatButtonModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        MatSnackBarModule,
        MatOptionModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        FormsModule,
        NgxMatTimepickerModule,
        MatIconModule,
        MatRadioModule,
        MatProgressSpinnerModule


    ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 500}}

  ],
  exports: [
    LanguagePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
