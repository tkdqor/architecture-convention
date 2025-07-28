import { IsNumber, Min } from 'class-validator';
import { Column } from 'typeorm';

export class Money {
  @IsNumber()
  @Min(0)
  @Column({ name: 'amount', type: 'bigint', comment: '금액' })
  value: number;

  protected constructor() {}

  static createMoney(value: number): Money {
    // TODO: 여기서도 class-validator 동작시키기?
    if (value < 0) {
      throw new Error('Money value cannot be negative.');
    }
    const money = new Money();
    money.value = value;
    return money;
  }

  add(money: Money): Money {
    if (money.value < 0) {
      throw new Error('Money value cannot be negative.');
    }
    return Money.createMoney(this.value + money.value);
  }

  multiply(quantity: number): Money {
    if (quantity < 0) {
      throw new Error('Quantity cannot be negative for multiplication.');
    }
    return Money.createMoney(this.value * quantity);
  }

  // TODO: equals 되는지 확인!
  equals(other: Money): boolean {
    const thisKeys = Object.keys(this);
    const otherKeys = Object.keys(other);
    if (thisKeys.length !== otherKeys.length) {
      return false;
    }
    return thisKeys.every((key) => this[key] === other[key]);
  }
}
