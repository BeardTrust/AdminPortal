import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../shared/services/http.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/shared/models/user.model';
import { PageEvent } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
/**
 * The card Component allows admins to view all users, create new ones, delete existing ones, and update them.
 * It uses user.component.html to display everything and user.component.css for styling
 */
export class UserComponent implements OnInit {

  users: User[] = new Array();
  sortBy: string[] = [];
  updateUserForm!: FormGroup;
  modalRef!: NgbModalRef;
  errorMessage: any;
  errorPresent: boolean = false;
  errorCode: number = 0;
  errorText!: any;
  closeResult: any;
  modalHeader!: String;
  createNew!: boolean;
  totalItems: any;
  pageIndex: any;
  pageSize: any;
  width!: number;
  predicate: string = '?page=0&&size=5';
  searchCriteria: string = '';
  sortByFirstname: boolean = false;
  firstnameOrder: string = 'desc';
  sortByLastname: boolean = false;
  lastnameOrder: string = 'desc';
  sortByUserId: boolean = false;
  userIdOrder: string = 'desc';
  sortByUsername: boolean = false;
  usernameOrder: string = 'desc';
  sortByEmail: boolean = false;
  emailOrder: string = 'desc';
  sortByPhone: boolean = false;
  phoneOrder: string = 'desc';
  sortByDateOfBirth: boolean = false;
  dateOfBirthOrder: string = 'desc';
  sortByRole: boolean = false;
  roleOrder: string = 'desc';


  constructor(private httpService: HttpService, private fb: FormBuilder, private modalService: NgbModal) { }

  @Output() searchChange = new EventEmitter<string>();
  @Input() sort!: string;
  @Output() sortChange = new EventEmitter<number>();

  @Input() asc!: boolean;
  @Output() ascChange = new EventEmitter<number>();

  data: {
    status: string,
    content: any[],
    totalElements: number,
    totalPages: number
  } = { status: "notYetPending", content: [], totalElements: 0, totalPages: 0 };

  ngOnInit(): void {
    this.width = window.innerWidth;
    this.totalItems = 0;
    this.pageIndex = 0;
    this.pageSize = 5;
    this.loadUsers();
    this.initializeForms();
  }

  @HostListener('window:resize', [])
  private onResize() {
    this.width = window.innerWidth;
    console.log('resized to: ' + this.width)
  }

  onChangePage(pe: PageEvent) {
    this.pageIndex = pe.pageIndex;
    if (pe.pageSize !== this.pageSize) {
      this.pageIndex = 0;
      this.pageSize = pe.pageSize;
    }

    this.loadUsers();
  }

  /**
   * This function will reset all search and sort information to default, and calls the list again.
   */
  refresh() {
    this.predicate = '?page=0&&size=5';
    this.searchCriteria = '';
    this.sortByUserId = false;
    this.sortByFirstname = false;
    this.sortByLastname = false;
    this.sortByUsername = false;
    this.sortByUserId = false;
    this.sortByEmail = false;
    this.sortByPhone = false;
    this.sortByRole = false;
    this.totalItems = 0;
    this.pageIndex = 0;
    this.pageSize = 5;
    this.loadUsers();
  }

