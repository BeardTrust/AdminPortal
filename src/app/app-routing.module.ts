import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { UploadCsvComponent } from './components/upload-csv/upload-csv.component';
import { ViewUsersComponent } from './components/view-users/view-users.component';

const routes: Routes = [
  {
    path:'',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
      },
      {
        path: 'admin/users',
        component: ViewUsersComponent
      },
      {
        path: 'admin/uploadCsv',
        component: UploadCsvComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
