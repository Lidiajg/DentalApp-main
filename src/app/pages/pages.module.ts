import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { IonicModule } from '@ionic/angular';

import { HomeComponent } from './home/home.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UsersComponent } from './users/users.component';
import { UsersDetailsComponent } from './users-details/users-details.component';
import { PagesComponent } from './pages.component';
import { UserFavoritesComponent } from './user-favorites/user-favorites.component';
import { SegundoHomeComponent } from './segundoHome/segundoHome.component';

@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    UserProfileComponent,
    UsersComponent,
    UsersDetailsComponent,
    UserFavoritesComponent,
    SegundoHomeComponent
  ],
  exports:[
    HomeComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ScrollingModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class PagesModule { }
