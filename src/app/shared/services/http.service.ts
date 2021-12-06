import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {LoanType} from '../models/loanType.model';
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

/**
 * the custom http service has methids built specifically for the unique requests each service may be expecting
 */
export class HttpService {

  private newId: any = '';

  constructor(private http: HttpClient) { }

  /**
   * the getHeaders method returns properly packaged headers for http requests
   * 
   * @returns The http headers
   */
  getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      })
    };
  }

  /**
   * The login method sends the orioerly packaged login request
   * 
   * @param email The email to send
   * @param password The password to send 
   * 
   * @returns The server response to the login request
   */
  login(email: string, password: string): Observable<HttpResponse<any>> {
    const url: string = `${environment.baseUrl}${environment.authEndpoint}`

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'LR-Type': 'admin'
    });

    console.log(url);

    return this.http.post(
      url,
      {
        email,
        password
      },
      {
        observe: "response",
        headers: headers
      });
  }

  /**
   * The creditCheck method sends all the information necessary to perform a credit check when applying for a loan.
   * 
   * @param url The credit check url to use
   * @param body the LoanType to run sa credit check for
   * 
   * @returns The server response from the credit check request 
   */
  creditCheck(url: string, body: LoanType) {
    return this.http.post(url, body, this.getHeaders());
  }

  /**
   * The getAll method is used for all requests that retrieve a list for a table
   * 
   * @param url The url to get all from
   * 
   * @returns The server response from the getAll request
   */
  getAll(url: string) {
    return this.http.get(url, this.getHeaders());
  }

  /**
   * The getById method gets an individual entity by its unique UUID id
   * 
   * @param url the url to get one from
   * 
   * @returns The server response from the getById request
   */
  getById(url: string) {
    return this.http.get(url, this.getHeaders());
  }

  /**
   * The getNewUUID method isa used when requesting a new entity to make. The front end requestsd the server create and save an empty entity
   * for it to work on and eventually save to the database 
   * 
   * @param url The url to get a new entity from
   * @param id The id for requesting something that exists. Optional
   * 
   * @returns The server response from the getNewUUID request
   */
  async getNewUUID(url: string, id?: string): Promise<any> {
    console.log('inbound url: ', url)
    if (id) {
    await this.http.post(url, id, this.getHeaders()).toPromise().then(
      (res) => {
        let uuid: any;
        uuid = res;
        this.newId = uuid;
      }, err => {
        alert(err);
      }

    );
    }
    else {
      await this.http.get(url, this.getHeaders()).toPromise().then(
        (res) => {
          let uuid: any;
          uuid = res;
          this.newId = uuid;
        }, err => {
          alert(err);
        }

      );
    }
    console.log('newId: ', this.newId)
    return this.newId;
  }

/**
 * The deleteById method sends a delete request for an individual entity
 * 
 * @param url Tye url to delete by
 * 
 * @returns the server response from the deleteById request
 */
  deleteById(url: string) {
    return this.http.delete(url, this.getHeaders());
  }

  /**
   * The create method semds a new entity to the database to save.
   * 
   * @param url The url to send a create request to
   * @param obj The entity to create
   * 
   * @returns the server response from the create request
   */
  create(url: string, obj: any) {
    console.log('create called')
    return this.http.post(url, obj, this.getHeaders());
  }

  /**
   * The update method sends an update request for an individual entity
   * 
   * @param url The url to send the update request to
   * @param obj The entity to update
   * 
   * @returns the server response from the update request 
   */
  update(url: string, obj: any) {
    console.log('update called')
    console.log('update object: ', obj)
    return this.http.put(url, obj, this.getHeaders());
  }

}
