import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Expose, plainToClass, Type } from 'class-transformer';
import { OrderStatusGqlEnum } from './order.graphql';
import { IsString } from 'class-validator';

@InputType('CreateOrderInput')
export class CreateOrderGqlInput {
  @IsString()
  @Expose()
  @Field(() => ID, { description: '유저 ID' })
  customerId: string;
}

@InputType('CreateOrderItemGqlInput')
export class CreateOrderItemGqlInput {
  @IsString()
  @Expose()
  @Field(() => ID, { description: '주문 ID' })
  orderId: string;
}

@ObjectType('OrderItemGqlPayload')
export class CreateOrderItemGqlPayload {
  constructor(partial?: Partial<CreateOrderItemGqlPayload>) {
    if (partial) {
      Object.assign(
        this,
        plainToClass(CreateOrderItemGqlPayload, partial, {
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

@ObjectType('CreateOrderGqlPayload')
export class CreateOrderGqlPayload {
  constructor(partial?: Partial<CreateOrderGqlPayload>) {
    if (partial) {
      Object.assign(
        this,
        plainToClass(CreateOrderGqlPayload, partial, {
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

  @Type(() => CreateOrderItemGqlPayload)
  @Expose()
  @Field(() => [CreateOrderItemGqlPayload], {
    description: '주문 아이템 목록',
    nullable: true,
  })
  items: CreateOrderItemGqlPayload[] | null;
}
