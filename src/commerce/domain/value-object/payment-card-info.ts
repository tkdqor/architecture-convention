import { Column } from 'typeorm';
import { EntityValidation } from '../common/validation/entity-validation';

export class PaymentCardInfo {
  @Column({ name: 'card_number', type: 'varchar', length: 100 })
  cardNumber: string;

  @Column({ name: 'card_holder', type: 'varchar', length: 100 })
  cardHolder: string;

  @Column({ type: 'varchar', length: 5 })
  expiry: string;

  @Column({ type: 'varchar', length: 4 })
  cvc: string;

  protected constructor() {}

  static createPaymentCardInfo(
    cardNumber: string,
    cardHolder: string,
    expiry: string,
    cvc: string,
  ): PaymentCardInfo {
    const cleanedCardNumber = cardNumber.replace(/-/g, '');
    if (!/^\d{16}$/.test(cleanedCardNumber)) {
      throw new Error('카드 번호는 16자리 숫자여야 합니다.');
    }
    if (!cardHolder.trim()) {
      throw new Error('카드 소유자 이름은 필수입니다.');
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      throw new Error('만료일은 MM/YY 형식이어야 합니다.');
    }
    if (!/^\d{3,4}$/.test(cvc)) {
      throw new Error('CVC는 3~4자리 숫자여야 합니다.');
    }
    const paymentCardInfo = new PaymentCardInfo();
    paymentCardInfo.cardNumber = cardNumber;
    paymentCardInfo.cardHolder = cardHolder;
    paymentCardInfo.cvc = cvc;
    paymentCardInfo.expiry = expiry;
    return paymentCardInfo;
  }

  updatePaymentCardInfo(
    cardNumber: string,
    paymentCardHolder: string,
    expiry: string,
    cvc: string,
  ): PaymentCardInfo {
    return PaymentCardInfo.createPaymentCardInfo(
      cardNumber,
      paymentCardHolder,
      expiry,
      cvc,
    );
  }

  equals(other: PaymentCardInfo): boolean {
    const thisKeys = Object.keys(this);
    const otherKeys = Object.keys(other);
    if (thisKeys.length !== otherKeys.length) {
      return false;
    }
    return thisKeys.every((key) => this[key] === other[key]);
  }
}
