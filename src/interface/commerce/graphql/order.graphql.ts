import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Expose, plainToClass, Type } from 'class-transformer';

export enum OrderStatusGqlEnum {
  PLACED = 'PLACED',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

registerEnumType(OrderStatusGqlEnum, {
  name: 'OrderStatus',
  description: '주문 상태',
});

@ObjectType('OrderItem')
export class OrderItemGqlObject {
  constructor(partial?: Partial<OrderItemGqlObject>) {
    if (partial) {
      Object.assign(
        this,
        plainToClass(OrderItemGqlObject, partial, {
          excludeExtraneousValues: true,
        }),
      );
    }
  }

  @Expose()
  @Field(() => ID, { description: '주문 아이템 ID' })
  id: string;

  @Expose()
  @Field(() => String, { description: '상품 ID' })
  productId: string;

  @Expose()
  @Field(() => String, { description: '상품명' })
  productName: string;

  @Expose()
  @Field(() => Number, { description: '상품 가격' })
  price: number;

  @Expose()
  @Field(() => Number, { description: '주문 수량' })
  quantity: number;
}

@ObjectType('Order')
export class OrderGqlObject {
  constructor(partial?: Partial<OrderGqlObject>) {
    if (partial) {
      Object.assign(
        this,
        plainToClass(OrderGqlObject, partial, {
          excludeExtraneousValues: true,
        }),
      );
    }
  }

  @Expose()
  @Field(() => ID, { description: '주문 ID' })
  id: string;

  @Expose()
  @Field(() => String, { description: '고객 ID' })
  customerId: string;

  @Expose()
  @Field(() => OrderStatusGqlEnum, { description: '주문 상태' })
  status: OrderStatusGqlEnum;

  @Expose()
  @Field(() => Number, { description: '총 주문 금액' })
  totalAmount: number;

  @Type(() => OrderItemGqlObject)
  @Expose()
  @Field(() => [OrderItemGqlObject], {
    description: '주문 아이템 목록',
    nullable: true,
  })
  items: OrderItemGqlObject[] | null;
}
