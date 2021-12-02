import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../shared/services/http.service';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoanComponent } from './loans.component';
import { of } from 'rxjs';
import { Loan } from '../../shared/models/loan.model';
import { User } from '../../shared/models/user.model';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CurrencyValue } from '../../shared/models/currencyvalue.model';
import { LoanType } from '../../shared/models/loanType.model';
import { environment } from 'src/environments/environment';

describe('LoansComponent', () => {
  let component: LoanComponent;
  let loanService: HttpTestingController;
  let fixture: ComponentFixture<LoanComponent>;
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
          declarations: [ LoanComponent ],
          providers: [HttpService]
        })
        .compileComponents();
      });
    beforeAll(() => {
    loanService = TestBed.inject(HttpTestingController);
    httpService = TestBed.inject(HttpService);
    fixture = TestBed.createComponent(LoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

    afterEach(() => {
    const response = new HttpResponse({
      body:{},
      status: 200,
      statusText: 'OK'
    });
    const call = loanService.expectOne(`${environment.baseUrl}${environment.loansEndpoint}?pageNum=0&pageSize=5&sortName=id&sortDir=asc&search=`);
    expect(call.request.method).toEqual('GET');
    call.flush(response);
    loanService.verify();
  });

  it('should create component and send one http GET request', () => {
    expect(component).toBeTruthy();

    const response = new HttpResponse({
      body:{},
      status: 200,
      statusText: 'OK'
    });
    //const call = cardService.expectOne(`${environment.baseUrl}${environment.cardsEndpoint}/`);
    // const call2 = loanService.expectOne(`${environment.baseUrl}${environment.loansEndpoint}?pageNum=0&pageSize=5&sortName=id&sortDir=asc&search=`);
    //expect(call.request.method).toEqual('GET');
    // expect(call2.request.method).toEqual('GET');
    //call.flush(response);
    // call2.flush(response);
  });

  it('should process form data and register new loan with POST http request', () => {

    component.updateLoanForm.controls['userId'].setValue('234568-890145');
    component.updateLoanForm.controls['typeName'].setValue('Auto');
    component.updateLoanForm.controls['apr'].setValue('0');
    component.updateLoanForm.controls['dollars'].setValue('1000'); 
    component.updateLoanForm.controls['cents'].setValue('0');
    component.updateLoanForm.controls['negative'].setValue(false)
    component.updateLoanForm.controls['numMonths'].setValue('24');
    component.updateLoanForm.controls['createDate'].setValue('2021-10-20');
    component.updateLoanForm.controls['nextDueDate'].setValue('2021-11-20');
    component.updateLoanForm.controls['previousDueDate'].setValue('2021-9-20');

    component.saveLoan();

    const response = new HttpResponse({
      body:{},
      status: 200,
      statusText: 'OK'
    });

    const call1 = loanService.expectOne(`${environment.baseUrl}${environment.loansEndpoint}/new`);
    expect(call1.request.method).toEqual('GET');

    const call2 = loanService.expectOne(`${environment.baseUrl}${environment.loansEndpoint}`);
    expect(call2.request.method).toEqual('POST');
  });

});