

/**
 * The User model for parsing UserEntitys from the back-end
 */
export class User {

    userId: String;
    private username: String;
    private password: String;
    private email: String;
    private phone: String;
    private firstName: String;
    private lastName: String;
    private dateOfBirth: String;
    private role: String;

	constructor(username: String, password: String, email: String, phone: String, firstName: String, lastName: String, dateOfBirth: String, role: String, userId: String) {
        this.password = password;
		this.email = email;
		this.phone = phone;
		this.firstName = firstName;
		this.lastName = lastName;
		this.username = username;
		this.dateOfBirth = dateOfBirth;
        this.role = role;
        this.userId = userId;
    }



    /**
     * Getter $userId
     * @return {String}
     */
	public get $userId(): String {
		return this.userId;
	}

    /**
     * Setter $userId
     * @param {String} value
     */
	public set $userId(value: String) {
		this.userId = value;
	}

    /**
     * Getter $password
     * @return {String}
     */
	public get $password(): String {
		return this.password;
	}

    /**
     * Setter $password
     * @param {String} value
     */
	public set $password(value: String) {
		this.password = value;
	}

    /**
     * Getter $phone
     * @return {String}
     */
	public get $phone(): String {
		return this.phone;
	}

    /**
     * Setter $phone
     * @param {String} value
     */
	public set $phone(value: String) {
		this.phone = value;
	}

    /**
     * Getter $username
     * @return {String}
     */
	public get $username(): String {
		return this.username;
	}

    /**
     * Setter $username
     * @param {String} value
     */
	public set $username(value: String) {
		this.username = value;
	}

    /**
     * Getter $email
     * @return {String}
     */
	public get $email(): String {
		return this.email;
	}

    /**
     * Setter $email
     * @param {String} value
     */
	public set $email(value: String) {
		this.email = value;
	}

    /**
     * Getter $firstName
     * @return {String}
     */
	public get $firstName(): String {
		return this.firstName;
	}

    /**
     * Setter $firstName
     * @param {String} value
     */
	public set $firstName(value: String) {
		this.firstName = value;
	}

    /**
     * Getter $lastName
     * @return {String}
     */
	public get $lastName(): String {
		return this.lastName;
	}

    /**
     * Setter $lastName
     * @param {String} value
     */
	public set $lastName(value: String) {
		this.lastName = value;
	}

    /**
     * Getter $dateOfBirth
     * @return {String}
     */
	public get $dateOfBirth(): String {
		return this.dateOfBirth;
	}

    /**
     * Setter $dateOfBirth
     * @param {String} value
     */
	public set $dateOfBirth(value: String) {
		this.dateOfBirth = value;
	}

    /**
     * Getter $role
     * @return {String}
     */
	public get $role(): String {
		return this.role;
	}

    /**
     * Setter $role
     * @param {String} value
     */
	public set $role(value: String) {
		this.role = value;
	}

}