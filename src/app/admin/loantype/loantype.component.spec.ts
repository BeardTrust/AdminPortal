import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { HttpService } from '../../shared/services/http.service';

import { LoantypeComponent } from './loantype.component';

describe('LoantypeComponent', () => {
  let component: LoantypeComponent;
  let loanTypeService: HttpTestingController;
  let fixture: ComponentFixture<LoantypeComponent>;
  let httpService: HttpService;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      imports: [         
        FormsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
        NoopAnimationsModule ],
        declarations: [LoantypeComponent],
        providers: [HttpService]
    })
    .compileComponents();
  });

  beforeAll(() => {
    loanTypeService = TestBed.inject(HttpTestingController);
    httpService = TestBed.inject(HttpService);
    fixture = TestBed.createComponent(LoantypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    const response = new HttpResponse({
      body:{},
      status: 200,
      statusText: 'OK'
    });
    const call = loanTypeService.expectOne(`${environment.baseUrl}${environment.loanTypesEndpoint}?page=0&&size=5`);
    expect(call.request.method).toEqual('GET');
    call.flush(response);
    //cardService.verify();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();

  });

  it('should make http POST request', () => {
    component.createNew = true;

    component.loanTypeForm.controls['typeName'].setValue('auto');
    component.loanTypeForm.controls['description'].setValue('a description of an auto loan');
    component.loanTypeForm.controls['apr'].setValue('18.99');
    component.loanTypeForm.controls['numMonths'].setValue('48');

    component.saveLoanType();

    const response = new HttpResponse({
      body:{},
      status: 200,
      statusText: 'OK'
    });

    const call = loanTypeService.expectOne(`${environment.baseUrl}${environment.loanTypesEndpoint}`);
    expect(call.request.method).toEqual('POST');
    call.flush(response);
  })

  it('should make http DELETE request', () => {
    component.deleteLoanType("1");

    const response = new HttpResponse({
      body:{},
      status: 200,
      statusText: 'OK'
    });

    const call1 = loanTypeService.expectOne(`${environment.baseUrl}${environment.loanTypesEndpoint}/1`);
    expect(call1.request.method).toEqual('DELETE');
    call1.flush(response);
    
  })

  it('should make http PUT request', () => {
    component.createNew = false;

    component.loanTypeForm.controls['id'].setValue('1234-ajuh-7h8j-12kl');
    component.loanTypeForm.controls['typeName'].setValue('auto');
    component.loanTypeForm.controls['description'].setValue('a description of an auto loan');
    component.loanTypeForm.controls['apr'].setValue('18.99');
    component.loanTypeForm.controls['numMonths'].setValue('48');

    component.saveLoanType();

    const response = new HttpResponse({
      body:{},
      status: 200,
      statusText: 'OK'
    });

    const call = loanTypeService.expectOne(`${environment.baseUrl}${environment.loanTypesEndpoint}`);
    expect(call.request.method).toEqual('PUT');
    call.flush(response);
  })
});
