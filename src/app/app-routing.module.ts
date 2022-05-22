import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { PagesComponent } from './pages/pages.component';
import { PagesRoutingModule } from './pages/pages-routing.module';
const routes: Routes = [
  { path: '', component: PagesComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    AuthRoutingModule,
    PagesRoutingModule,
  ],

  exports: [RouterModule],
})
export class AppRoutingModule {}
