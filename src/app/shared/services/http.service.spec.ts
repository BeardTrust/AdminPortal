import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpService } from './http.service';

describe('HttpService', () => {

  let service: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpService]
    });
    service = TestBed.inject(HttpService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('formats correctly', () => {

    let calledWithQuery: any;

    let http = { get: (query: any, _headers: any) => { calledWithQuery = query; } };
    var srv = new HttpService(<any>http);

    srv.getUsers(0, 50, "lastName", true, "some search");
    expect(calledWithQuery).toBe(`http://localhost:9001/admin/users?page=0&size=50&sort=lastName&asc=true&search=some%20search`);

    srv.getUsers(0, 50);
    expect(calledWithQuery).toBe(`http://localhost:9001/admin/users?page=0&size=50`);
  });
});
