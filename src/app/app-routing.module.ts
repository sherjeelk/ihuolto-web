import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {OrderSuccessComponent} from "./pages/order-success/order-success.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent

  },
  {
    path: 'pages/order-success',
    component: OrderSuccessComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
