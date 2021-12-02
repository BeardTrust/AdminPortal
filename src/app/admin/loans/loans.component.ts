import { Component, HostListener, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { HttpService } from "../../shared/services/http.service";
import { Loan } from "../../shared/models/loan.model";
import { User } from "../../shared/models/user.model";
import { PageEvent } from "@angular/material/paginator";
import { CurrencyValue } from "../../shared/models/currencyvalue.model";
import { LoanType } from "../../shared/models/loanType.model";
import { Payment } from "src/app/shared/models/payment.model";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css'],
})
export class LoanComponent implements OnInit {
  loans: Loan[] = new Array();
  users: User[] = new Array();
  persLoanDur: number[] = [1, 2, 3, 4, 5, 6, 12, 24, 36, 48, 60, 72, 80, 92, 104];
  specLoanDur: number[] = [1, 2, 3, 4, 5, 6, 12, 24, 36, 48, 60, 72, 80, 92, 104, 116, 128, 140, 152, 180, 360, 480, 600];
  autoLoanDur: number[] = [36, 48, 60, 72, 80, 84];
  mortLoanDur: number[] = [180, 360, 480, 600];
  autoLoanApr: number[] = [];
  specLoanApr: number[] = [];
  mortLoanApr: number[] = [];
  persLoanApr: number[] = [];
  curLoanApr!: number[];
  curLoanList!: number[];
  loanTypes: LoanType[] = new Array();
  sortBy: string[] = [];
  updateLoanForm!: FormGroup;
  modalRef!: NgbModalRef;
  errorMessage: any;
  closeResult: any;
  modalHeader!: String;
  totalItems: any;
  pageIndex: any;
  pageSize: any;
  editing!: boolean;
  activeLoan!: Loan;
  activeLoanType!: LoanType;
  width!: number;
  sortByUserId: boolean = false;
  userIdOrder: string = 'desc'
  sortById: boolean = false;
  idOrder: string = 'desc';
  sortByBalance: boolean = false;
  balanceOrder: string = 'desc';
  sortByPayment: boolean = false;
  paymentOrder: string = 'desc';
  sortByCreateDate: boolean = false;
  createDateOrder: string = 'desc';
  sortByNextPay: boolean = false;
  nextPayOrder: string = 'desc';
  sortByPrevPay: boolean = false;
  prevPayOrder: string = 'desc';
  sortByType: boolean = false;
  typeOrder: string = 'desc';
  sortByMinMonthFee: boolean = false;
  minMonthFeeOrder: string = 'desc';
  sortByPrincipal: boolean = false;
  principalOrder: string = 'desc';
  sortByLateFee: boolean = false;
  lateFeeOrder: string = 'desc';
  sortByMonthsRemaining: boolean = false;
  monthRemainingOrder: string = 'desc';
  sortByIsPaid: boolean = false;
  isPaidOrder: string = 'desc';
  sortByAPR: boolean = false;
  aprOrder: string = 'desc';
  sortByCurrentDue: boolean = false;
  currentDueOrder: string = 'desc';
  predicate: string = '?pageNum=0&&pageSize=5';
  searchCriteria: string = '';

  data: {
    status: string,
    content: Loan[],
    totalElements: number,
    totalPages: number
  } = { status: "notYetPending", content: [], totalElements: 0, totalPages: 0 };


  constructor(private httpService: HttpService, private fb: FormBuilder, private modalService: NgbModal) { }
  ngOnInit(): void {
    this.width = window.innerWidth;
    console.log('width: ', this.width)
    this.totalItems = 0;
    this.pageIndex = 0;
    this.pageSize = 5;
    this.persLoanApr = this.setAPR(100);
    this.mortLoanApr = this.setAPR(6);
    this.autoLoanApr = this.setAPR(10);
    this.specLoanApr = this.setAPR(50);
    this.update();
    this.initializeForms();
  }

