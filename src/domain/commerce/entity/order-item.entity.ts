import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import SubDomainEntity from '../../common/sub-domain.entity';
import { IsNumber, IsString, Min } from 'class-validator';
import { OrderItemValidationDomainException } from '../../common/exception/order-item-validation-domain-exception';
import { Order } from './order.entity';

@Entity('convention_order_item')
export class OrderItem extends SubDomainEntity {
  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order; // TypeORM 관계 매핑을 위해 public으로 설정

  @IsString()
  @Column({ name: 'product_id' })
  private productId: string;

  @IsString()
  @Column({ name: 'product_name' })
  private productName: string;

  @IsNumber()
  @Min(0)
  @Column({ type: 'bigint', comment: '주문 상품 금액' })
  private price: number;

  @IsNumber()
  @Min(0)
  @Column({ type: 'bigint', comment: '주문 상품 수량' })
  private quantity: number;

  static createOrderItem(
    order: Order,
    productId: string,
    productName: string,
    price: number,
    quantity: number,
  ): OrderItem {
    // 필수 값 존재 여부 검사
    if (!productId || productId.trim() === '') {
      throw new OrderItemValidationDomainException('productId is not valid');
    }

    if (!productName || productName.trim() === '') {
      throw new OrderItemValidationDomainException('productName is not valid');
    }

    if (price === null || price === undefined) {
      throw new OrderItemValidationDomainException('price is not valid');
    }

    if (quantity === null || quantity === undefined) {
      throw new OrderItemValidationDomainException('quantity is not valid');
    }

    // 값의 유효성 검사
    if (price < 0) {
      throw new OrderItemValidationDomainException('price is not valid');
    }

    if (quantity < 0) {
      throw new OrderItemValidationDomainException('quantity is not valid');
    }

    // orderItem 생성
    const orderItem = new OrderItem();
    orderItem.order = order;
    orderItem.productId = productId;
    orderItem.productName = productName;
    orderItem.price = price;
    orderItem.quantity = quantity;

    return orderItem;
  }

  getId(): string {
    return this.id;
  }

  getProductId(): string {
    return this.productId;
  }

  getProductName(): string {
    return this.productName;
  }

  getPrice(): number {
    return this.price;
  }

  getQuantity(): number {
    return this.quantity;
  }
}
