import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Expose, plainToClass, Type } from 'class-transformer';
import { OrderStatusGqlEnum } from './order.graphql';

@ObjectType('GetOrderItemDetailGqlPayload')
export class GetOrderItemDetailGqlPayload {
  constructor(partial?: Partial<GetOrderItemDetailGqlPayload>) {
    if (partial) {
      Object.assign(
        this,
        plainToClass(GetOrderItemDetailGqlPayload, partial, {
          excludeExtraneousValues: true,
        }),
      );
    }
  }

  @Expose()
  @Field(() => ID, { description: '주문 아이템 ID' })
  id: string;

  @Expose()
  @Field(() => ID, { description: '주문 ID' })
  orderId: string;

  @Expose()
  @Field(() => ID, { description: '상품 ID' })
  productId: string;

  @Expose()
  @Field(() => Number, { description: '주문 아이템 가격' })
  price: number;

  @Expose()
  @Field(() => Number, { description: '주문 아이템 수량' })
  quantity: number;

  @Expose()
  @Field(() => Number, { description: '주문 아이템 총 가격' })
  totalAmount: number;

  @Expose()
  @Field(() => Date, { description: '주문 아이템 생성일' })
  createdAt: Date;

  @Expose()
  @Field(() => Date, { description: '주문 아이템 수정일' })
  updatedAt: Date;
}

@ObjectType('GetOrderDetailGqlPayload')
export class GetOrderDetailGqlPayload {
  constructor(partial?: Partial<GetOrderDetailGqlPayload>) {
    if (partial) {
      Object.assign(
        this,
        plainToClass(GetOrderDetailGqlPayload, partial, {
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

  @Type(() => GetOrderItemDetailGqlPayload)
  @Expose()
  @Field(() => [GetOrderItemDetailGqlPayload], {
    description: '주문 아이템 목록',
    nullable: true,
  })
  items: GetOrderItemDetailGqlPayload[] | null;

  @Expose()
  @Field(() => Number, { description: '주문 아이템 갯수' })
  itemCount: number;

  @Expose()
  @Field(() => Date, { description: '주문 생성일' })
  createdAt: Date;

  @Expose()
  @Field(() => Date, { description: '주문 수정일' })
  updatedAt: Date;
}
