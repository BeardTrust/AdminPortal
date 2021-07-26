import { OnInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpService } from '../../shared/services/http.service';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {

  @Input() search!: string;
  @Output() searchChange = new EventEmitter<string>();

  @Input() pageNumber: number = 0;
  @Output() pageNumberChange = new EventEmitter<number>();

  @Input() resultsPerPage: number = 50;
  @Output() resultsPerPageChange = new EventEmitter<number>();

  @Input() sort!: string;
  @Output() sortChange = new EventEmitter<number>();

  @Input() asc!: boolean;
  @Output() ascChange = new EventEmitter<number>();

  subscription?: Subscription;

  data: {
    status: "notYetPending" | "pending" | "success" | "error",
    content: any[],
    totalElements: number,
    totalPages: number
  } = { status: "notYetPending", content: [], totalElements: 0, totalPages: 0 };

  fields = [
    { name: "firstName", displayName: "First Name", class: "col-2"},
    { name: "lastName", displayName: "Last Name", class: "col-2"},
    { name: "username", displayName: "Username", class: "col-2"},
    { name: "email", displayName: "Email", class: "col-3"},
    { name: "phone", displayName: "Phone", class: "col-3"}
  ];

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.update();
  }

  setPage(pageNumber: number){
    this.pageNumber = pageNumber;
    this.update();
  }

  setResultsPerPage(resultsPerPage: number){
    this.pageNumber = 0;
    this.resultsPerPage = resultsPerPage;
    this.update();
  }

  setSort(property: string){
    if (this.asc && this.sort === property) {
      this.asc = false;
    } else {
      this.sort = property;
      this.asc = true;
    }
    this.update();
  }

  setSearch(search: string){
    this.search = search;
    this.update();
  }

  update(){
    this.data = { status: "pending", content: [], totalElements: 0, totalPages: 0 };
    this.subscription?.unsubscribe();
    this.subscription = this.httpService.getUsers(this.pageNumber, this.resultsPerPage, this.sort, this.asc, this.search).subscribe((res) => {
      this.data = {
        status: "success",
        content: (<any>res).content,
        totalElements: (<any>res).totalElements,
        totalPages: (<any>res).totalPages
      };
    }, (err) => {
      console.error("Failed to retrieve users", err);
      this.data = { status: "error", content: [], totalElements: 0, totalPages: 0 };
    })
  }
}