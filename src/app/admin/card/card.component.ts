import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Card } from '../../shared/models/card.model';
import { Cardtype } from '../../shared/models/cardtype.model';
import { CardRegistration } from '../../shared/models/cardregistration.model';
import { HttpService } from '../../shared/services/http.service';
import { PageEvent } from "@angular/material/paginator";
import { CurrencyValue } from "../../shared/models/currencyvalue.model";


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  constructor(private httpService: HttpService, private fb: FormBuilder, private modalService: NgbModal) {
  }

  cards: Card[] = new Array();
  cardtypes: Cardtype[] = new Array();
  cardForm!: FormGroup;
  modalRef!: NgbModalRef;
  errorMessage: any;
  errorPresent: boolean = false;
  errorCode: number = 0;
  errorText!: any;
  closeResult: any;
  modalHeader!: String;
  pageIndex: any;
  totalItems: any;
  pageSize: any;
  cardIdOrder: string = 'desc';
  sortByCardId: boolean = false;
  balanceOrder: string = 'desc';
  sortByBalance: boolean = false;
  createDateOrder: string = 'desc';
  sortByCreateDate: boolean = false;
  sortBy: string[] = [];
  predicate: string = '?page=0&&size=5';
  searchCriteria: string = '';
  selectedCardType!: any;

  ngOnInit(): void {
    this.pageSize = 5;
    this.pageIndex = 0;
    this.totalItems = 0;
    this.loadCardTypes();
    this.loadCards();
    this.initializeForms();
  }

  refresh() {
    this.predicate = '?page=0&&size=5';
    this.totalItems = 0;
    this.pageIndex = 0;
    this.pageSize = 5;
    this.loadCards();
  }

  loadCards(): any {
    this.httpService
      .getAll('http://localhost:9001/cards' + this.predicate)
      .subscribe((response) => {
        let arr: any;
        arr = response as Card;
        this.totalItems = arr.totalElements;
        for (let obj of arr.content) {
          let c = new Card(obj.cardId, obj.userId, obj.cardType, new CurrencyValue(obj.isNegative, obj.balance.dollars, obj.balance.cents),
            obj.cardNumber, obj.interestRate, obj.createDate, obj.nickname, obj.billCycleLength, obj.expireDate);
          console.log(c);
          this.cards.push(c);
        }
      }, (err) => {
        console.error("Failed to retrieve cards", err);
        this.errorPresent = true;
        this.errorCode = err.status;
        this.errorText = err.statusText;
        if (err.status === 503) {
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        }
      })
  }

  loadCardTypes(): any {
    this.httpService
      .getAll('http://localhost:9001/cardtypes/')
      .subscribe((response) => {
        let arr: any;
        arr = response;
        for (let obj of arr) {
          let c = new Cardtype(obj.id, obj.typeName, obj.baseInterestRate);
          this.cardtypes.push(c);
        }
      })
  }
  initializeForms() {
    this.cardForm = this.fb.group({
      cardId: new FormControl(''),
      userId: new FormControl('', [Validators.required]),
      cardType: new FormControl('', [Validators.required]),
      balance: new FormControl(''),
      cardNumber: new FormControl(''),
      interestRate: new FormControl('', [Validators.required]),
      createDate: new FormControl(''),
      nickname: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      billCycleLength: new FormControl('', [Validators.required]),
      expireDate: new FormControl('')
    })
  }

  deleteCard(id: String) {
    this.httpService.deleteById('http://localhost:9001/cards/' + id).subscribe((result) => {
      this.cards.length = 0;
      this.loadCards();
    })
  }

  saveCard() {
    if (!this.cardForm.controls['cardId'].value) {
      let c = new CardRegistration(
        this.cardForm.controls['userId'].value,
        this.cardForm.controls['cardType'].value,
        this.cardForm.controls['interestRate'].value,
        this.cardForm.controls['nickname'].value,
        this.cardForm.controls['billCycleLength'].value,
      )

      const body = JSON.stringify(c);

      this.httpService.create('http://localhost:9001/cards/register/' + this.cardForm.controls['userId'].value, body).subscribe((result) => {
        this.cards.length = 0;
        this.loadCards();
        this.initializeForms();
      })
    }
    else {
      let c = new Card(
        this.cardForm.controls['cardId'].value,
        this.cardForm.controls['userId'].value,
        this.cardForm.controls['cardType'].value,
        this.cardForm.controls['balance'].value,
        this.cardForm.controls['cardNumber'].value,
        this.cardForm.controls['interestRate'].value,
        this.cardForm.controls['createDate'].value,
        this.cardForm.controls['nickname'].value,
        this.cardForm.controls['billCycleLength'].value,
        this.cardForm.controls['expireDate'].value);

      const body = JSON.stringify(c);

      this.httpService.update('http://localhost:9001/cards/', body).subscribe((result) => {
        this.cards.length = 0;
        this.loadCards();
        this.initializeForms();
      })
    }

  }

  open(content: any, c: Card | null) {
    this.clearForm();

    if (c !== null) {
      this.modalHeader = 'Edit Card';
      this.cardForm = this.fb.group({
        cardId: c.$cardId,
        userId: c.$userId,
        cardType: c.$cardType,
        balance: c.$balance,
        cardNumber: c.$cardNumber,
        interestRate: c.$interestRate,
        createDate: c.$createDate,
        nickname: c.$nickname,
        billCycleLength: c.$billCycleLength,
        expireDate: c.$expireDate
      });

      this.selectedCardType = c !== null ? this.cardForm.get('cardType')?.value.id : null;
    }
    else {
      this.modalHeader = 'Add New Card';
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

  clearForm() {
    this.selectedCardType = null;
    this.cardForm = this.fb.group({
      cardId: null,
      userId: null,
      cardType: null,
      balance: null,
      cardNumber: null,
      interestRate: null,
      createDate: null,
      nickname: null,
      billCycleLength: null,
      expireDate: null
    });
  }

  onChangePage(pe: PageEvent) {
    this.pageIndex = pe.pageIndex;
    if (pe.pageSize !== this.pageSize) {
      this.pageIndex = 0;
      this.pageSize = pe.pageSize;
    }

    this.updatePage();
  }

  get cardId() { return this.cardForm.get('cardId'); }
  get userId() { return this.cardForm.get('userId'); }
  get cardType() { return this.cardForm.get('cardType'); }
  get balance() { return this.cardForm.get('balance'); }
  get cardNumber() { return this.cardForm.get('cardNumber'); }
  get interestRate() { return this.cardForm.get('interestRate'); }
  get createDate() { return this.cardForm.get('createDate'); }
  get nickname() { return this.cardForm.get('nickname'); }
  get billCycleLength() { return this.cardForm.get('billCycleLength'); }
  get expireDate() { return this.cardForm.get('expireDate'); }

  addToSortBy(field: string) {
    if (field === 'cardId') {
      this.sortByCardId = true;
      this.cardIdOrder = this.cardIdOrder === 'desc' ? 'asc' : 'desc';
    } else if (field === 'balance') {
      this.sortByBalance = true;
      this.balanceOrder = this.balanceOrder === 'desc' ? 'asc' : 'desc';
    } else if (field === 'createDate') {
      this.sortByCreateDate = true;
      this.createDateOrder = this.createDateOrder === 'desc' ? 'asc' : 'desc';
    }

    this.updatePage();
  }

  private assembleQueryParams() {
    this.sortBy = [];

    if (this.sortByCardId) {
      this.sortBy.push('cardId,' + this.cardIdOrder);
    }
    if (this.sortByBalance) {
      this.sortBy.push('balance,' + this.balanceOrder);
    }
    if (this.sortByCreateDate) {
      this.sortBy.push('createDate,' + this.createDateOrder);
    }
  }

  private assemblePredicate() {
    this.assembleQueryParams()

    this.predicate = "?page=" + this.pageIndex + "&&size=" + this.pageSize;
    this.predicate += this.sortBy.length > 0 ? '&&sortBy=' + this.sortBy : '';
    this.predicate += this.searchCriteria.length > 0 ? "&&search=" + this.searchCriteria : '';
  }

  search() {
    this.updatePage();

  }

  updatePage() {
    this.cards = [];

    this.assemblePredicate();

    this.loadCardTypes();
    this.loadCards();
    this.initializeForms();
  }
}
