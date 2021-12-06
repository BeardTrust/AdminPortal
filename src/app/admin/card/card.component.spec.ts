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

import { CardComponent } from './card.component';
import { environment } from 'src/environments/environment';

describe('CardComponent', () => {
  let component: CardComponent;
  let cardService: HttpTestingController;
  let fixture: ComponentFixture<CardComponent>;
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
      declarations: [ CardComponent ],
      providers: [HttpService]
    })
    .compileComponents();
  });

  beforeAll(() => {
    cardService = TestBed.inject(HttpTestingController);
    httpService = TestBed.inject(HttpService);
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    const response = new HttpResponse({
      body:{},
      status: 200,
      statusText: 'OK'
    });
    const call = cardService.expectOne(`${environment.baseUrl}${environment.cardsEndpoint}?page=0&&size=5`);
    expect(call.request.method).toEqual('GET');
    call.flush(response);
    //cardService.verify();
  });

  it('should create component and send two http GET requests', () => {
    expect(component).toBeTruthy();

    const response = new HttpResponse({
      body:{},
      status: 200,
      statusText: 'OK'
    });

    //const call = cardService.expectOne(`${environment.baseUrl}${environment.cardsEndpoint}/`);
    const call2 = cardService.expectOne(`${environment.baseUrl}${environment.cardTypesEndpoint}/`);
    //expect(call.request.method).toEqual('GET');
    expect(call2.request.method).toEqual('GET');
    //call.flush(response);
    call2.flush(response);
  });

  it('should make http DELETE request', () => {
    component.deleteCard("1");

    const response = new HttpResponse({
      body:{},
      status: 200,
      statusText: 'OK'
    });

    const call1 = cardService.expectOne(`${environment.baseUrl}${environment.cardsEndpoint}/1`);
    //const call2 = cardService.expectOne(`${environment.baseUrl}${environment.cardsEndpoint}/`);
    expect(call1.request.method).toEqual('DELETE');
    //expect(call2.request.method).toEqual('GET');
    call1.flush(response);
    //call2.flush(response);
    
  })

  it('should process form data and update existing card with PUT http request', async () => {
    //const cardFormGroup = fixture.debugElement.nativeElement.querySelector('#cardForm');

    component.cardForm.controls['cardId'].setValue('12389-0456');
    component.cardForm.controls['userId'].setValue('234568-890145');
    component.cardForm.controls['cardType'].setValue('credit');
    component.cardForm.controls['balance'].setValue('0');
    component.cardForm.controls['cardNumber'].setValue('4564908734561245'); 
    component.cardForm.controls['interestRate'].setValue('0');
    component.cardForm.controls['createDate'].setValue('2021-08-14');
    component.cardForm.controls['nickname'].setValue('card_nickname');
    component.cardForm.controls['billCycleLength'].setValue('30');
    component.cardForm.controls['expireDate'].setValue('2025-08-14');

    component.saveCard();

    const response = new HttpResponse({
      body:{},
      status: 200,
      statusText: 'OK'
    });

    const call = cardService.expectOne(`${environment.baseUrl}${environment.cardsEndpoint}/`);
    expect(call.request.method).toEqual('PUT');
    call.flush(response);

  });

  it('should process form data and register new card with POST http request', () => {

    component.cardForm.controls['userId'].setValue('234568-890145');
    component.cardForm.controls['cardType'].setValue('credit');
    component.cardForm.controls['balance'].setValue('0');
    component.cardForm.controls['cardNumber'].setValue('4564908734561245'); 
    component.cardForm.controls['interestRate'].setValue('0');
    component.cardForm.controls['createDate'].setValue('2021-08-14');
    component.cardForm.controls['nickname'].setValue('card_nickname');
    component.cardForm.controls['billCycleLength'].setValue('30');
    component.cardForm.controls['expireDate'].setValue('2025-08-14');

    component.saveCard();

    const response = new HttpResponse({
      body:{},
      status: 200,
      statusText: 'OK'
    });

    const call = cardService.expectOne(`${environment.baseUrl}${environment.cardsEndpoint}/register/234568-890145`);
    expect(call.request.method).toEqual('POST');
    call.flush(response);

  });
});
