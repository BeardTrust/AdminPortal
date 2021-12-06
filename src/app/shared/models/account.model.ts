import { CurrencyValue } from "./currencyvalue.model";
import { User } from "./user.model";
import { AccountType } from "./accounttype.model";

/**
 * The Account model for parsing AccountEntitys from the back-end
 */
export class Account {
    user: User;
    id: String;
    private activeStatus: boolean;
    private balance: CurrencyValue;
    private createDate: Date;
    interest: number;
    private nickname: String;
    type: AccountType;
    private firstName: any;
    private lastName: any;

    constructor(user: User, id: String, activeStatus: boolean, balance: CurrencyValue, createDate: Date, interest: number, nickname: String, type: AccountType) {
        this.user = user;
        this.id = id;
        this.activeStatus = activeStatus;
        this.balance = balance;
        this.createDate = createDate;
        this.interest = interest
        this.nickname = nickname;
        this.type = type;
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

    get $activeStatus() {
        return this.activeStatus
    }

    set $activeStatus(val: boolean) {
        this.activeStatus = val
    }

    get $balance() {
        return this.balance
    }

    set $balance(val: CurrencyValue) {
        this.balance = val
    }

    fixBalance(): CurrencyValue {
        return this.balance
    }

    get $createDate() {
        return this.createDate
    }

    set $createDate(val: Date) {
        this.createDate = val
    }

    get $interest() {
        return this.interest
    }

    set $interest(val: number) {
        this.interest = val
    }

    get $nickname() {
        return this.nickname
    }

    set $nickname(val: String) {
        this.nickname = val
    }

    get $type() {
        return this.type
    }

    set $type(val: AccountType) {
        this.type = val
    }

    get $firstName() {
        return this.firstName
    }

    set $firstName(val: String) {
        this.firstName = val;
    }

    get $lastName() {
        return this.lastName
    }

    set $lastName(val: String) {
        this.lastName = val;
    }
}
