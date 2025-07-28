import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import AggregateRootEntity from '../../common/entity/aggregate-root.entity';
import { IsArray, IsEnum, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { EntityValidation } from '../../common/validation/entity-validation';
import { OrderItem } from './order-item.entity';
import { OrderItemAlreadyExistsDomainException } from '../../common/exception/order-item-already-exists-domain-exception';
import { PaymentCardInfo } from '../../value-object/payment-card-info';
import { Money } from '../../value-object/money';
import { OrderPaidEvent } from '../../event/order-paid.event';
import { DomainEvent } from '../../common/event/domain-event';

export enum OrderStatusEnum {
  PLACED = 'PLACED',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

@Entity('convention_order')
export class Order extends AggregateRootEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @Column({ name: 'customer_id' })
  customerId: string; // 서로 다른 Aggregate인 경우 ID 참조

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    eager: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  items: OrderItem[];

  @IsEnum(OrderStatusEnum)
  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PLACED,
  })
  status: OrderStatusEnum;

  @Column(() => Money, { prefix: false })
  totalAmount: Money; // 모든 품목의 총합과 일치해야 함

  @Column(() => PaymentCardInfo, { prefix: false })
  paymentCardInfo: PaymentCardInfo;

  domainEvents: DomainEvent[] = [];

  // protected 생성자: TypeORM 호환성 유지 + 외부 접근 제한
  protected constructor(customerId: string) {
    super();
    this.customerId = customerId;
    // TODO: 여기서도 validateSync도 가능할듯!
  }

  // 생성자 대신 static 메서드로 엔티티 생성
  static createOrder(customerId: string): Order {
    // TODO: 모든 필드가 아닌 생성할 때의 필드을 기준으로 검증 필요!
    // TODO: plain 다시 한 번 알아보기
    const order = new Order(customerId);
    order.status = OrderStatusEnum.PLACED;
    order.items = [];
    order.totalAmount = Money.createMoney(0);
    // 타입 검증 진행
    EntityValidation.validate(
      order,
      () => new Order(''), // 빈 인스턴스 생성 함수
    );
    return order;
  }

  // 애그리거트 루트를 통한 OrderItem 추가 (일관성 유지)
  addItem(
    productId: string,
    productName: string,
    price: number,
    quantity: number,
  ): void {
    // items가 undefined인 경우 빈 배열로 초기화
    if (!this.items) {
      this.items = [];
    }

    const existingItem = this.items.find(
      (item) => item.productId === productId,
    );
    if (existingItem) {
      throw new OrderItemAlreadyExistsDomainException(productId);
    }

    const newItem = OrderItem.createOrderItem(
      this,
      productId,
      productName,
      Money.createMoney(price),
      quantity,
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
  addPaymentCardInfo(
    cardNumber: string,
    cardHolder: string,
    expiry: string,
    cvc: string,
  ): void {
    this.paymentCardInfo = PaymentCardInfo.createPaymentCardInfo(
      cardNumber,
      cardHolder,
      expiry,
      cvc,
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
