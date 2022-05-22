import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';

import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { SegundoHomeComponent } from './segundoHome/segundoHome.component';
import { UserFavoritesComponent } from './user-favorites/user-favorites.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UsersDetailsComponent } from './users-details/users-details.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'users-details', component: UsersDetailsComponent, canActivate: [AuthGuard] },
      { path: 'home', component: HomeComponent, },
      { path: 'profile', component: UserProfileComponent },
      { path: 'users', component: UsersComponent },
      { path: 'favorites', component: UserFavoritesComponent},
      { path: 'segundoHome', component: SegundoHomeComponent},

    ],
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule],
})
export class PagesRoutingModule {}
