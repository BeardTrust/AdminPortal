import { Cardtype } from "./cardtype.model";
import { CurrencyValue } from "./currencyvalue.model";
import { Payment } from "./payment.model";

/**
 * The Card model for parsing CardEntitys from the back-end
 */
export class Card {

    private cardId: String;
	private userId: String;
	private cardType: Cardtype;
	private balance: CurrencyValue;
    private payment: Payment;
	private cardNumber: String;
	private interestRate: Number;
	private createDate: String ;
	private nickname: String;
	private billCycleLength: Number;
	private expireDate: String;

	constructor($cardId: String, $userId: String, $cardType: Cardtype, $payment: Payment, $balance: CurrencyValue, $cardNumber: String, $interestRate: Number, $createDate: String , $nickname: String, $billCycleLength: Number, $expireDate: String) {
		this.cardId = $cardId;
		this.userId = $userId;
		this.cardType = $cardType;
        this.payment = $payment;
		this.balance = $balance;
		this.cardNumber = $cardNumber;
		this.interestRate = $interestRate;
		this.createDate = $createDate;
		this.nickname = $nickname;
		this.billCycleLength = $billCycleLength;
		this.expireDate = $expireDate;
	}


    /**
     * Getter $cardId
     * @return {String}
     */
	public get $cardId(): String {
		return this.cardId;
	}

    /**
     * Getter $payment
     * @return {Payment}
     */
    public get $payment(): Payment {
        return this.payment;
    }

    /**
     * Getter $userId
     * @return {String}
     */
	public get $userId(): String {
		return this.userId;
	}

    /**
     * Getter $cardType
     * @return {String }
     */
	public get $cardType(): Cardtype  {
		return this.cardType;
	}

    /**
     * Getter $balance
     * @return {Number}
     */
	public get $balance(): CurrencyValue {
		return this.balance;
	}

    /**
     * Getter $cardNumber
     * @return {String}
     */
	public get $cardNumber(): String {
		return this.cardNumber;
	}

    /**
     * Getter $interestRate
     * @return {Number}
     */
	public get $interestRate(): Number {
		return this.interestRate;
	}

    /**
     * Getter $createDate
     * @return {String }
     */
	public get $createDate(): String  {
		return this.createDate;
	}

    /**
     * Getter $nickname
     * @return {String}
     */
	public get $nickname(): String {
		return this.nickname;
	}

    /**
     * Getter $billCycleLength
     * @return {Number}
     */
	public get $billCycleLength(): Number {
		return this.billCycleLength;
	}

    /**
     * Getter $expireDate
     * @return {String}
     */
	public get $expireDate(): String {
		return this.expireDate;
	}

    /**
     * Setter $cardId
     * @param {String} value
     */
	public set $cardId(value: String) {
		this.cardId = value;
	}

    /**
     * Setter $userId
     * @param {String} value
     */
	public set $userId(value: String) {
		this.userId = value;
	}

    /**
     * Setter $cardType
     * @param {String } value
     */
	public set $cardType(value: Cardtype ) {
		this.cardType = value;
	}

    /**
     * Setter $balance
     * @param {Number} value
     */
	public set $balance(value: CurrencyValue) {
		this.balance = value;
	}

    /**
     * Setter $cardNumber
     * @param {String} value
     */
	public set $cardNumber(value: String) {
		this.cardNumber = value;
	}

    /**
     * Setter $interestRate
     * @param {Number} value
     */
	public set $interestRate(value: Number) {
		this.interestRate = value;
	}

    /**
     * Setter $createDate
     * @param {String } value
     */
	public set $createDate(value: String ) {
		this.createDate = value;
	}

    /**
     * Setter $nickname
     * @param {String} value
     */
	public set $nickname(value: String) {
		this.nickname = value;
	}

    /**
     * Setter $billCycleLength
     * @param {Number} value
     */
	public set $billCycleLength(value: Number) {
		this.billCycleLength = value;
	}

    /**
     * Setter $expireDate
     * @param {String} value
     */
	public set $expireDate(value: String) {
		this.expireDate = value;
	}
}
