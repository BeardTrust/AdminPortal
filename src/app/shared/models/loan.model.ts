import {CurrencyValue} from "./currencyvalue.model";
import { LoanType } from "./loanType.model";
import { Payment } from "./payment.model";
import { User } from "./user.model";

/**
 * The Loan model for parsing LoanEntitys from the back-end
 */
export class Loan {
    private user: User;
    private id: String;
    private balance: CurrencyValue;
    private principal: CurrencyValue;
    private payment: Payment;
    private loanType: LoanType;
    private createDate: Date;

    constructor(createDate: Date, balance: CurrencyValue, principal: CurrencyValue, $payment: Payment, id: String, loanType: LoanType, user: User) {
        this.user = user;
        this.id = id;
        this.balance = balance;
        this.principal = principal;
        this.payment = $payment;
        this.loanType = loanType;
        this.createDate = createDate;
    }

    get $user() {
        return this.user
    }

    set $user(val: User) {
        this.user = val
    }

    get $id() {
        return this.id
    }

    set $id(val: String) {
        this.id = val
    }

    get $balance() {
        return this.balance
    }

    set $balance(val: CurrencyValue) {
        this.balance = val
    }

    set $principal(val: CurrencyValue) {
        this.principal = val
    }

    get $principal() {
        return this.principal
    }

    set $loanType(val: LoanType) {
        this.loanType = val
    }

    get $loanType() {
        return this.loanType
    }

    get $createDate() {
        return this.createDate
    }

    set $createDate(val: Date) {
        this.createDate = val
    }

    public get $payment() {
        return this.payment
    }

    set $payment(val: Payment) {
        this.payment = val
    }
}