import { CurrencyValue } from "./currencyvalue.model";


/**
 * The Payment model for parsing PaymentEntitys from the back-end, used in LoanEntitys and CardEntitys.
 */
export class Payment {
    private _id: String;
    private _minDue: CurrencyValue;
    private _lateFee: CurrencyValue;
    private _nextDueDate: Date;
    private _previousDueDate: Date;
    private _hasPaid: boolean;
    private _minMonthFee: String;

    constructor($id: String, $minDue: CurrencyValue, $lateFee: CurrencyValue, $nextDueDate: Date, $previousDueDate: Date,
        $hasPaid: boolean, $minMonthFee: String) {
        this._id = $id;
        this._minDue = $minDue;
        this._lateFee = $lateFee;
        this._nextDueDate = $nextDueDate;
        this._previousDueDate = $previousDueDate;
        this._hasPaid = $hasPaid;
        this._minMonthFee = $minMonthFee;
    }
    public get id(): String {
        return this._id;
    }
    public get minDue(): CurrencyValue {
        return this._minDue;
    }
    public get lateFee(): CurrencyValue {
        return this._lateFee;
    }
    public get nextDueDate(): Date {
        return this._nextDueDate;
    }
    public get previousDueDate(): Date {
        return this._previousDueDate;
    }
    public get hasPaid(): boolean {
        return this._hasPaid;
    }
    public get minMonthFee(): String {
        return this._minMonthFee;
    }
}