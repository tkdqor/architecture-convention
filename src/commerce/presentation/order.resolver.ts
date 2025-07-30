import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { OrderGqlObject } from './graphql/order.graphql';
import { OrderMapper } from './mapper/order.mapper';
import {
  CreateOrderResultObject,
  CreateOrderGqlInput,
  CreateOrderItemGqlInput,
} from './graphql/create-order.graphql';
import { CreateOrderICommandHandler } from '../application/command/handler/create-order-i-command-handler';
import { CreateOrderItemICommandHandler } from '../application/command/handler/create-order-item-i-command-handler';
import { Inject } from '@nestjs/common';

@Resolver(() => OrderGqlObject)
export class OrderResolver {
  constructor(
    @Inject('CreateOrderICommandHandler')
    private readonly createOrderICommandHandler: CreateOrderICommandHandler,
    @Inject('CreateOrderItemICommandHandler')
    private readonly createOrderItemICommandHandler: CreateOrderItemICommandHandler,
  ) {}

  @Mutation(() => CreateOrderResultObject, { description: '주문 생성' })
  async createOrder(
    @Args('input') input: CreateOrderGqlInput,
  ): Promise<CreateOrderResultObject> {
    const command = OrderMapper.toCreateOrderCommand(input);
    const order = await this.createOrderICommandHandler.execute(command);
    return OrderMapper.toCreateOrderResultObject(order);
  }

  @Mutation(() => CreateOrderResultObject, { description: '주문 아이템 생성' })
  async createOrderItem(
    @Args('input') input: CreateOrderItemGqlInput,
  ): Promise<CreateOrderResultObject> {
    const command = OrderMapper.toCreateOrderItemCommand(input);
    const order = await this.createOrderItemICommandHandler.execute(command);
    return OrderMapper.toCreateOrderResultObject(order);
  }

  // TODO
  // @Query(() => GetOrderDetailGqlPayload, { description: '주문 상세 조회' })
  // async getOrderDetail(): Promise<GetOrderDetailGqlPayload> {
  //   const order = await this.getOrderDetailUseCase.execute();
  //   return OrderMapper.toGetOrderDetailGqlPayload(order);
  // }
}
