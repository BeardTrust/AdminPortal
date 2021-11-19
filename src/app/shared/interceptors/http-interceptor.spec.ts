import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {HTTP_INTERCEPTORS, HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {JwtInterceptor} from "./http-interceptor";
import {environment} from "../../../environments/environment";

describe(`HttpInterceptor`, () => {
  let httpMock: HttpTestingController;
  let client: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientTestingModule],
      providers: [
        {provide: Router, useClass: RouterTestingModule},
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true,
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    client = TestBed.inject(HttpClient);
  });

  it('should attach the authorization header', () => {
    localStorage.setItem('token', 'Bearer ABC.123.XYZ')
    client.get(`${environment.baseUrl}${environment.authEndpoint}`).subscribe();

    const request = httpMock.expectOne(`${environment.baseUrl}${environment.authEndpoint}`);

    expect(request.request.headers.get('Authorization')).toBe(localStorage.getItem('token'));
  });
});
