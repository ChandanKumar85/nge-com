import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./frontend/frontend.module').then((m) => m.FrontendModule)
  },
  // {
  //   path: 'login',
  //   loadChildren: () => import('./dashboard/auth/login.module').then((m) => m.LoginModule)
  // },
  {
    path: 'admin',
    loadChildren: () => import('./dashboard/main.module').then((m) => m.MaindModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
