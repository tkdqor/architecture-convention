import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { CreateOrderUseCase } from '../../application/commerce/use-case/command/create-order.use-case';
import { OrderGqlObject } from './graphql/order.graphql';
import { OrderMapper } from './mapper/order.mapper';
import { CreateOrderItemUseCase } from '../../application/commerce/use-case/command/create-order-Item.use-case';
import {
  CreateOrderGqlPayload,
  CreateOrderGqlInput, CreateOrderItemGqlInput,
} from './graphql/create-order.graphql';
import { GetOrderDetailGqlPayload } from './graphql/get-order.graphql';
import { GetOrderDetailUseCase } from '../../application/commerce/use-case/query/get-order-detail.use-case';

@Resolver(() => OrderGqlObject)
export class OrderResolver {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly createOrderItemUseCase: CreateOrderItemUseCase,
    private readonly getOrderDetailUseCase: GetOrderDetailUseCase,
  ) {}

  @Mutation(() => CreateOrderGqlPayload, { description: '주문 생성' })
  async createOrder(
    @Args('input') input: CreateOrderGqlInput,
  ): Promise<CreateOrderGqlPayload> {
    const ucInput = OrderMapper.toCreateOrderUseCaseInput(input);
    const order = await this.createOrderUseCase.execute(ucInput);
    return OrderMapper.toCreateOrderGqlPayload(order);
  }

  @Mutation(() => CreateOrderGqlPayload, { description: '주문 아이템 생성' })
  async createOrderItem(
    @Args('input') input: CreateOrderItemGqlInput,
  ): Promise<CreateOrderGqlPayload> {
    const ucInput = OrderMapper.toCreateOrderItemUseCaseInput(input);
    const order = await this.createOrderItemUseCase.execute(ucInput);
    return OrderMapper.toCreateOrderGqlPayload(order);
  }

  @Query(() => GetOrderDetailGqlPayload, { description: '주문 상세 조회' })
  async getOrderDetail(): Promise<GetOrderDetailGqlPayload> {
    const order = await this.getOrderDetailUseCase.execute();
    return OrderMapper.toGetOrderDetailGqlPayload(order);
  }
}
