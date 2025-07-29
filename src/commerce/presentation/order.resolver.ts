import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { OrderGqlObject } from './graphql/order.graphql';
import { OrderMapper } from './mapper/order.mapper';
import {
  CreateOrderGqlPayload,
  CreateOrderGqlInput,
  CreateOrderItemGqlInput,
} from './graphql/create-order.graphql';
import { GetOrderDetailGqlPayload } from './graphql/get-order.graphql';
import { GetOrderDetailUseCase } from '../application/query/handler/get-order-detail.use-case';
import { CreateOrderICommandHandler } from '../application/command/handler/create-order-i-command-handler';
import { CreateOrderItemICommandHandler } from '../application/command/handler/create-order-item-i-command-handler';

@Resolver(() => OrderGqlObject)
export class OrderResolver {
  constructor(
    private readonly createOrderICommandHandler: CreateOrderICommandHandler,
    private readonly createOrderItemICommandHandler: CreateOrderItemICommandHandler,
    private readonly getOrderDetailUseCase: GetOrderDetailUseCase,
  ) {}

  @Mutation(() => CreateOrderGqlPayload, { description: '주문 생성' })
  async createOrder(
    @Args('input') input: CreateOrderGqlInput,
  ): Promise<CreateOrderGqlPayload> {
    const command = OrderMapper.toCreateOrderCommand(input);
    const orderResponse =
      await this.createOrderICommandHandler.execute(command);
    return OrderMapper.toCreateOrderGqlPayload(orderResponse);
  }

  @Mutation(() => CreateOrderGqlPayload, { description: '주문 아이템 생성' })
  async createOrderItem(
    @Args('input') input: CreateOrderItemGqlInput,
  ): Promise<CreateOrderGqlPayload> {
    const command = OrderMapper.toCreateOrderItemCommand(input);
    const order = await this.createOrderItemICommandHandler.execute(command);
    return OrderMapper.toCreateOrderGqlPayload(order);
  }

  @Query(() => GetOrderDetailGqlPayload, { description: '주문 상세 조회' })
  async getOrderDetail(): Promise<GetOrderDetailGqlPayload> {
    const order = await this.getOrderDetailUseCase.execute();
    return OrderMapper.toGetOrderDetailGqlPayload(order);
  }
}
