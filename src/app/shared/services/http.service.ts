import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {LoanType} from '../models/loanType.model';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private newId: any = '';

  constructor(private http: HttpClient) { }

  getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      })
    };
  }

  creditCheck(url: string, body: LoanType) {
    return this.http.post(url, body, this.getHeaders());
  }

  getAll(url: string) {
    return this.http.get(url, this.getHeaders());
  }

  getById(url: string) {
    return this.http.get(url, this.getHeaders());
  }

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

  getAccounts(page: number, size: number, sort?: string, dir?: string, search?: string) {
    let query = `http://localhost:9001/accounts/all?pageNum=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(size)}`;
    if (sort === undefined && dir === undefined) {
      sort = "id"; dir = "asc";
    }
    if (search === undefined) {
      search = "";
    }
    if (sort !== undefined && dir !== undefined) {
      query += `&sortName=${encodeURIComponent(sort)}&sortDir=${encodeURIComponent(dir)}`;
    }
    if (search !== '') {
      query += `&search=${encodeURIComponent(search)}`;
    }
    console.log('Outbound Query: ', query);
    return this.http.get(query, this.getHeaders() );
  }

  getLoans(page: number, size: number, sort?: string, dir?: string, search?: string) {
    let query = `http://localhost:9001/loans?pageNum=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(size)}`;
    if (sort === undefined && dir === undefined) {
      sort = "id"; dir = "asc";
    }
    if (search === undefined) {
      search = "";
    }
    if (sort !== undefined && dir !== undefined) {
      query += `&sortName=${encodeURIComponent(sort)}&sortDir=${encodeURIComponent(dir)}`;
    }
    if (search !== '') {
      query += `&search=${encodeURIComponent(search)}`;
    }
    console.log('Outbound Query: ', query);
    return this.http.get(query, this.getHeaders() );
  }

  getUsers(page: number, size: number, sort?: string, asc?: boolean, search?: string) {
    let query = `http://localhost:9001/admin/users?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`;
    if (sort !== undefined) {
      query += `&sort=${encodeURIComponent(sort)}&asc=${encodeURIComponent(!!asc)}`;
    }
    if (search !== undefined) {
      query += `&search=${encodeURIComponent(search)}`;
    }
    return this.http.get(query, this.getHeaders() );
  }

  deleteById(url: string) {
    return this.http.delete(url, this.getHeaders());
  }

  create(url: string, obj: any) {
    console.log('create called')
    return this.http.post(url, obj, this.getHeaders());
  }

  update(url: string, obj: any) {
    console.log('update called')
    console.log('update object: ', obj)
    return this.http.put(url, obj, this.getHeaders());
  }

}
