import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { asapScheduler, of, scheduled } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';

import { includesCaseInsensitive, ViewUsersComponent } from './view-users.component';

describe('ViewUsersComponent', () => {

  let mockService;

  let component: ViewUsersComponent;
  let fixture: ComponentFixture<ViewUsersComponent>;

  beforeEach(async () => {

    mockService = jasmine.createSpyObj(['getUsers']);
    mockService.getUsers.and.returnValue(of([
      {
        "firstName": "Krombopulos",
        "lastName": "Michael"
      },
      {
        "firstName": "Shadow",
        "lastName": "Mere"
      }
    ]));

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

  it('filteredUsers does not return undefined on elements not yet loaded', () => {
    component.sortData.elements = undefined; //simulate elements not yet loaded
    expect(component.filteredUsers()).toEqual([]);
  });

  it('filter works', () => {
    component.search = "k";
    expect(component.filteredUsers()).toEqual([{
      "firstName": "Krombopulos",
      "lastName": "Michael"
    }]);
  });
});
