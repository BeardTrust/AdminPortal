
export class LoanType {
    private typeId: String;
     activeStatus: boolean;
    private createDate: Date;
     numMonths: number;
     description: String;
    typeName: String;
     apr: number;

    constructor(typeId: String, activeStatus: boolean, createDate: Date, numMonths: number, description: String, typeName: String, apr: number) {
        this.typeId = typeId;
        this.activeStatus = activeStatus;
        this.createDate = createDate;
        this.numMonths = numMonths
        this.description = description;
        this.typeName = typeName;
        this.apr = apr;
    }

    get $typeId() {
        return this.typeId
    }

    set $typeId(val: String) {
        this.typeId = val
    }

    get $activeStatus() {
        return this.activeStatus
    }

    set $activeStatus(val: boolean) {
        this.activeStatus = val
    }

    get $createDate() {
        return this.createDate
    }

    set $createDate(val: Date) {
        this.createDate = val
    }

    get $numMonths() {
        return this.numMonths
    }

    set $numMonths(val: number) {
        this.numMonths = val
    }

    get $description() {
        return this.description
    }

    set $description(val: String) {
        this.description = val
    }

    get $typeName() {
        return this.typeName
    }

    set $typeName(val: String) {
        this.typeName = val
    }

    get $apr() {
        return this.apr
    }

    set $apr(val: number) {
        this.apr = val;
    }
}