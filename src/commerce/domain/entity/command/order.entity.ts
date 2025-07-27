import { Column, Entity, OneToMany } from 'typeorm';
import AggregateRootEntity from '../../common/aggregate-root.entity';
import { IsArray, IsEnum, IsString, ValidateNested, validateSync } from 'class-validator';
import { Type } from 'class-transformer';
import { validate } from 'class-validator';
import { OrderItem } from './order-item.entity';
import { OrderStatusEnum } from '../../commerce.enum';
import { OrderItemAlreadyExistsDomainException } from '../../common/exception/order-item-already-exists-domain-exception';
import { PaymentCardInfo } from '../../value-object/payment-card-info';
import { Money } from '../../value-object/money';
import { OrderPaidEvent } from '../../event/order-paid.event';
import { DomainEvent } from '../../common/event/domain-event';

@Entity('convention_order')
export class Order extends AggregateRootEntity {
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
  }

  // 생성자 대신 static 메서드로 엔티티 생성
  static createOrder(customerId: string): Order {
    const order = new Order(customerId);
    order.status = OrderStatusEnum.PLACED;
    order.items = [];
    order.totalAmount = Money.createMoney(0);
    // 타입 검증 진행
    order.validateOrder();
    return order;
  }

  // 검증 로직을 분리한 private 메서드
  private validateOrder() {
    // 검증을 위한 검증용 객체 생성 (Object.assign 사용)
    const validationObject = Object.assign(new Order(''), this);

    // class-validator로 검증 실행
    const errors = validateSync(validationObject);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat()
        .join(', ');
      throw new Error(`Order validation failed: ${errorMessages}`);
    }
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

  // 카드 결제 정보 추가
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
