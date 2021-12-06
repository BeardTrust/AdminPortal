import {Injectable} from '@angular/core';
import {HttpService} from "@services/http.service";

@Injectable({providedIn: 'root'})

/**
 * The auth service manages login and logout processing and token storage
 */
export class AuthService {
  isLoggedIn: boolean;

  constructor(private httpService: HttpService) {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  login(email: string, password: string) {
    const results = this.httpService.login(email, password);

    this.setLoginStatus(true);

    return results;
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

