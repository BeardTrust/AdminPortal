/**
 * This class represents a currency value, such as a balance or
 * transaction amount.  It has three properties: a boolean flag
 * representing whether the amount is negative, an integer for
 * the dollar value, and an integer for the cents value.  All
 * numerical values are stored as their absolute values and the
 * positive or negative aspect is represented solely by the
 * isNegative boolean flag.
 *
 * @author Matthew Crowell <Matthew.Crowell@Smoothstack.com>
 */
export class CurrencyValue{
  private _isNegative: boolean;
  private _dollars: number;
  private _cents: number;

  /**
   * The parameterized constructor for the CurrencyValue class
   * takes three arguments: a boolean for whether the value is
   * negative, an integer for the number of dollars, and another
   * integer for the number of cents.
   *
   * @param isNegative boolean answers if the value is negative
   * @param dollars integer the number of dollars
   * @param cents integer the number of cents
   */
  constructor(isNegative: boolean, dollars: number, cents: number) {
    this._isNegative = isNegative;
    this._dollars = Math.abs(Math.trunc(dollars));
    this._cents = Math.abs(Math.trunc(cents));
  }


  /**
   * Getter for isNegative flag.
   */
  get isNegative(): boolean {
    return this._isNegative;
  }

  /**
   * Setter for isNegative flag.
   *
   * @param value boolean whether the currency value is negative
   */
  set isNegative(value: boolean) {
    this._isNegative = value;
  }

  /**
   * Getter for dollars.
   */
  get dollars(): number {
    return this._dollars;
  }

  /**
   * The setter for dollars.
   *
   * @param value number the dollar value
   */
  set dollars(value: number) {
    this._dollars = Math.abs(Math.trunc(value))
  }

  /**
   * Getter for cents.
   */
  get cents(): number {
    return this._cents;
  }

  /**
   * The setter for cents.
   *
   * @param value number the cents value
   */
  set cents(value: number) {
    this._cents = Math.abs(Math.trunc(value))
  }

  /**
   * This method compares this object to another object and
   * returns a -1 if this object represents a smaller value,
   * 0 if it represents the same value, and 1 if it represents
   * a larger value than the other CurrencyValue object.
   *
   * @param other CurrencyValue the currency value to compare this value to
   * @returns {number} integer -1 for less than, 0 for equal to, 1 for greater than
   */
  compareTo(other: CurrencyValue){
    let returnValue = 0;

    if (this.isNegative === other.isNegative) {
      if (this.dollars !== other.dollars) {
        returnValue = this.dollars > other.dollars ? 1 : -1;
      } else {
        returnValue = this.cents > other.cents ? 1 : -1;
      }

      if (this.isNegative) {
        returnValue *= -1;
      }
    } else {
      returnValue = this.isNegative ? -1 : 1;
    }

    return returnValue;
  }

  /**
   * This method attempts to parse a number object with non-
   * integer values into a CurrencyValue object storing dollars
   * and cents as integer values, which are more accurate for
   * the purpose of calculations.  Although care is taken to
   * attempt to create a new CurrencyValue object safely, the
   * burden is on the user of this method to ensure that the
   * resulting value is the intended value and does not contain
   * any distortions from rounding errors or the inherent value
   * approximation that is a floating point representation.
   *
   * @param value number the floating point number representing a value
   * @returns {CurrencyValue} CurrencyValue the resulting value object
   */
  static valueOf(value: number){
    const isNegative = value < 0;
    const dollars = Math.abs(Math.trunc(value));
    const cents = Math.abs(Math.trunc((value * 100) % 100));

    return new CurrencyValue(isNegative, dollars, cents);
  }
}