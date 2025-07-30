import { DomainEvent } from '../../../../common/domain/event/domain-event';
import { PaymentCardInfo } from '../value-object/payment-card-info';

export class OrderPaidEvent extends DomainEvent {
  amount: number;
  paymentCardInfo: PaymentCardInfo;

  constructor(
    entityId: string | undefined,
    amount: number,
    paymentCardInfo: PaymentCardInfo,
  ) {
    super(entityId, 'OrderPaidEvent');
    this.amount = amount;
    this.paymentCardInfo = paymentCardInfo;
  }
}
