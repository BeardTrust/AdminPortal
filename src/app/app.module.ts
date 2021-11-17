
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './admin/user/user.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AuthComponent } from './auth/auth.component';
import { AccountComponent } from './admin/accounts/accounts.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CardComponent } from './admin/card/card.component';
import { LoanComponent } from './admin/loans/loans.component'
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {MatIconModule} from '@angular/material/icon'
import {JwtInterceptor} from "./shared/interceptors/http-interceptor";

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    AdminComponent,
    UserComponent,
    AuthComponent,
    AccountComponent,
    CardComponent,
    LoanComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    MatIconModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
