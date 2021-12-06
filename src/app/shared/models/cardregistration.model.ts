
/**
 * The CardRegistration model for sending a 'new card' request to the back-end
 */
export class CardRegistration {
    private userId: String;
    private cardType: String;
    private interestRate: Number;
    private nickname: String;
    private billCycleLength: Number;

	constructor($userId: String, $cardType: String, $interestRate: Number, $nickname: String, $billCycleLength: Number) {
		this.userId = $userId;
		this.cardType = $cardType;
		this.interestRate = $interestRate;
		this.nickname = $nickname;
		this.billCycleLength = $billCycleLength;
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
     * @return {String}
     */
	public get $cardType(): String {
		return this.cardType;
	}

    /**
     * Getter $interestRate
     * @return {Number}
     */
	public get $interestRate(): Number {
		return this.interestRate;
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
     * Setter $userId
     * @param {String} value
     */
	public set $userId(value: String) {
		this.userId = value;
	}

    /**
     * Setter $cardType
     * @param {String} value
     */
	public set $cardType(value: String) {
		this.cardType = value;
	}

    /**
     * Setter $interestRate
     * @param {Number} value
     */
	public set $interestRate(value: Number) {
		this.interestRate = value;
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

    


}