  /**
 * This function adds sorting fields to the sortBy array by enabling them here
 * They will be assembled later in the assembleQueryParams function
 * 
 * @param field The sorting to add
 */
  addToSortBy(field: string) {
    if (field === 'id') {
      this.sortByUserId = true;
      this.userIdOrder = this.userIdOrder === 'desc' ? 'asc' : 'desc';
    } else if (field === 'firstname') {
      this.sortByFirstname = true;
      this.firstnameOrder = this.firstnameOrder === 'desc' ? 'asc' : 'desc';
    } else if (field === 'lastname') {
      this.sortByLastname = true;
      this.lastnameOrder = this.lastnameOrder === 'desc' ? 'asc' : 'desc';
    } else if (field === 'dob') {
      this.sortByDateOfBirth = true;
      this.dateOfBirthOrder = this.dateOfBirthOrder === 'desc' ? 'asc' : 'desc';
    } else if (field === 'phone') {
      this.sortByPhone = true;
      this.phoneOrder = this.phoneOrder === 'desc' ? 'asc' : 'desc';
    } else if (field === 'email') {
      this.sortByEmail = true;
      this.emailOrder = this.emailOrder === 'desc' ? 'asc' : 'desc';
    } else if (field === 'role') {
      this.sortByRole = true;
      this.roleOrder = this.roleOrder === 'desc' ? 'asc' : 'desc';
    } else if (field === 'username') {
      this.sortByUsername = true;
      this.usernameOrder = this.usernameOrder === 'desc' ? 'asc' : 'desc';
    }

    this.updatePage();
  }

  /**
   * This function builds the query aspect of the url predicate out of the enabled fields
   */
  private assembleQueryParams() {
    this.sortBy = [];

    if (this.sortByUserId) {
      this.sortBy.push('userId,' + this.userIdOrder);
    }
    if (this.sortByFirstname) {
      this.sortBy.push('firstName,' + this.firstnameOrder);
    }
    if (this.sortByLastname) {
      this.sortBy.push('lastName,' + this.lastnameOrder);
    }
    if (this.sortByUsername) {
      this.sortBy.push('username,' + this.usernameOrder);
    }
    if (this.sortByDateOfBirth) {
      this.sortBy.push('dateOfBirth,' + this.dateOfBirthOrder);
    }
    if (this.sortByRole) {
      this.sortBy.push('role,' + this.roleOrder);
    }
    if (this.sortByEmail) {
      this.sortBy.push('email,' + this.emailOrder);
    }
    if (this.sortByPhone) {
      this.sortBy.push('phone,' + this.phoneOrder);
    }
  }

  /**
 * This function assembles the url predicate out of the state held pageable information
 */
  private assemblePredicate() {
    this.assembleQueryParams()

    this.predicate = "?page=" + this.pageIndex + "&&size=" + this.pageSize;
    this.predicate += this.sortBy.length > 0 ? '&&sortBy=' + this.sortBy : '';
    this.predicate += this.searchCriteria.length > 0 ? "&&search=" + this.searchCriteria : '';
  }

  /**
   * ngModel is setting the search criteria, so searching just needs to refresh the page withe the updated predicate
   */
  search() {
    this.updatePage();

  }

  /**
   * This function calls all the important functions in the order they are necessary for loading the user list.
   */
  updatePage() {
    this.users = [];
    this.onResize();
    this.assemblePredicate();

    this.loadUsers();
    this.initializeForms();
  }

