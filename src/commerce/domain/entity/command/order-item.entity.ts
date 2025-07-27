import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import SubDomainEntity from '../../common/sub-domain.entity';
import { IsNumber, IsString, Min } from 'class-validator';
import { OrderItemValidationDomainException } from '../../common/exception/order-item-validation-domain-exception';
import { Order } from './order.entity';
import { Money } from '../../value-object/money';
import { EntityValidation } from '../../common/validation/entity-validation';

@Entity('convention_order_item')
export class OrderItem extends SubDomainEntity {
  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @IsString()
  @Column({ name: 'product_id' })
  productId: string;

  @IsString()
  @Column({ name: 'product_name' })
  productName: string;

  @Column(() => Money, { prefix: false })
  price: Money;

  @IsNumber()
  @Min(0)
  @Column({ type: 'bigint', comment: '주문 상품 수량' })
  quantity: number;

  static createOrderItem(
    order: Order,
    productId: string,
    productName: string,
    price: Money,
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
    if (price.value < 0) {
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

    // 타입 검증 진행
    EntityValidation.validate(orderItem, () => new OrderItem());

    return orderItem;
  }
}
