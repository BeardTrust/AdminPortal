import { Component, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { HttpService } from "src/app/shared/services/http.service";
import { Account } from "src/app/shared/models/account.model";
import { User } from "src/app/shared/models/user.model";
import { PageEvent } from "@angular/material/paginator";
import { CurrencyValue } from "../../shared/models/currencyvalue.model";
import { AccountType } from "src/app/shared/models/accounttype.model";
import { environment } from "src/environments/environment";


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
  
})
/**
 * The account Component allows admins to view all accounts, create new ones, delete existing ones, and update them.
 * It uses account.component.html to display everything and account.component.css for styling
 */
export class AccountComponent implements OnInit {
  accounts: Account[] = new Array();
  users: User[] = new Array();
  namedAccounts: Account[] = new Array();
  updateAccountForm!: FormGroup;
  activeAccount!: Account;
  activeAccountType!: AccountType;

  modalRef!: NgbModalRef;
  errorMessage: any;
  errorPresent: boolean = false;
  errorCode: number = 0;
  errorText!: any;
  closeResult: any;
  modalHeader!: String;
  totalItems: any;
  pageIndex: any;
  pageSize: any;
  editing!: boolean;
  depositReady: boolean = false;
  width!: number;
  sortByUserId: boolean = false;
  userIdOrder: string = 'desc'
  sortById: boolean = false;
  idOrder: string = 'desc';
  sortByBalance: boolean = false;
  balanceOrder: string = 'desc';
  sortByCreateDate: boolean = false;
  createDateOrder: string = 'desc';
  sortByNickname: boolean = false;
  nicknameOrder: string = 'desc';
  sortByType: boolean = false;
  typeOrder: string = 'desc';
  sortByIsActive: boolean = false;
  isActiveOrder: string = 'desc';
  sortByInterest: boolean = false;
  interestOrder: string = 'desc';
  predicate: string = '?pageNum=0&&pageSize=5';
  searchCriteria: string = '';
  sortBy: string[] = [];

  @Input() asc!: boolean;
  @Output() ascChange = new EventEmitter<number>();

  @Input() dir!: string;
  @Output() dirChange = new EventEmitter<number>();

  data: {
    status: string,
    content: Account[],
    totalElements: number,
    totalPages: number
  } = { status: "notYetPending", content: [], totalElements: 0, totalPages: 0 };


  constructor(private httpService: HttpService, private fb: FormBuilder, private modalService: NgbModal) { }
  ngOnInit(): void {
    this.width = window.innerWidth;
    this.totalItems = 0;
    this.pageIndex = 0;
    this.pageSize = 5;
    this.update();
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
    this.accounts = new Array();
    this.assemblePredicate();
    this.update();
  }

  /**
   * This function adds sorting fields to the sortBy array by enabling them here
   * They will be assembled later in the assembleQueryParams function
   * 
   * @param field The sorting to add
   */
  addToSortBy(field: string) {
    console.log('add to sort by: ', field)
    if(field === 'Id'){
      this.sortById = true;
      this.idOrder = this.idOrder === 'desc' ? 'asc' : 'desc';
    } else if(field === 'balance') {
      this.sortByBalance = true;
      this.balanceOrder = this.balanceOrder === 'desc' ? 'asc' : 'desc';
    } else if(field === 'createDate'){
      this.sortByCreateDate = true;
      this.createDateOrder = this.createDateOrder === 'desc' ? 'asc' : 'desc';
    } else if(field === 'userId'){
      this.sortByUserId = true;
      this.userIdOrder = this.userIdOrder === 'desc' ? 'asc' : 'desc';
    } else if(field === 'nickname'){
      this.sortByNickname = true;
      this.nicknameOrder = this.nicknameOrder === 'desc' ? 'asc' : 'desc';
    } else if(field === 'interest'){
      this.sortByInterest= true;
      this.interestOrder = this.interestOrder === 'desc' ? 'asc' : 'desc';
    } else if(field === 'type'){
      this.sortByType = true;
      this.typeOrder = this.typeOrder === 'desc' ? 'asc' : 'desc';
    } else if(field === 'isActive'){
      this.sortByIsActive = true;
      this.isActiveOrder = this.isActiveOrder === 'desc' ? 'asc' : 'desc';
    }

    this.updatePage();
  }

