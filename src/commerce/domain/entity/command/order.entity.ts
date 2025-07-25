import { Column, Entity, OneToMany } from 'typeorm';
import AggregateRootEntity from '../../common/aggregate-root.entity';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItem } from './order-item.entity';
import { OrderStatusEnum } from '../../commerce.enum';
import { OrderItemAlreadyExistsDomainException } from '../../common/exception/order-item-already-exists-domain-exception';
import { PaymentCardInfo } from '../../value-object/payment-card-info';

@Entity('convention_order')
export class Order extends AggregateRootEntity {
  @IsString()
  @Column({ name: 'customer_id' })
  customerId: string; // 서로 다른 Aggregate인 경우 ID 참조

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
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

  @IsNumber()
  @Min(0)
  @Column({ name: 'total_amount', type: 'bigint', comment: '총 주문 금액' })
  totalAmount: number = 0; // 모든 품목의 총합과 일치해야 함

  @Column(() => PaymentCardInfo, { prefix: false })
  paymentCardInfo: PaymentCardInfo;

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
      (item) => item.getProductId() === productId,
    );
    if (existingItem) {
      throw new OrderItemAlreadyExistsDomainException(productId);
    }

    const newItem = OrderItem.createOrderItem(
      this,
      productId,
      productName,
      price,
      quantity,
    );
    this.items.push(newItem);
    this.updateTotalAmount(newItem);

    this.setStatus(OrderStatusEnum.PAID);
  }

  // 애그리거트의 불변식을 지키는 내부 메서드
  private updateTotalAmount(newItem: OrderItem): void {
    this.totalAmount += newItem.getPrice() * newItem.getQuantity();
  }

  public getItems(): OrderItem[] {
    return this.items;
  }

  public getId(): string {
    return this.id;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getCustomerId(): string {
    return this.customerId;
  }

  public getTotalAmount(): number {
    return this.totalAmount;
  }

  public getStatus(): OrderStatusEnum {
    return this.status;
  }

  public setStatus(status: OrderStatusEnum): void {
    this.status = status;
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
  }
}
