import { PureOrderItem } from './pure-order-item';
import { OrderItemAlreadyExistsDomainException } from '../exception/order-item-already-exists-domain-exception';
import { PaymentCardInfo } from '../value-object/payment-card-info';
import { Money } from '../value-object/money';
import { OrderPaidEvent } from '../event/order-paid.event';
import { DomainEvent } from '../../../../common/domain/event/domain-event';

export enum OrderStatusEnum {
  PLACED = 'PLACED',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export interface CreateOrderParams {
  customerId: string;
}

export interface CreateOrderItemParams {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export interface AddPaymentCardInfoParams {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvc: string;
}

/**
 * 순수 도메인 Order 클래스
 * TypeORM 의존성 없이 비즈니스 로직에만 집중
 */
export class PureOrder {
  id: string | undefined;
  customerId: string;
  items: PureOrderItem[];
  status: OrderStatusEnum;
  totalAmount: Money;
  paymentCardInfo: PaymentCardInfo | undefined;
  domainEvents: DomainEvent[];

  constructor(
    customerId: string,
    items: PureOrderItem[] = [],
    status: OrderStatusEnum = OrderStatusEnum.PLACED,
    totalAmount?: Money,
    paymentCardInfo?: PaymentCardInfo,
    id?: string,
  ) {
    this.customerId = customerId;
    this.items = items;
    this.status = status;
    this.totalAmount = totalAmount || Money.createMoney(0);
    this.paymentCardInfo = paymentCardInfo;
    this.id = id;
    this.domainEvents = []; // domainEvents 배열 초기화
  }

  static createOrder(params: CreateOrderParams): PureOrder {
    if (!params.customerId || params.customerId.trim().length === 0) {
      throw new Error('Customer ID cannot be empty');
    }

    return new PureOrder(params.customerId);
  }

  // 다른 생성자 (Repository에서 DB 데이터로 복원할 때 사용)
  static fromData(
    customerId: string,
    items: PureOrderItem[],
    status: OrderStatusEnum,
    totalAmount: Money,
    paymentCardInfo?: PaymentCardInfo,
    id?: string,
  ): PureOrder {
    return new PureOrder(
      customerId,
      items,
      status,
      totalAmount,
      paymentCardInfo,
      id,
    );
  }

  // 애그리거트 루트를 통한 OrderItem 추가 (일관성 유지)
  addItem(params: CreateOrderItemParams): void {
    const existingItem = this.items.find(
      (item) => item.productId === params.productId,
    );
    if (existingItem) {
      throw new OrderItemAlreadyExistsDomainException(params.productId);
    }

    const newItem = PureOrderItem.createOrderItem(
      params.productId,
      params.productName,
      Money.createMoney(params.price),
      params.quantity,
    );
    this.items.push(newItem);
    this.updateTotalAmount(newItem);
  }

  // 애그리거트의 불변식을 지키는 내부 메서드
  private updateTotalAmount(newItem: PureOrderItem): void {
    const itemTotal = newItem.price.multiply(newItem.quantity);
    this.totalAmount = this.totalAmount.add(itemTotal);
  }

  // 카드 결제 정보 추가
  addPaymentCardInfo(params: AddPaymentCardInfoParams): void {
    this.paymentCardInfo = PaymentCardInfo.createPaymentCardInfo(
      params.cardNumber,
      params.cardHolder,
      params.expiry,
      params.cvc,
    );

    // 상태 변경
    this.status = OrderStatusEnum.PAID;

    // 결제 완료 이벤트 발행
    const orderPaidEvent = new OrderPaidEvent(
      this.id,
      this.totalAmount.value,
      this.paymentCardInfo,
    );
    this.raiseEvent(orderPaidEvent);
  }

  // 도메인 이벤트 발행
  raiseEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  // 발생한 이벤트 목록 조회
  public getRaisedEventList(): DomainEvent[] {
    return [...this.domainEvents];
  }

  // 이벤트 목록 초기화
  public clearEvents(): void {
    this.domainEvents = [];
  }
}
