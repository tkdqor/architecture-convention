import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { OrderGqlObject } from './graphql/order.graphql';
import { OrderMapper } from './mapper/order.mapper';
import {
  CreateOrderResultObject,
  CreateOrderGqlInput,
  CreateOrderItemGqlInput,
} from './graphql/create-order.graphql';
import { CreateOrderCommandHandler } from '../application/handler/create-order-command-handler';
import { CreateOrderItemCommandHandler } from '../application/handler/create-order-item-command-handler';
import { Inject } from '@nestjs/common';

@Resolver(() => OrderGqlObject)
export class OrderResolver {
  constructor(
    @Inject('CreateOrderICommandHandler')
    private readonly createOrderCommandHandler: CreateOrderCommandHandler,
    @Inject('CreateOrderItemICommandHandler')
    private readonly createOrderItemCommandHandler: CreateOrderItemCommandHandler,
  ) {}

  @Mutation(() => CreateOrderResultObject, { description: '주문 생성' })
  async createOrder(
    @Args('input') input: CreateOrderGqlInput,
  ): Promise<CreateOrderResultObject> {
    const command = OrderMapper.toCreateOrderCommand(input);
    const order = await this.createOrderCommandHandler.execute(command);
    return OrderMapper.toCreateOrderResultObject(order);
  }

  @Mutation(() => CreateOrderResultObject, { description: '주문 아이템 생성' })
  async createOrderItem(
    @Args('input') input: CreateOrderItemGqlInput,
  ): Promise<CreateOrderResultObject> {
    const command = OrderMapper.toCreateOrderItemCommand(input);
    const order = await this.createOrderItemCommandHandler.execute(command);
    return OrderMapper.toCreateOrderResultObject(order);
  }

  // GraphQL 스키마 생성을 위해 필요
  @Query(() => String, { description: '임시 쿼리' })
  healthCheck(): string {
    return 'Server is running!';
  }

  // TODO
  // @Query(() => GetOrderDetailGqlPayload, { description: '주문 상세 조회' })
  // async getOrderDetail(): Promise<GetOrderDetailGqlPayload> {
  //   const order = await this.getOrderDetailUseCase.execute();
  //   return OrderMapper.toGetOrderDetailGqlPayload(order);
  // }
}
