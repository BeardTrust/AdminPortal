

/**
 * The AccountType model for parsing AccountTtypeEntitys from the back-end
 */
export class AccountType {
    private id: number;
    name: String;
    description: String;
    private isActive: boolean;
    private createDate: Date;
    private expireDate: Date;
    private nickname: String;

    constructor(id: number, name: String, description: String, isActive: boolean, createDate: Date, expireDate: Date, nickname: String) {
        this.id = id;
        this.isActive = isActive;
        this.name = name;
        this.description = description;
        this.createDate = createDate;
        this. expireDate = expireDate;
        this.nickname = nickname;
    }

    get $id() {
        return this.id
    }

    set $id(val: number) {
        this.id = val
    }

    get $name() {
        return this.name
    }

    set $name(val: String) {
        this.name = val
    }

    get $description() {
        return this.description
    }

    set $description(val: String) {
        this.description = val
    }

    get $isActive() {
        return this.isActive
    }

    set $isActive(val: boolean) {
        this.isActive = val
    }

    get $createDate() {
        return this.createDate
    }

    set $createDate(val: Date) {
        this.createDate = val
    }

    get $expireDate() {
        return this.expireDate
    }

    set $expireDate(val: Date) {
        this.expireDate = val
    }

    get $nickname() {
        return this.nickname
    }

    set $nickname(val: String) {
        this.nickname = val
    }
}