   /**
   * This function builds the query aspect of the url predicate out of the enabled fields
   */
  private assembleQueryParams() {
    this.sortBy = [];

    if(this.sortById){
      this.sortBy.push('id,' + this.idOrder);
    }
    if(this.sortByBalance){
      this.sortBy.push('balance_dollars,' + this.balanceOrder);
    }
    if(this.sortByCreateDate){
      this.sortBy.push('createDate,' + this.createDateOrder);
    }
    if(this.sortByUserId){
      this.sortBy.push('user_userId,' + this.userIdOrder);
    }
    if(this.sortByNickname){
      this.sortBy.push('nickname,' + this.nicknameOrder);
    }
    if(this.sortByType){
      this.sortBy.push('type_name,' + this.typeOrder);
    }
    if(this.sortByIsActive){
      this.sortBy.push('activeStatus,' + this.isActiveOrder);
    }
    if(this.sortByInterest){
      this.sortBy.push('interest,' + this.interestOrder);
    }
  }

  private assemblePredicate(){
    this.assembleQueryParams()

    this.predicate = "?pageNum=" + this.pageIndex + "&&pageSize=" + this.pageSize;
    this.predicate += this.sortBy.length > 0 ? '&&sortBy=' + this.sortBy : '';
    this.predicate += this.searchCriteria.length > 0 ? "&&search=" + this.searchCriteria : '';
  }

  setSearch(search: string) {
    this.searchCriteria = search;
  }

  /**
   *  This function stores and returns the ints of an account type's title string 
   * for the purposes of database interaction
   * 
   * @param type The title to return the number of
   * 
   * @returns a number 1-9
   */
  getTypeId(type: string): number {
    switch (type) {
      case 'SuperSaver':
        return 1;
      case 'CoolCash':
        return 2;
      case 'Recovery':
        return 4;
      case 'Teller':
        return 3;
      case 'ATM':
        return 7;
      case 'Third Party':
        return 8;
        default:
          return 9
    }
    // return Math.random().toString(16).substr(2, 8) + '-' + Math.random().toString(16).substr(2, 8) + '-' + Math.random().toString(16).substr(2, 8) + '-' + Math.random().toString(16).substr(2, 8)
  }

  /**
   * This function requests a new account from the back-end for it to build off of when creating a new one.
   */
  async requestAccount() {
    if (this.updateAccountForm.controls['userId'].value &&
    this.updateAccountForm.controls['interest'].value &&
    this.updateAccountForm.controls['createDate'].value &&
    this.updateAccountForm.controls['type'].value) {
      let today = new Date();
      let expire = today.getDate() + 3000
      console.log('expire date: ', expire)
      var at = new AccountType(
        this.getTypeId(this.updateAccountForm.value.type),
        this.updateAccountForm.value.type,
        this.updateAccountForm.value.description,
        true,
        today,
        new Date(expire),
        this.updateAccountForm.value.nickname)
      this.depositReady = true;
      const a = await this.httpService.getNewUUID(`${environment.baseUrl}${environment.accountsEndpoint}/new`, this.updateAccountForm.controls['userId'].value)
      console.log('account received: ', a)
      this.activeAccount = a;
      console.log('active account: ', this.activeAccount)
      console.log('account form: ', this.updateAccountForm.value)
      this.updateAccountForm.controls['activeStatus'].setValue(true);
      this.activeAccount.interest = this.updateAccountForm.value.interest;
      this.activeAccountType = at;
    } else {
      window.alert('Only the description and Nickname fields may be left blank. Please fill out all other fields before attempting to activate a new account.')
    }
  }

