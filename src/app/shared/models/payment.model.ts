import { CurrencyValue } from "./currencyvalue.model";

export class Payment {
    private id: String;
    private minDue: CurrencyValue;
    private lateFee: CurrencyValue;
    private nextDueDate: Date;
    private previousDueDate: Date;
    private hasPaid: boolean;
    private minMonthFee: String;

    constructor($id: String, $minDue: CurrencyValue, $lateFee: CurrencyValue, $nextDueDate: Date, $previousDueDate: Date,
        $hasPaid: boolean, $minMonthFee: String) {
        this.id = $id;
        this.minDue = $minDue;
        this.lateFee = $lateFee;
        this.nextDueDate = $nextDueDate;
        this.previousDueDate = $previousDueDate;
        this.hasPaid = $hasPaid;
        this.minMonthFee = $minMonthFee;
    }
    public get $id(): String {
        return this.id;
    }
    public get $minDue(): CurrencyValue {
        return this.minDue;
    }
    public get $lateFee(): CurrencyValue {
        return this.lateFee;
    }
    public get $nextDueDate(): Date {
        return this.nextDueDate;
    }
    public get $previousDueDate(): Date {
        return this.previousDueDate;
    }
    public get $hasPaid(): boolean {
        return this.hasPaid;
    }
    public get $minMonthFee(): String {
        return this.minMonthFee;
    }
}