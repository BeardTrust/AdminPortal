import {Component, HostListener, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Card } from '../../shared/models/card.model';
import { Cardtype } from '../../shared/models/cardtype.model';
import { CardRegistration } from '../../shared/models/cardregistration.model';
import { HttpService } from '../../shared/services/http.service';
import {PageEvent} from "@angular/material/paginator";
import {CurrencyValue} from "../../shared/models/currencyvalue.model";
import { Payment } from 'src/app/shared/models/payment.model';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
/**
 * The card Component allows admins to view all cards, create new ones, delete existing ones, and update them.
 * It uses card.component.html to display everything and card.component.css for styling
 */
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
  userIdOrder: string = 'desc';
  sortByUserId: boolean = false;
  balanceOrder: string = 'desc';
  sortByBalance: boolean = false;
  nicknameOrder: string = 'desc'
  sortByNickname: boolean = false;
  createDateOrder: string = 'desc';
  sortByCreateDate: boolean = false;
  sortBy: string[] = [];
  predicate: string = '?page=0&&size=5';
  searchCriteria: string = '';
  selectedCardType!: any;
  width!: number;

  ngOnInit(): void {
    this.width = window.innerWidth;
    this.pageSize=5;
    this.pageIndex=0;
    this.totalItems=0;
    this.loadCardTypes();
    this.loadCards();
    this.initializeForms();
  }

  @HostListener('window:resize', [])
  private onResize() {
    this.width = window.innerWidth;
    console.log('resized to: ' + this.width)
  }

  /**
   * This function will reset all search and sort information to default, and calls the list again.
   */
  refresh() {
    this.predicate = '?page=0&&size=5';
    this.sortByBalance = false;
    this.sortByCardId = false;
    this.sortByCreateDate = false;
    this.sortByNickname = false;
    this.sortByUserId = false;
    this.totalItems = 0;
    this.pageIndex = 0;
    this.pageSize = 5;
    this.loadCards();
  }

  /**
   * This is the primary function for loading cards from the back end.
   * It will also set any errors it receives from the back-end
   */
  loadCards(): any {
    this.httpService
    .getAll(`${environment.baseUrl}${environment.cardsEndpoint}` + this.predicate)
    .subscribe((response) => {
      let arr: any;
      arr = response as Card;
      this.totalItems = arr.totalElements;
      for(let obj of arr.content){
        console.log(obj)
        let c = new Card(obj.id, obj.user.userId, obj.cardType, obj.payment, new CurrencyValue(obj.isNegative, obj.balance.dollars, obj.balance.cents),
          obj.cardNumber, obj.interestRate, obj.createDate, obj.nickname, obj.billCycleLength, obj.expireDate);
        console.log(c);
        this.cards.push(c);
      }
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

  /**
   * This is the primary function for loading card types (cards on offer) from the back end.
   * It will also set any errors it receives from the back-end
   */
  loadCardTypes(): any {
    this.httpService
      .getAll(`${environment.baseUrl}${environment.cardTypesEndpoint}/`)
      .subscribe((response) => {
        let arr: any;
        arr = response;
        for (let obj of arr) {
          let c = new Cardtype(obj.id, obj.typeName, obj.baseInterestRate);
          this.cardtypes.push(c);
        }
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

  /**
   * This function sends a delete request for cards
   * It will also sets any errors that it receives
   * @param id The idea of the card to delete
   */
  deleteCard(id: String) {
    this.httpService.deleteById(`${environment.baseUrl}${environment.cardsEndpoint}/` + id).subscribe((result) => {
      this.cards.length = 0;
      this.loadCards();
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

  /**
   * This function will save a new card to the database using informatoin found in the cardForm.
   * It will also set and display any errors encountered.
   */
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

      this.httpService.create(`${environment.baseUrl}${environment.cardsEndpoint}/register/` + this.cardForm.controls['userId'].value, body).subscribe((result) => {
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
        new Payment('x', new CurrencyValue(false, 0, 0), new CurrencyValue(false, 0, 0), new Date, new Date, false, '0'),
        this.cardForm.controls['balance'].value,
        this.cardForm.controls['cardNumber'].value,
        this.cardForm.controls['interestRate'].value,
        this.cardForm.controls['createDate'].value,
        this.cardForm.controls['nickname'].value,
        this.cardForm.controls['billCycleLength'].value,
        this.cardForm.controls['expireDate'].value);

      const body = JSON.stringify(c);

      this.httpService.update(`${environment.baseUrl}${environment.cardsEndpoint}/`, body).subscribe((result) => {
        this.cards.length = 0;
        this.loadCards();
        this.initializeForms();
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

  }

  /**
   * This function opens the cardModal for the purposes of making a new card and/or editing an existing one.
   * 
   * @param content The cardModal to use
   * @param c The card being made or edited
   */
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

  /**
   * This function adds sorting fields to the sortBy array by enabling them here
   * They will be assembled later in the assembleQueryParams function
   * 
   * @param field The sorting to add
   */
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
    } else if(field === 'userId'){
      this.sortByUserId = true;
      this.userIdOrder = this.userIdOrder === 'desc' ? 'asc' : 'desc';
    } else if(field === 'nickname'){
      this.sortByNickname = true;
      this.nicknameOrder = this.nicknameOrder === 'desc' ? 'asc' : 'desc';
    }

    this.updatePage();
  }

  /**
   * This function builds the query aspect of the url predicate out of the enabled fields
   */
  private assembleQueryParams() {
    this.sortBy = [];

    if(this.sortByCardId){
      this.sortBy.push('id,' + this.cardIdOrder);
    }
    if(this.sortByBalance){
      this.sortBy.push('balance_dollars,' + this.balanceOrder);
    }
    if (this.sortByCreateDate) {
      this.sortBy.push('createDate,' + this.createDateOrder);
    }
    if(this.sortByUserId){
      this.sortBy.push('user_userId,' + this.userIdOrder);
    }
    if(this.sortByNickname){
      this.sortBy.push('nickname,' + this.nicknameOrder);
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

  search() {
    this.updatePage();

  }

  /**
   * This function calls all the important functions in the order they are necessary for loading the card list.
   */
  updatePage() {
    this.cards = [];
    this.onResize();

    this.assemblePredicate();

    this.loadCardTypes();
    this.loadCards();
    this.initializeForms();
  }
}
