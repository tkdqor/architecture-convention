import { Resolver, Mutation, Query } from '@nestjs/graphql';
import { CreateOrderUseCase } from '../../application/commerce/use-case/create-order.use-case';
import { OrderGqlObject } from './graphql/order.graphql';
import { OrderMapper } from './mapper/order.mapper';

@Resolver(() => OrderGqlObject)
export class OrderResolver {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

  @Query(() => String, { description: 'GraphQL 연결 테스트용 쿼리' })
  hello(): string {
    return 'Hello GraphQL!';
  }

  @Mutation(() => OrderGqlObject, { description: '주문 생성' })
  async createOrder(): Promise<OrderGqlObject> {
    const order = await this.createOrderUseCase.execute();
    return OrderMapper.toGqlObject(order);
  }
}