  @HostListener('window:resize', [])
  private onResize() {
    this.width = window.innerWidth;
    console.log('resized to: ' + this.width)
  }

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
    } else if(field === 'createDate'){
      this.sortByCreateDate = true;
      this.createDateOrder = this.createDateOrder === 'desc' ? 'asc' : 'desc';
    } else if(field === 'apr'){
      this.sortByAPR= true;
      this.aprOrder = this.aprOrder === 'desc' ? 'asc' : 'desc';
    } else if(field === 'type'){
      this.sortByType = true;
      this.typeOrder = this.typeOrder === 'desc' ? 'asc' : 'desc';
    } else if(field === 'isActive'){
      this.sortByIsPaid = true;
      this.isPaidOrder = this.isPaidOrder === 'desc' ? 'asc' : 'desc';
    } else if(field === 'isPaid'){
      this.sortByIsPaid = true;
      this.isPaidOrder = this.isPaidOrder === 'desc' ? 'asc' : 'desc';
    } else if(field === 'minMonthFee'){
      this.sortByMinMonthFee = true;
      this.minMonthFeeOrder = this.minMonthFeeOrder === 'desc' ? 'asc' : 'desc';
    } else if(field === 'monthsRemaining'){
      this.sortByMonthsRemaining = true;
      this.monthRemainingOrder = this.monthRemainingOrder === 'desc' ? 'asc' : 'desc';
    } else if(field === 'currentDue'){
      this.sortByCurrentDue = true;
      this.currentDueOrder = this.currentDueOrder === 'desc' ? 'asc' : 'desc';
    } else if(field === 'lateFee'){
      this.sortByLateFee = true;
      this.lateFeeOrder = this.lateFeeOrder === 'desc' ? 'asc' : 'desc';
    } else if(field === 'principal'){
      this.sortByPrincipal = true;
      this.principalOrder = this.principalOrder === 'desc' ? 'asc' : 'desc';
    } else if(field === 'nextDue'){
      this.sortByNextPay = true;
      this.nextPayOrder = this.nextPayOrder === 'desc' ? 'asc' : 'desc';
    } else if(field === 'prevDue'){
      this.sortByPrevPay = true;
      this.prevPayOrder = this.prevPayOrder === 'desc' ? 'asc' : 'desc';
    }

    this.updatePage();
  }

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
    if(this.sortByAPR){
      this.sortBy.push('loanType_apr,' + this.aprOrder);
    }
    if(this.sortByIsPaid){
      this.sortBy.push('payment_hasPaid,' + this.isPaidOrder);
    }
    if(this.sortByPrincipal){
      this.sortBy.push('principal_dollars,' + this.principalOrder);
    }
    if(this.sortByLateFee){
      this.sortBy.push('payment_lateFee_dollars,' + this.lateFeeOrder);
    }
    if(this.sortByCurrentDue){
      this.sortBy.push('payment_minDue_dollars,' + this.currentDueOrder);
    }
    if(this.sortByNextPay){
      this.sortBy.push('payment_nextDueDate,' + this.nextPayOrder);
    }
    if(this.sortByPrevPay){
      this.sortBy.push('payment_previousDueDate,' + this.prevPayOrder);
    }
    if(this.sortByType){
      this.sortBy.push('loanType_typeName,' + this.typeOrder);
    }
    if (this.sortByMonthsRemaining) {
      this.sortBy.push('loanType_numMonths,' + this.monthRemainingOrder)
    }
  }

  private assemblePredicate(){
    this.assembleQueryParams()

    this.predicate = "?pageNum=" + this.pageIndex + "&&pageSize=" + this.pageSize;
    this.predicate += this.sortBy.length > 0 ? '&&sortBy=' + this.sortBy : '';
    this.predicate += this.searchCriteria.length > 0 ? "&&search=" + this.searchCriteria : '';
    console.log('assembled predicate: ' + this.predicate)
  }

  updatePage(){
    this.loans = [];

    this.assemblePredicate();
    this.update();
    this.initializeForms();
  }

  onChangePage(pe: PageEvent) {
    this.pageIndex = pe.pageIndex;
    if (pe.pageSize !== this.pageSize) {
      this.pageIndex = 0;
      this.pageSize = pe.pageSize;
    }
    this.assemblePredicate();
    this.loans = new Array();
    this.update();
  }

  async creditReport() {
    console.log('sending credit report ...')
    var loanType = await this.httpService.getNewUUID(`${environment.baseUrl}${environment.loanTypesEndpoint}/new`);
    loanType.activeStatus = true;
    console.log('apr found: ', this.updateLoanForm)
    loanType.apr = this.updateLoanForm.controls['apr'].value;
    loanType.createDate = this.updateLoanForm.controls['createDate'].value;
    loanType.description = this.updateLoanForm.controls['description'].value;
    loanType.numMonths = this.updateLoanForm.controls['numMonths'].value
    loanType.typeName = this.updateLoanForm.controls['typeName'].value
    this.activeLoanType = loanType;
    var userId = this.updateLoanForm.controls['userId'].value;
    console.log('userId found: ', userId)
    if (!this.updateLoanForm.controls['userId'].invalid && !this.updateLoanForm.controls['typeName'].invalid) {
      console.log('outbound loantype: ', loanType)
      await this.httpService.creditCheck(`${environment.baseUrl}${environment.loansEndpoint}/check/` + userId, this.activeLoanType)
        .subscribe((res) => {
          console.log('loan received: ', res);
          let loan: any;
          loan = res;
          this.activeLoan = loan;
          console.log(loan.balance);
          this.updateLoanForm.controls['balance'].setValue(loan.balance.dollars + (loan.balance.cents / 100));
          this.updateLoanForm.controls['minDue'].setValue(loan.payment.minDue.dollars + (loan.payment.minDue.cents / 100));
          this.updateLoanForm.controls['principal'].setValue(loan.principal.dollars + (loan.principal.cents / 100));
        });
    } else {
      window.alert('Invalid input! Check userId and loan type fields!.')
    }
  }

  setAPR(props: number) {
    var l: number[] = []
    for (var i = 0; i < props; i++) {
      l.push(i + 0.99);
    }
    return l;
  }

  setSearch(search: string) {
    this.searchCriteria = search;
  }

  refresh() {
    this.sortByUserId = false;
    this.sortById = false;
    this.sortByType = false;
    this.sortByAPR = false;
    this.sortByBalance = false;
    this.sortByMinMonthFee = false;
    this.sortByCurrentDue = false;
    this.sortByLateFee = false;
    this.sortByPrincipal = false;
    this.sortByMonthsRemaining = false;
    this.sortByCreateDate = false;
    this.sortByNextPay = false;
    this.sortByPrevPay = false;
    this.sortByIsPaid = false;
    this.totalItems = 0;
    this.pageIndex = 0;
    this.pageSize = 5;
    this.predicate = '?pageNum=' + this.pageIndex + '&&pageSize=' + this.pageSize;
    this.searchCriteria = '';
    this.update();
  }

  update() {
    this.loans = [];
    this.data = { status: "pending", content: [], totalElements: 0, totalPages: 0 };
    this.httpService.getAll(`${environment.baseUrl}${environment.loansEndpoint}` + this.predicate)
      .subscribe((res) => {
        console.log(res);
        let arr: any;
        arr = res;
        this.totalItems = arr.totalElements;
        console.log('found: ', res)
        for (let obj of arr.content) {
          let u = new Loan(obj.createDate, CurrencyValue.from(obj.balance), CurrencyValue.from(obj.principal),
            obj.payment, obj.id, obj.loanType, obj.user);
            console.log(u)
          this.loans.push(u);
        }
        this.data = {
          status: "success",
          content: arr.content,
          totalElements: arr.numberOfElements,
          totalPages: arr.totalPages
        };
      }, (err) => {
        console.error("Failed to retrieve loans", err);
        console.log('error status: ', err.status)
        this.data = { status: "error", content: [], totalElements: 0, totalPages: 0 };
        if (err.status === 503) {
          setTimeout(() => {
            console.log('sleeping...')
            window.alert('[503 ERROR: LOANSERVICE] \nServers did not respond. They may be down, or your connection may be interrupted. Page will refresh until a connedction can be established')
            window.location.reload();
          }, 5000);
        }
      })
  }

  initializeForms() {
    this.updateLoanForm = new FormGroup({
      userId: new FormControl('', [Validators.required, Validators.minLength(32), Validators.maxLength(32), Validators.pattern("/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/")]),
      typeName: new FormControl('', [Validators.required]),
      negative: new FormControl('', [Validators.required]),
      numMonths: new FormControl('', [Validators.required]),
      createDate: new FormControl('', [Validators.required]),
      nextDueDate: new FormControl('', [Validators.required]),
      previousDueDate: new FormControl('', [Validators.required]),
      balance: new FormControl('', [Validators.required]),
      dollars: new FormControl('', [Validators.required]),
      cents: new FormControl('', [Validators.required]),
      minDue: new FormControl('', [Validators.required]),
      lateFee: new FormControl('', [Validators.required]),
      apr: new FormControl('', [Validators.required, Validators.maxLength(3)])
    })
  }

  deleteLoan(id: String) {
    if (window.confirm('Are you sure you want to remove: ' + id + '? It will be removed from the database completely.')) {
      this.httpService.deleteById(`${environment.baseUrl}${environment.loansEndpoint}/` + id).subscribe((result) => {
        console.log(result);
        this.users.length = 0;
      });
      window.location.reload();
    }
  };

  async lateFeeCheck() {
    let body = JSON.parse(JSON.stringify(this.activeLoan));
    const r = await this.httpService.update(`${environment.baseUrl}${environment.loansEndpoint}/late`, body)
    console.log('result: ', r)
    window.alert('Checking for past due fees...')
    window.location.reload();
  }

  formFilledCheck() {
    if (this.updateLoanForm.controls['userId'].value &&
      this.updateLoanForm.controls['typeName'].value &&
      this.updateLoanForm.controls['apr'].value &&
      this.updateLoanForm.controls['balance'].value &&
      this.updateLoanForm.controls['principal'].value &&
      this.updateLoanForm.controls['numMonths'].value &&
      this.updateLoanForm.controls['createDate'].value &&
      this.updateLoanForm.controls['nextDueDate'].value &&
      this.updateLoanForm.controls['previousDueDate'].value) {
      console.log('form is filled');
      return true;
    } else {
      console.log('form isn\'t filled');
      console.log('form found: ',
        '\nuser: ', this.updateLoanForm.controls['userId'].value,
        '\ntypeName: ', this.updateLoanForm.controls['typeName'].value,
        '\napr: ', this.updateLoanForm.controls['apr'].value,
        '\balance: ', this.updateLoanForm.controls['balance'].value,
        '\principal: ', this.updateLoanForm.controls['principal'].value,
        '\nnegative: ', this.updateLoanForm.controls['negative'].value &&
      '\nmonths: ', this.updateLoanForm.controls['numMonths'].value,
        // this.updateLoanForm.controls['description'].value,
        '\ncreate: ', this.updateLoanForm.controls['createDate'].value,
        '\nnext: ', this.updateLoanForm.controls['nextDueDate'].value,
        '\nprevious: ', this.updateLoanForm.controls['previousDueDate'].value)
      return false;
    }
  }

  async saveLoan() {
    if (this.formFilledCheck()) {
      console.log('form filled')
      console.log('loans: ', this.loans)
      console.log('update form: ', this.updateLoanForm.value)
      let loan = this.activeLoan;
      let loanType = loan.$loanType;
      if (!this.editing) {
        console.log('not editing. getting new loan...')
        loan = await this.httpService.getNewUUID(`${environment.baseUrl}${environment.loansEndpoint}/new`, this.updateLoanForm.controls['userId'].value);
        loanType = await this.httpService.getNewUUID(`${environment.baseUrl}${environment.loanTypesEndpoint}/new`);
      }
      console.log('loan body made: ', loan)
      console.log('loantype body made: ', loanType)
      let c = CurrencyValue.valueOf(this.updateLoanForm.controls['balance'].value);
      console.log('balance found: ', c)
      let num = c.getDollars + (c.getCents / 100);
      let c2 = CurrencyValue.valueOf(this.updateLoanForm.controls['principal'].value)
      console.log('principal calculated: ', c2.toString())
      let uuid = loanType.$id
      let t = new LoanType(
        uuid,
        true,
        this.updateLoanForm.controls['createDate'].value,
        this.updateLoanForm.controls['numMonths'].value,
        this.updateLoanForm.controls['description'].value,
        this.updateLoanForm.controls['typeName'].value,
        this.updateLoanForm.controls['apr'].value,
      )
      console.log('form desc: ', this.updateLoanForm.controls['description'].value)
      t.$id = loanType.$id
      console.log('loantype made: ', t)
      uuid = loan.$id
      let u = new Loan(
        this.updateLoanForm.controls['createDate'].value,
        c,
        c2,
        new Payment(
          'Example text',
        new CurrencyValue(false, 0, 0),
        new CurrencyValue(false, 0, 0),
        this.updateLoanForm.controls['nextDueDate'].value,
        this.updateLoanForm.controls['previousDueDate'].value,
        false,
        this.updateLoanForm.controls['minMonthFee'].value
        ),
        uuid,
        t,
        loan.$user);
      const loanBody = u;
      const typeBody = t;
      this.activeLoanType = typeBody;
      console.log('loanBody to send: ', loanBody)
      console.log('typeBody to send: ', typeBody)

      if (!uuid) {
        console.log('Id value found')
        window.confirm('Save ' + typeBody.$typeName + ' Loan?');
      }
      else {
        console.log('no Id found')
        window.confirm('Save Loan ' + uuid + '?')
        window.location.reload();
      }
      if (this.editing) {
        this.httpService.update(`${environment.baseUrl}${environment.loansEndpoint}`, loanBody).subscribe((result) => {
          console.log("updating" + result);
          this.loans.length = 0;
          this.update()
          window.location.reload();
        });
      }
      else {
        this.httpService.create(`${environment.baseUrl}${environment.loanTypesEndpoint}`, this.activeLoanType).subscribe((result) => {
          console.log("creating loantype " + result);
          this.loans.length = 0;
          this.update()
        });
        this.httpService.create(`${environment.baseUrl}${environment.loansEndpoint}`, this.activeLoan).subscribe((result) => {
          console.log("creating loan " + result);
          this.loans.length = 0;
          this.update()
          window.location.reload();
        });
      }
    } else {
      alert("Only the the Description section may be left blank.")
    }
  }

  setType() {
    console.log('set type...')
    switch (this.updateLoanForm.controls['typeName'].value) {
      case 'Auto':
        this.curLoanList = this.autoLoanDur;
        this.curLoanApr = this.autoLoanApr;
        break;
      case 'Personal':
        this.curLoanList = this.persLoanDur;
        this.curLoanApr = this.persLoanApr;
        break;
      case 'Special':
        this.curLoanList = this.specLoanDur;
        this.curLoanApr = this.specLoanApr;
        break;
      case 'Mortgage':
        this.curLoanList = this.mortLoanDur;
        this.curLoanApr = this.mortLoanApr;
        break;
    }
    this.updateLoanForm.controls['numMonths'].setValue(this.curLoanList[0])
    this.updateLoanForm.controls['apr'].setValue(this.curLoanApr[0])
  }

  async open(content: any, u: Loan | null) {
    if (u !== null) {
      console.log('editing existing loan...', u)
      this.activeLoan = u;
      let userId = u.$user.userId
      this.editing = true;
      this.modalHeader = 'Edit Loan';
      this.updateLoanForm = this.fb.group({
        userId: u.$user.userId,
        id: u.$id,
        balance: u.$balance,
        minDue: CurrencyValue.from(u.$payment.minDue).toString(),
        lateFee: CurrencyValue.from(u.$payment.lateFee).toString(),
        negative: u.$balance.isNegative,
        typeName: u.$loanType.typeName,
        apr: u.$loanType.apr,
        numMonths: u.$loanType.numMonths,
        description: u.$loanType.description,
        createDate: u.$createDate.toString().slice(5, 7) + '/' + u.$createDate.toString().slice(8, 10) + '/' + u.$createDate.toString().slice(0, 4) + ' ' + u.$createDate.toString().slice(11, 20),
        nextDueDate: u.$payment.nextDueDate.toString().slice(5, 7) + '/' + u.$payment.nextDueDate.toString().slice(8, 10) + '/' + u.$payment.nextDueDate.toString().slice(0, 4) + ' ' + u.$payment.nextDueDate.toString().slice(11, 20),
        previousDueDate: u.$payment.previousDueDate.toString().slice(5, 7) + '/' + u.$payment.previousDueDate.toString().slice(8, 10) + '/' + u.$payment.previousDueDate.toString().slice(0, 4) + ' ' + u.$payment.previousDueDate.toString().slice(11, 20),
        principal: u.$principal,
        minMonthFee: u.$payment.minMonthFee,
        hasPaid: u.$payment.hasPaid
      });
      console.log('form: ', this.updateLoanForm.value)
    } else {
      console.log('creating new loan...')
      this.editing = false;
      this.modalHeader = 'Add New Loan';
      const today = new Date();
      const n = new Date();
      const p = new Date();
      n.setDate(today.getDate() + 30);
      p.setDate(today.getDate() - 30);
      this.updateLoanForm = this.fb.group({
        typeName: '',
        userId: '',
        id: '',
        apr: '',
        numMonths: '',
        description: '',
        user: '',
        balance: '',
        dollars: '',
        minDue: '',
        cents: '',
        negative: '',
        createDate: today.toJSON().slice(0, 10),
        nextDueDate: n.toJSON().slice(0, 10),
        previousDueDate: p.toJSON().slice(0, 10),
        principal: '',
        minMonthFee: ''
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
  }

  get user() { return this.updateLoanForm.get('user'); }
  get id() { return this.updateLoanForm.get('id'); }
  get balance() { return this.updateLoanForm.get('balance'); }
  get minDue() { return this.updateLoanForm.get('minDue') }
  get lateFee() { return this.updateLoanForm.get('lateFee') }
  get createDate() { return this.updateLoanForm.get('createDate'); }
  get nextDueDate() { return this.updateLoanForm.get('nextDueDate'); }
  get previousDueDate() { return this.updateLoanForm.get('previousDueDate'); }
  get principal() { return this.updateLoanForm.get('principal'); }
  get minMonthFee() { return this.updateLoanForm.get('minMonthFee'); }
  get hasPaid() { return this.updateLoanForm.get('hasPaid') }
}
