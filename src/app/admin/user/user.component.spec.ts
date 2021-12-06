import { ComponentFixture, TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule} from "@angular/forms";
import objectContaining = jasmine.objectContaining;
import {HttpHeaders, HttpResponse} from "@angular/common/http";
import { HttpService } from '../../shared/services/http.service';
import { ReactiveFormsModule } from '@angular/forms';

import { MatPaginatorModule } from '@angular/material/paginator';
import {PageEvent} from "@angular/material/paginator";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserComponent } from './user.component';
import { of } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { environment } from 'src/environments/environment';

describe('UserComponent', () => {
  let component: UserComponent;
  let cardService: HttpTestingController;
  let fixture: ComponentFixture<UserComponent>;
  let httpService: HttpService;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
        NoopAnimationsModule
      ],
      declarations: [ UserComponent ],
      providers: [HttpService]
    })
    .compileComponents();
  });

  beforeAll(() => {
    cardService = TestBed.inject(HttpTestingController);
    httpService = TestBed.inject(HttpService);
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    const response = new HttpResponse({
      body:{},
      status: 200,
      statusText: 'OK'
    });
    const call = cardService.expectOne(`${environment.baseUrl}${environment.adminEndpoint}${environment.usersEndpoint}`);
    expect(call.request.method).toEqual('GET');
    call.flush(response);
    cardService.verify();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();

    /*
    const response = new HttpResponse({
      body:{},
      status: 200,
      statusText: 'OK'
    });
    */

    //const call = cardService.expectOne(`${environment.baseUrl}${environment.cardsEndpoint}`);
    //const call2 = cardService.expectOne(`${environment.baseUrl}${environment.adminEndpoint}${environment.usersEndpoint}`);
    //expect(call.request.method).toEqual('GET');
    //expect(call2.request.method).toEqual('GET');
    //call.flush(response);
    //call2.flush(response);
  });

  it('should make http DELETE request', () => {
    component.deleteUser("1");

    const response = new HttpResponse({
      body:{},
      status: 200,
      statusText: 'OK'
    });

    const call1 = cardService.expectOne(`${environment.baseUrl}${environment.adminEndpoint}${environment.usersEndpoint}/1`);
    expect(call1.request.method).toEqual('DELETE');
    call1.flush(response);
    
  })

  it('should process form data and register new user with POST http request', () => {

    component.updateUserForm.controls['username'].setValue('user_name');
    component.updateUserForm.controls['password'].setValue('password');
    component.updateUserForm.controls['email'].setValue('mock@email.com');
    component.updateUserForm.controls['firstName'].setValue('name_first'); 
    component.updateUserForm.controls['lastName'].setValue('name_last');
    component.updateUserForm.controls['dateOfBirth'].setValue('2021-08-14');
    component.updateUserForm.controls['role'].setValue('admin');

    component.saveUser();

    const response = new HttpResponse({
      body:{},
      status: 200,
      statusText: 'OK'
    });

    const call = cardService.expectOne(`${environment.baseUrl}${environment.usersEndpoint}`);
    expect(call.request.method).toEqual('POST');
    call.flush(response);

  });

  it('should process form data and update existing user with PUT http request', async () => {

    component.updateUserForm.controls['username'].setValue('user_name');
    component.updateUserForm.controls['userId'].setValue('234568-890145');
    component.updateUserForm.controls['password'].setValue('password');
    component.updateUserForm.controls['email'].setValue('mock@email.com');
    component.updateUserForm.controls['firstName'].setValue('name_first'); 
    component.updateUserForm.controls['lastName'].setValue('name_last');
    component.updateUserForm.controls['dateOfBirth'].setValue('2021-08-14');
    component.updateUserForm.controls['role'].setValue('admin');

    component.saveUser();

    const response = new HttpResponse({
      body:{},
      status: 200,
      statusText: 'OK'
    });

    const call = cardService.expectOne(`${environment.baseUrl}${environment.adminEndpoint}${environment.usersEndpoint}/234568-890145`);
    expect(call.request.method).toEqual('PUT');
    call.flush(response);

  });
});

