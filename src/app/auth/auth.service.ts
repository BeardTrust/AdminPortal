import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthService {
  isLoggedIn: boolean;

  url: string = 'http://localhost:9001/users/login';
  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'LR-Type': 'admin'
  });

  constructor(private http: HttpClient, private router: Router) {
    this.isLoggedIn = false;
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
    console.log("Logged In: " + this.isLoggedIn)
    console.log(this.headers.get('Authorization'));
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
