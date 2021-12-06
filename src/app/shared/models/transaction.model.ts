import {Timestamp} from "rxjs";


/**
 * The Transaction model for parsing FinancialTransacions from the back-end
 */
export class TransactionModel {
  private _id: string;

  private _transactionType: {
    typeId: number,
    typeName: string,
    typeDescription: string,
    sourceDescription: string,
    targetDescription: string
  };

  private _transactionAmount: {
    dollars: number,
    cents: number,
    negative: boolean
  };

  private _transactionStatus: {
    statusId: number,
    statusName: string,
    statusDescription: string
  };

  private _source: {
    id: string,
    user: {
      userId: string,
      username: string,
      email: string,
      phone: string,
      firstName: string,
      lastName: string,
      dateOfBirth: Date,
      role: string
    },
    activeStatus: boolean,
    balance: {
      dollars: number,
      cents: number,
      negative: boolean
    },
    createDate: Timestamp<any>,
    interest: number,
    nickname: string,
    type: {
      id: number,
      name: string,
      description: string,
      createdDate: Timestamp<any>,
      expireDate: Timestamp<any>,
      active: boolean
    }
  };

  private _target: {
    id: string,
    user: {
      userId: string,
      username: string,
      email: string,
      phone: string,
      firstName: string,
      lastName: string,
      dateOfBirth: Date,
      role: string
    },
    activeStatus: boolean,
    balance: {
      dollars: number,
      cents: number,
      negative: boolean
    },
    createDate: Timestamp<any>,
    interest: number,
    nickname: string,
    type: {
      id: number,
      name: string,
      description: string,
      createdDate: Timestamp<any>,
      expireDate: Timestamp<any>,
      active: boolean
    }
  };

  private _statusTime: Timestamp<any>;

  private _notes: string;

  constructor(id: string, transactionType: { typeId: number; typeName: string; typeDescription: string; sourceDescription: string; targetDescription: string; }, transactionAmount: { dollars: number; cents: number; negative: boolean; }, transactionStatus: { statusId: number; statusName: string; statusDescription: string; }, source: { id: string; user: { userId: string; username: string; email: string; phone: string; firstName: string; lastName: string; dateOfBirth: Date; role: string; }; activeStatus: boolean; balance: { dollars: number; cents: number; negative: boolean; }; createDate: Timestamp<any>; interest: number; nickname: string; type: { id: number; name: string; description: string; createdDate: Timestamp<any>; expireDate: Timestamp<any>; active: boolean; }; }, target: { id: string; user: { userId: string; username: string; email: string; phone: string; firstName: string; lastName: string; dateOfBirth: Date; role: string; }; activeStatus: boolean; balance: { dollars: number; cents: number; negative: boolean; }; createDate: Timestamp<any>; interest: number; nickname: string; type: { id: number; name: string; description: string; createdDate: Timestamp<any>; expireDate: Timestamp<any>; active: boolean; }; }, statusTime: Timestamp<any>, notes: string) {
    this._id = id;
    this._transactionType = transactionType;
    this._transactionAmount = transactionAmount;
    this._transactionStatus = transactionStatus;
    this._source = source;
    this._target = target;
    this._statusTime = statusTime;
    this._notes = notes;
  }


  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get transactionType(): { typeId: number; typeName: string; typeDescription: string; sourceDescription: string; targetDescription: string } {
    return this._transactionType;
  }

  set transactionType(value: { typeId: number; typeName: string; typeDescription: string; sourceDescription: string; targetDescription: string }) {
    this._transactionType = value;
  }

  get transactionAmount(): { dollars: number; cents: number; negative: boolean } {
    return this._transactionAmount;
  }

  set transactionAmount(value: { dollars: number; cents: number; negative: boolean }) {
    this._transactionAmount = value;
  }

  get transactionStatus(): { statusId: number; statusName: string; statusDescription: string } {
    return this._transactionStatus;
  }

  set transactionStatus(value: { statusId: number; statusName: string; statusDescription: string }) {
    this._transactionStatus = value;
  }

  get source(): { id: string; user: { userId: string; username: string; email: string; phone: string; firstName: string; lastName: string; dateOfBirth: Date; role: string }; activeStatus: boolean; balance: { dollars: number; cents: number; negative: boolean }; createDate: Timestamp<any>; interest: number; nickname: string; type: { id: number; name: string; description: string; createdDate: Timestamp<any>; expireDate: Timestamp<any>; active: boolean } } {
    return this._source;
  }

  set source(value: { id: string; user: { userId: string; username: string; email: string; phone: string; firstName: string; lastName: string; dateOfBirth: Date; role: string }; activeStatus: boolean; balance: { dollars: number; cents: number; negative: boolean }; createDate: Timestamp<any>; interest: number; nickname: string; type: { id: number; name: string; description: string; createdDate: Timestamp<any>; expireDate: Timestamp<any>; active: boolean } }) {
    this._source = value;
  }

  get target(): { id: string; user: { userId: string; username: string; email: string; phone: string; firstName: string; lastName: string; dateOfBirth: Date; role: string }; activeStatus: boolean; balance: { dollars: number; cents: number; negative: boolean }; createDate: Timestamp<any>; interest: number; nickname: string; type: { id: number; name: string; description: string; createdDate: Timestamp<any>; expireDate: Timestamp<any>; active: boolean } } {
    return this._target;
  }

  set target(value: { id: string; user: { userId: string; username: string; email: string; phone: string; firstName: string; lastName: string; dateOfBirth: Date; role: string }; activeStatus: boolean; balance: { dollars: number; cents: number; negative: boolean }; createDate: Timestamp<any>; interest: number; nickname: string; type: { id: number; name: string; description: string; createdDate: Timestamp<any>; expireDate: Timestamp<any>; active: boolean } }) {
    this._target = value;
  }

  get statusTime(): Timestamp<any> {
    return this._statusTime;
  }

  set statusTime(value: Timestamp<any>) {
    this._statusTime = value;
  }

  get notes(): string {
    return this._notes;
  }

  set notes(value: string) {
    this._notes = value;
  }
}
