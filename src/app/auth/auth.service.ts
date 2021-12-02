import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class AuthService {
  isLoggedIn: boolean;

  url: string = environment.baseUrl + environment.authEndpoint;

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'LR-Type': 'admin'
  });

  constructor(private http: HttpClient, private router: Router) {
    if(localStorage.getItem('token')){
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
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

