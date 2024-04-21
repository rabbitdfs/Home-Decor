import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PersonalRoutingModule} from './personal-routing.module';
import {OrdersComponent} from './orders/orders.component';
import {InfoComponent} from './info/info.component';
import {FavouriteComponent} from './favourite/favourite.component';
import {SharedModule} from "../../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    OrdersComponent,
    InfoComponent,
    FavouriteComponent
  ],
  imports: [
    CommonModule,
    PersonalRoutingModule,
    ReactiveFormsModule,
    SharedModule,

  ]
})
export class PersonalModule {
}
