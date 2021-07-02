import { ElementSchemaRegistry } from '@angular/compiler';
import { OnInit, Component, Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { SortableData } from 'src/app/directives/sort/sort.directive';
import { HttpService } from '../../shared/services/http.service';

function includesCaseInsensitive(a: string, b: string): boolean {
  return a.toLowerCase().includes(b.toLowerCase());
}

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {

  @Input() search!: string;
  @Output() searchChange = new EventEmitter<string>();

  sortData: SortableData = {
    elements: undefined,
    sortProperty: undefined,
    sortOrder: undefined
  };

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.httpService.getUsers().subscribe((res) => {
      this.sortData.elements = <[]>res;
    })
  }

  filteredUsers(): any[] {
    if (!this.sortData.elements) {
      return [];
    } else if (!this.search) {
      return this.sortData.elements;
    } else {
      return this.sortData.elements.filter(e => includesCaseInsensitive(e.lastName, this.search) || includesCaseInsensitive(e.firstName, this.search));
    }
  }

  usersNotYetLoaded(): boolean {
    return this.sortData.elements === undefined;
  }
}

