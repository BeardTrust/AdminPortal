import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class HttpService {

  //when admin login is implemented, make this not a constant
  httpHeaders: HttpHeaders = new HttpHeaders({
    Authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1YTI5YjgzYy0wM2Y4LTQ5NTctOTFhYS02ZTI4ZTA0OTRjNzMiLCJleHAiOjE2MjgxODQ2ODB9.isB_8_o2ZIXO6JGLr5gyIYJnbE5Ncik3LC8cpZd-l3dZG7Eni61Ksrj0gMc_vKFLtJ7twqrxNU60dYGltANerQ"
  });

  constructor(private http: HttpClient) { }

  getUsers(page: number, size: number, sort?: string, asc?: boolean, search?: string) {

    let query = `http://localhost:9001/admin/users?page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`;
    if (sort !== undefined) {
      query += `&sort=${encodeURIComponent(sort)}&asc=${encodeURIComponent(!!asc)}`;
    }
    if (search !== undefined) {
      query += `&search=${encodeURIComponent(search)}`;
    }

    return this.http.get(query, { headers: this.httpHeaders });
  }

  uploadCsv(csv: string){
    let query = `https://run.mocky.io/v3/e413c4bc-0668-4ebb-80b7-c5d9964d03d3`;
    return this.http.post(query, csv, { headers: this.httpHeaders });
  }
}