import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import AggregateRootEntity from '../../../../common/domain/entity/aggregate-root.entity';
import { IsArray, IsEnum, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { OrderItem } from './order-item.entity';
import { OrderItemAlreadyExistsDomainException } from '../exception/order-item-already-exists-domain-exception';
import { PaymentCardInfo } from '../value-object/payment-card-info';
import { Money } from '../value-object/money';
import { OrderPaidEvent } from '../event/order-paid.event';
import { DomainEvent } from '../../../../common/domain/event/domain-event';
import { plainToClassWithValidation } from '../../../../common/validation/utils';

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

@Entity('convention_order')
export class Order extends AggregateRootEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose()
  @IsString()
  @Column({ name: 'customer_id' })
  customerId: string; // 서로 다른 Aggregate인 경우 ID 참조

  @Expose()
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    eager: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  items: OrderItem[];

  @Expose()
  @IsEnum(OrderStatusEnum)
  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PLACED,
  })
  status: OrderStatusEnum;

  @Expose()
  @Column(() => Money, { prefix: false })
  totalAmount: Money; // 모든 품목의 총합과 일치해야 함

  @Expose()
  @Column(() => PaymentCardInfo, { prefix: false })
  paymentCardInfo: PaymentCardInfo;

  @Expose()
  domainEvents: DomainEvent[] = [];

  constructor() {
    super();
  }

  // 생성자 대신 static 메서드로 엔티티 생성
  static createOrder(params: CreateOrderParams): Order {
    const order = new Order();
    order.status = OrderStatusEnum.PLACED;
    order.items = [];
    order.totalAmount = Money.createMoney(0);
    order.customerId = params.customerId;

    // 타입 검증과 함께 Order 인스턴스 생성
    return plainToClassWithValidation(Order, order, {
      excludeExtraneousValues: true,
    });
  }

  // 애그리거트 루트를 통한 OrderItem 추가 (일관성 유지)
  addItem(params: CreateOrderItemParams): void {
    // items가 undefined인 경우 빈 배열로 초기화
    if (!this.items) {
      this.items = [];
    }

    const existingItem = this.items.find(
      (item) => item.productId === params.productId,
    );
    if (existingItem) {
      throw new OrderItemAlreadyExistsDomainException(params.productId);
    }

    const newItem = OrderItem.createOrderItem(
      this,
      params.productId,
      params.productName,
      Money.createMoney(params.price),
      params.quantity,
    );
    this.items.push(newItem);
    this.updateTotalAmount(newItem);
  }

  // 애그리거트의 불변식을 지키는 내부 메서드
  private updateTotalAmount(newItem: OrderItem): void {
    const itemTotal = newItem.price.multiply(newItem.quantity);
    this.totalAmount = this.totalAmount.add(itemTotal);
  }

  // 카드 결제 정보 추가 >>> domain event 예시 코드 추가
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
