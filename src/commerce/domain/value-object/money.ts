export class Money {
  value: number;

  static createMoney(value: number): Money {
    if (value < 0) {
      throw new Error('Money value cannot be negative.');
    }
    const money = new Money();
    money.value = value;
    return money;
  }

  multiply(quantity: number): Money {
    if (quantity < 0) {
      throw new Error('Quantity cannot be negative for multiplication.');
    }
    return Money.createMoney(this.value * quantity);
  }

  equals(other: Money): boolean {
    const thisKeys = Object.keys(this);
    const otherKeys = Object.keys(other);
    if (thisKeys.length !== otherKeys.length) {
      return false;
    }
    return thisKeys.every((key) => this[key] === other[key]);
  }
}
