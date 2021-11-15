import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class AuthService {
  isLoggedIn: boolean;

  url: string = `${environment.baseUrl}${environment.authEndpoint}`

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'LR-Type': 'admin'
  });

  constructor(private http: HttpClient) {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  login(email: string, password: string) {
    console.log(this.url);
    let result = this.http.post(
      this.url,
      {
        email,
        password
      },
      {
        observe: "response",
        headers: this.headers
      });
    this.setLoginStatus(true);
    return result;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.setLoginStatus(false);
  }

  public getLoginStatus() {
    return this.isLoggedIn;
  }

  public setLoginStatus(status: boolean) {
    this.isLoggedIn = status;
  }
}

