import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../shared/services/http.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/shared/models/user.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  users: User[] = new Array();
  updateUserForm!: FormGroup;
  modalRef!: NgbModalRef;
  errorMessage: any;
  closeResult: any;
  modalHeader!: String;
  createNew!: boolean;
  totalItems: any;
  pageIndex: any;
  pageSize: any;


  constructor(private httpService: HttpService, private fb: FormBuilder, private modalService: NgbModal) { }

  @Input() search!: string;
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

  userField = [
    {name: "firstName", displayName: "First Name", class: "col-2"},
    {name: "lastName", displayName: "Last Name", class: "col-2"},
    {name: "userId", displayName: "User ID", class: "col-2"},
    {name: "username", displayName: "Username", class: "col-2"},
    {name: "email", displayName: "Email", class: "col-2"},
    {name: "phone", displayName: "Phone Number", class: "col-2"},
    {name: "dateOfBirth", displayName: "Date of Birth", class: "col-2"},
    {name: "role", displayName: "Role", class: "col-2"}
  ];

  ngOnInit(): void {
    this.totalItems = 0;
    this.pageIndex = 0;
    this.pageSize = 5;
    this.loadUsers();
    this.initializeForms();
  }

  onChangePage(pe:PageEvent) {
    this.pageIndex = pe.pageIndex;
    if(pe.pageSize !== this.pageSize){
      this.pageIndex = 0;
      this.pageSize = pe.pageSize;
    }

    this.loadUsers();
  }

  setSort(property: string) {
    if (this.asc && this.sort === property) {
      this.asc = false;
      this.loadUsers();
    } else {
        this.sort = property;
        this.asc = true;
        this.loadUsers();
    }
  }

  setSearch(search: string) {
    this.search = search;
  }

  refresh() {
    this.search = "";
    this.sort = 'Id';
    this.asc = true;
    this.totalItems = 0;
    this.pageIndex = 0;
    this.pageSize = 5;
    this.loadUsers();
  }

  loadUsers() {
    this.users = [];
    this.data = { status: "pending", content: [], totalElements: 0, totalPages: 0 };
    this.httpService
    .getUsers(this.pageIndex, this.pageSize, this.sort, this.asc, this.search)
    .subscribe((response) => {
      let arr: any;
      arr = response;
      this.totalItems = arr.totalElements;
      for(let obj of arr.content){
        console.log('in for loop, arr = ', arr)
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
      console.log('data: ', this.data)
      console.log('totalelems: ', arr.totalElements)
    }, (err) => {
      console.error("Failed to retrieve accounts", err);
      this.data = { status: "error", content: [], totalElements: 0, totalPages: 0 };
    })
  }
  initializeForms() {
    this.updateUserForm = new FormGroup({
      username: new FormControl('',[Validators.required, Validators.maxLength(20)]),
      password: new FormControl('',[Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
      email: new FormControl('',[Validators.required, Validators.maxLength(30), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      phone: new FormControl('',[Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      firstName: new FormControl('',[Validators.required, Validators.maxLength(20)]),
      lastName: new FormControl('',[Validators.required, Validators.maxLength(20)]),
      dateOfBirth: new FormControl('',[Validators.required, Validators.maxLength(10)]),
      role: new FormControl('',[Validators.required])
    })
  }

  deleteUser(id: String){
    window.confirm("delete user " + id + "?");
    this.httpService.deleteById('http://localhost:9001/admin/users/' + id).subscribe((result)=>{
      console.log(result);
      this.users.length = 0;
      this.loadUsers();
    })
  }

  saveUser(){
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

    if (this.createNew){
      console.log("saving...");
      this.httpService.create('http://localhost:9001/users', body).subscribe((result)=>{
        console.log("save " + result);
        this.users.length = 0;
        this.createNew = false;
        this.loadUsers();
      })
    }
    else{
      console.log("editing...");
      this.httpService.update('http://localhost:9001/admin/users/' + this.updateUserForm.controls['userId'].value, body).subscribe((result)=>{
        console.log("updating: " + result);
        this.users.length = 0;
        this.loadUsers();
      })
    }
    this.initializeForms();
    //this.loadUsers();
  }

  async open(content: any, u: User | null){
    if (u!== null){
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
    else{
      this.modalHeader = 'Add New User';
      const uuid = await this.httpService.getNewUUID('http://localhost:9001/accounts/new');
      this.createNew = true;
      console.log("createModal True");
      if(this.updateUserForm){
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

  closeModal(){
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
