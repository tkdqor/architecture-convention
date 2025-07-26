import { Column } from 'typeorm';

export class PaymentCardInfo {
  @Column({ name: 'card_number', type: 'varchar', length: 100 })
  cardNumber: string;

  @Column({ name: 'card_holder', type: 'varchar', length: 100 })
  cardHolder: string;

  @Column({ type: 'varchar', length: 5 })
  expiry: string;

  @Column({ type: 'varchar', length: 4 })
  cvc: string;

  static createPaymentCardInfo(
    cardNumber: string,
    cardHolder: string,
    expiry: string,
    cvc: string,
  ): PaymentCardInfo {
    const paymentCardInfo = new PaymentCardInfo();
    paymentCardInfo.cardNumber = cardNumber;
    paymentCardInfo.cardHolder = cardHolder;
    paymentCardInfo.cvc = cvc;
    paymentCardInfo.expiry = expiry;
    return paymentCardInfo;
  }
}
