import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AuthComponent} from './auth.component';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {AuthService} from "@services/auth.service";
import {FormsModule} from "@angular/forms";
import objectContaining = jasmine.objectContaining;
import {HttpHeaders, HttpResponse} from "@angular/common/http";

describe('AuthComponent', () => {
  let authService: AuthService;
  let userService: HttpTestingController;
  let router: RouterTestingModule;
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [AuthComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(RouterTestingModule);
    userService = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should place http request and receive http response', async () => {
    authService.login("test@test.com", "test")
      .subscribe((response) => {
        expect(response).toBeTruthy();
      });

    const responseHeaders = new HttpHeaders({'Authorization': 'Bearer winnie.or.yogi', 'BTUID': 'abc-123-xyz-789'});

    const response = new HttpResponse({
      body:{},
      headers: responseHeaders,
      status: 200,
      statusText: 'OK'
    });

    const call = userService.expectOne('http://localhost:9001/users/login');
    expect(call.request.method).toEqual('POST');
    call.flush(response);

    userService.verify();
  })

  it('should process email and password form data and clear form upon submission', async () => {
    const loginFormGroup = fixture.debugElement.nativeElement.querySelector('#authForm');

    loginFormGroup.email.value = 'test@test.com';
    loginFormGroup.password.value = 'test';
    expect(loginFormGroup.email.value).toEqual('test@test.com');
    expect(loginFormGroup.password.value).toEqual('test');

    await component.onSubmit(loginFormGroup);

    expect(loginFormGroup.email.value).toEqual('');
    expect(loginFormGroup.password.value).toEqual('');
  });

  it('should remove token and userId from local storage when logging out', () =>{
    authService.isLoggedIn = true;
    expect(authService.isLoggedIn).toEqual(true);
    localStorage.setItem('token', 'Bearer winnie.or.yogi');
    expect(localStorage.getItem('token')).toEqual('Bearer winnie.or.yogi');
    localStorage.setItem('userId', 'abc-123-xyz-789');
    expect(localStorage.getItem('userId')).toEqual('abc-123-xyz-789');

    authService.logout();
    expect(localStorage.getItem('token')).not.toEqual('Bearer winnie.or.yogi');
    expect(localStorage.getItem('userId')).not.toEqual('abc-123-xyz-789');
    expect(authService.isLoggedIn).toEqual(false);
  });
});