  /**
   * This is the primary function for loading users from the back end.
   * It will also set any errors it receives and display them under the table
   */
  loadUsers() {
    console.log('outbound predicate: ', this.predicate)
    this.users = [];
    this.data = { status: "pending", content: [], totalElements: 0, totalPages: 0 };
    this.httpService
      .getAll(`${environment.baseUrl}${environment.adminEndpoint}${environment.usersEndpoint}` + this.predicate)
      .subscribe((response) => {
        let arr: any;
        arr = response;
        this.totalItems = arr.totalElements;
        for (let obj of arr.content) {
          let u = new User(obj.username, obj.password, obj.email, obj.phone,
            obj.firstName, obj.lastName, obj.dateOfBirth, obj.role, obj.userId);
          console.log(u);
          this.users.push(u);
        }
        this.data = {
          status: "success",
          content: arr.content,
          totalElements: arr.totalElements,
          totalPages: arr.totalPages
        };
        console.log('data: ', this.data)
        console.log('totalelems: ', arr.totalElements)
      }, (err) => {
        this.errorPresent = true;
        this.errorCode = err.status;
        this.errorText = err.statusText;
        this.errorMessage = err.message;
        if (this.errorPresent) {
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        }
      })
  }
  initializeForms() {
    this.updateUserForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.maxLength(30), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      firstName: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      dateOfBirth: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      role: new FormControl('', [Validators.required])
    })
  }

  /**
   * This function removes a user from the database by sending the id to the back-end
   * 
   * @param id The userId to delete by
   */
  deleteUser(id: String) {
    window.confirm("delete user " + id + "?");
    this.httpService.deleteById(`${environment.baseUrl}${environment.adminEndpoint}${environment.usersEndpoint}` + id).subscribe((result) => {
      console.log(result);
      this.users.length = 0;
      this.loadUsers();
    })
  }

  /**
   * This function saves a new user to the database using information filled out in the modal
   */
  saveUser() {
    window.confirm("save user " + this.updateUserForm.controls['firstName'].value + "?");
    let u = new User(
      this.updateUserForm.controls['username'].value,
      this.updateUserForm.controls['password'].value,
      this.updateUserForm.controls['email'].value,
      this.updateUserForm.controls['phone'].value,
      this.updateUserForm.controls['firstName'].value,
      this.updateUserForm.controls['lastName'].value,
      this.updateUserForm.controls['dateOfBirth'].value,
      this.updateUserForm.controls['role'].value,
      this.updateUserForm.controls['userId'].value);

    let body = u;

    if (this.createNew) {
      console.log("saving...");
      this.httpService.create(`${environment.baseUrl}${environment.usersEndpoint}`, body).subscribe((result) => {
        console.log("save " + result);
        this.users.length = 0;
        this.createNew = false;
        this.loadUsers();
      })
    }
    else {
      console.log("editing...");
      this.httpService.update(`${environment.baseUrl}${environment.adminEndpoint}${environment.usersEndpoint}` + this.updateUserForm.controls['userId'].value, body).subscribe((result) => {
        console.log("updating: " + result);
        this.users.length = 0;
        this.loadUsers();
      })
    }
    this.initializeForms();
    this.loadUsers();
  }

  /**
   * This function opens the userModal for the purposes of making a new user and/or editing an existing one.
   * 
   * @param content The userModal to use
   * @param u The user being made or edited
   */
  async open(content: any, u: User | null) {
    if (u !== null) {
      console.log('user pass: ', u.$password);
      this.createNew = false;
      this.modalHeader = 'Edit User';
      this.updateUserForm = this.fb.group({
        userId: u.$userId,
        username: u.$username,
        password: u.$password,
        email: u.$email,
        phone: u.$phone,
        firstName: u.$firstName,
        lastName: u.$lastName,
        dateOfBirth: u.$dateOfBirth,
        role: u.$role
      });
    }
    else {
      this.modalHeader = 'Add New User';
      const uuid = await this.httpService.getNewUUID(`${environment.baseUrl}${environment.accountsEndpoint}/new`);
      this.createNew = true;
      console.log("createModal True");
      if (this.updateUserForm) {
        console.log("updateuserform");
        this.updateUserForm.reset();
        this.updateUserForm = this.fb.group({
          userId: uuid,
          username: '',
          password: '',
          email: '',
          phone: '',
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          role: ''
        })
      }
    }
    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then(
      (result) => {
        this.errorMessage = '';
      },
      (reason) => {
        this.errorMessage = 'Something went wrong';
      }
    );
  }

  closeModal() {
    this.modalRef.close();
  }
  get username() { return this.updateUserForm.get('username'); }
  get password() { return this.updateUserForm.get('password'); }
  get email() { return this.updateUserForm.get('email'); }
  get phone() { return this.updateUserForm.get('phone'); }
  get firstName() { return this.updateUserForm.get('firstName'); }
  get lastName() { return this.updateUserForm.get('lastName'); }
  get dateOfBirth() { return this.updateUserForm.get('dateOfBirth'); }
  get role() { return this.updateUserForm.get('role'); }
}