  /**
   * This function will reset all search and sort information to default, and calls the list again.
   */
  refresh() {
    this.searchCriteria = "";
    this.sortByUserId = false;
    this.sortById = false;
    this.sortByIsActive = false;
    this.sortByBalance = false;
    this.sortByCreateDate = false;
    this.sortByInterest = false;
    this.sortByNickname = false;
    this.sortByType = false;
    this.dir = 'asc';
    this.totalItems = 0;
    this.pageIndex = 0;
    this.pageSize = 5;
    this.predicate = '?pageNum=' + this.pageIndex + '&&pageSize=' + this.pageSize;
    this.update();
  }

  /**
   * This is the primary function that retrieves accounts from the back end.
   * It will also set any errors it receives and display them under the table
   */
  update() {
    console.log('outbound pred: ', this.predicate)
    this.accounts = [];
    this.data = { status: "pending", content: [], totalElements: 0, totalPages: 0 };
    this.httpService.getAll(`${environment.baseUrl}${environment.accountsEndpoint}/all` + this.predicate)
      .subscribe((res) => {
        console.log(res);
        let arr: any;
        arr = res;
        this.totalItems = arr.totalElements;
        for (let obj of arr.content) {
          let u = new Account(obj.user, obj.id, obj.activeStatus, CurrencyValue.from(obj.balance),
            obj.createDate, obj.interest, obj.nickname, obj.type);
          this.accounts.push(u);
        }
        this.data = {
          status: "success",
          content: arr.content,
          totalElements: arr.numberOfElements,
          totalPages: arr.totalPages
        };
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
    this.updateAccountForm = new FormGroup({
      user: new FormControl('', [Validators.required, Validators.minLength(32), Validators.maxLength(32), Validators.pattern("/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/")]),
      activeStatus: new FormControl('', [Validators.required]),
      balance: new FormControl('', [Validators.required]),
      createDate: new FormControl('', [Validators.required]),
      interest: new FormControl('', [Validators.required, Validators.maxLength(3)]),
      nickname: new FormControl('', [Validators.maxLength(50)]),
      type: new FormControl('', [Validators.required])
    })
  }

  /**
   * This function sends an account id to the back-end to try and deactivate (not remove) it.
   * 
   * @param id The id of the account to deactivate. 
   */
  deactivateAccount(id: String) {
    if (window.confirm('Are you sure you want to remove: ' + id + '? It will be removed from the database completely.')) {
      this.httpService.deleteById(`${environment.baseUrl}${environment.accountsEndpoint}/` + id).subscribe((result) => {
        console.log(result);
        this.users.length = 0;
      });
      window.location.reload();
    }
  };

  formFilledCheck() {
    if (this.updateAccountForm.controls['userId'].value &&
      this.updateAccountForm.controls['balance'].value &&
      this.updateAccountForm.controls['interest'].value &&
      this.updateAccountForm.controls['createDate'].value &&
      this.updateAccountForm.controls['type'].value) {
      console.log('form is filled');
      return true;
    } else {
      console.log('form isn\'t filled');
      return false;
    }
  }

  /**
   * This function saves a new account to the database
   */
  saveAccount() {
    if (this.formFilledCheck()) {
      console.log('active account: ', this.activeAccount)
      console.log('active account type: ', this.activeAccountType)
      let u = this.activeAccount.user;
      let a = new Account(
        u,
        this.activeAccount.id,
        true,
        CurrencyValue.valueOf(this.updateAccountForm.controls['balance'].value),
        this.activeAccountType.$createDate,
        this.activeAccount.interest,
        this.updateAccountForm.controls['nickname'].value,
        this.activeAccountType);
        a.type.description = this.updateAccountForm.value.description;
      console.log(a)
      const body = a;
      const modelBody = {
        userId: a.user.userId,
        balance: a.$balance,
        createDate: a.$createDate,
        type_id: this.activeAccountType.$id,
        type: {
          id: this.activeAccountType.$id,
          name: this.activeAccountType.name,
          description: this.activeAccountType.description,
          isActive: true,
          createDate: a.$createDate,
          expireDate: this.activeAccountType.$expireDate,
          nickname: a.$nickname
        },
        nickname: a.$nickname,
        interest: a.interest,
        activeStatus: true
      };
      console.log('body created: ', body)

      if (!this.updateAccountForm.controls['nickname'].value) {
        window.confirm('Save Acount ' + this.updateAccountForm.controls['id'].value + '?');
      }
      else {
        window.confirm('Save Acount ' + this.updateAccountForm.controls['nickname'].value + '?');
      }
      if (!this.editing) {
        this.httpService.create(`${environment.baseUrl}${environment.accountsEndpoint}`, modelBody).subscribe((result) => {
          console.log("creating " + result);
          this.accounts.length = 0;
          this.update()
          window.location.reload();
        });
      } else {
        this.httpService.update(`${environment.baseUrl}${environment.accountsEndpoint}`, body).subscribe((result) => {
          console.log("updating " + result);
          this.accounts.length = 0;
          this.update()
          window.location.reload();
        });
      }
    } else {
      console.log('userId: ', this.updateAccountForm.controls['userId'].value)
      console.log('activeStatus: ', this.updateAccountForm.controls['activeStatus'].value)
      console.log('balance: ', this.updateAccountForm.controls['balance'].value)
      console.log('createDate: ', this.updateAccountForm.controls['createDate'].value)
      console.log('nickname: ', this.updateAccountForm.controls['nickname'].value)
      console.log('type: ', this.updateAccountForm.controls['type'].value)
      alert("Only the Nickname and Activity sections may be left blank.")
    }
  }

  /**
   * This function opens the accountModal for the purposes of making a new account and/or editing an existing one.
   * 
   * @param content The accountModal to use
   * @param c The account being made or edited
   */
  async open(content: any, u: Account | null) {
    if (u !== null) {
      this.activeAccount = u;
      this.activeAccountType = u?.$type;
      let bValue = u.$balance.dollars + (u.$balance.cents / 100)
      if (u.$balance.isNegative) {
        bValue *= -1;
      }
      this.editing = true;
      console.log('editing account: ', u)
      this.modalHeader = 'Edit Account';
      this.updateAccountForm = this.fb.group({
        user: u.$user,
        userId: u.$user.userId,
        id: u.$id,
        activeStatus: u.$activeStatus,
        balance: bValue,
        createDate: u.$createDate,
        interest: u.$interest,
        nickname: u.$nickname,
        type: u.$type.name,
        description: u.$type.description
      });
    } else {
      this.editing = false;
      this.modalHeader = 'Add New Account';
      const uuid = await this.httpService.getNewUUID(`${environment.baseUrl}${environment.accountsEndpoint}/new`);
      console.log('rcv\'d: ', uuid);
      this.updateAccountForm = this.fb.group({
        userId: '',
        id: uuid.id,
        activeStatus: '',
        balance: '',
        createDate: new Date().toJSON().slice(0, 10),
        interest: '',
        nickname: '',
        type: '',
        description: ''
      })
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
    this.depositReady = false;
    this.editing = false;
  }

  updatePage(){
    this.accounts = [];

    this.assemblePredicate();

    this.update();
    this.initializeForms();
  }

  get user() { return this.updateAccountForm.get('user'); }
  get userId() { return this.updateAccountForm.get('userId'); }
  get activeStatus() { return this.updateAccountForm.get('activeStatus'); }
  get balance() { return this.updateAccountForm.get('balance'); }
  get createDate() { return this.updateAccountForm.get('createDate'); }
  get interest() { return this.updateAccountForm.get('interest'); }
  get nickname() { return this.updateAccountForm.get('nickname'); }
  get type() { return this.updateAccountForm.get('type'); }
}
