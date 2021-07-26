import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';

import { ViewUsersComponent } from './view-users.component';

describe('ViewUsersComponent', () => {

  let mockService: any;

  let component: ViewUsersComponent;
  let fixture: ComponentFixture<ViewUsersComponent>;

  beforeEach(async () => {

    mockService = jasmine.createSpyObj(['getUsers']);
    mockService.getUsers.and.returnValue(of({
      "pageNumber": 0,
      "totalPages": 1,
      "content": [
        {
          "userId": "5a29b83c-03f8-4957-91aa-6e28e0494c73",
          "username": "co",
          "password": null,
          "email": "c@ss.com",
          "phone": "4321",
          "firstName": "c",
          "lastName": "o",
          "dateOfBirth": "2000-01-01",
          "role": "user"
        },
        {
          "userId": "01aa631b-f324-43c1-966b-6cbd57aaa4a0",
          "username": "co2",
          "password": null,
          "email": "c2@ss.com",
          "phone": "43212",
          "firstName": "c2",
          "lastName": "o5",
          "dateOfBirth": "2000-01-02",
          "role": "user"
        }
      ],
      "totalElements": 2
    }));

    await TestBed.configureTestingModule({
      declarations: [ViewUsersComponent],
      providers: [{ provide: HttpService, useValue: mockService }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('retrieves data', () => {
    expect(component.data).toEqual({
      status: "success",
      content: [
        {
          "userId": "5a29b83c-03f8-4957-91aa-6e28e0494c73",
          "username": "co",
          "password": null,
          "email": "c@ss.com",
          "phone": "4321",
          "firstName": "c",
          "lastName": "o",
          "dateOfBirth": "2000-01-01",
          "role": "user"
        },
        {
          "userId": "01aa631b-f324-43c1-966b-6cbd57aaa4a0",
          "username": "co2",
          "password": null,
          "email": "c2@ss.com",
          "phone": "43212",
          "firstName": "c2",
          "lastName": "o5",
          "dateOfBirth": "2000-01-02",
          "role": "user"
        }
      ],
      totalElements: 2,
      totalPages: 1
    });
  });

  it('handles errors', () => {
    mockService.getUsers.and.returnValue(throwError(() => "some error"));
    component.update();
    expect(component.data.status).toBe("error");
  });

  it('makes a new request when setPage, setResultsPerPage, setSort, or setSearch is called', () => {
    component.setPage(0);
    expect(mockService.getUsers).toHaveBeenCalledTimes(2);
    component.setResultsPerPage(50);
    expect(mockService.getUsers).toHaveBeenCalledTimes(3);
    component.setSort("lastName");
    expect(mockService.getUsers).toHaveBeenCalledTimes(4);
    component.setSearch("some search");
    expect(mockService.getUsers).toHaveBeenCalledTimes(5);
  });

  it('sorts ascending and descending', () => {
    component.setSort("lastName");
    expect(component.asc).toBe(true);
    component.setSort("lastName");
    expect(component.asc).toBe(false);
  });
});
