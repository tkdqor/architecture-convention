import { Resolver, Mutation, Query } from '@nestjs/graphql';
import { CreateOrderUseCase } from '../../application/commerce/use-case/create-order.use-case';
import { OrderGqlObject } from './graphql/order.graphql';
import { OrderMapper } from './mapper/order.mapper';
import { CreateOrderItemUseCase } from '../../application/commerce/use-case/CreateOrderItemUseCase';

@Resolver(() => OrderGqlObject)
export class OrderResolver {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly createOrderItemUseCase: CreateOrderItemUseCase,
  ) {}

  @Query(() => String, { description: 'GraphQL 연결 테스트용 쿼리' })
  hello(): string {
    return 'Hello GraphQL!';
  }

  @Mutation(() => OrderGqlObject, { description: '주문 생성' })
  async createOrder(): Promise<OrderGqlObject> {
    const order = await this.createOrderUseCase.execute();
    return OrderMapper.toGqlObject(order);
  }

  @Mutation(() => OrderGqlObject, { description: '주문 아이템 생성' })
  async createOrderItem(): Promise<OrderGqlObject> {
    const order = await this.createOrderItemUseCase.execute();
    return OrderMapper.toGqlObject(order);
  }
}
