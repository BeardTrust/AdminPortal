import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class HttpInterceptorService implements HttpInterceptor {
  private readonly token: string | null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const interceptedRequest = req.clone({
      setHeaders: {
        Authorization: `${this.token}`
      }
    });

    return next.handle(interceptedRequest);
  }
}
