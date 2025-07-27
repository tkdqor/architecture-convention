import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { OrderResolver } from './commerce/interface/order.resolver';
import { CreateOrderUseCase } from './commerce/application/use-case/command/create-order.use-case';
import { OrderRepositoryImpl } from './commerce/infrastructure/repository/command/order.repository.impl';
import { Order } from './commerce/domain/entity/command/order.entity';
import { OrderItem } from './commerce/domain/entity/command/order-item.entity';
import { CreateOrderItemUseCase } from './commerce/application/use-case/command/create-order-Item.use-case';
import { GetOrderDetailUseCase } from './commerce/application/use-case/query/get-order-detail.use-case';
import { OrderReadModelRepositoryImpl } from './commerce/infrastructure/repository/query/order-read-model.repository.impl';
import { OrderOutboxRepositoryImpl } from './commerce/infrastructure/repository/command/order-outbox.repository.impl';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'test',
      password: 'test',
      database: 'test',
      entities: [Order, OrderItem],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true, // 자동으로 스키마 파일 생성
      playground: true, // GraphQL Playground 활성화
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    OrderResolver,
    CreateOrderUseCase,
    {
      provide: 'OrderRepository',
      useClass: OrderRepositoryImpl,
    },
    CreateOrderItemUseCase,
    {
      provide: 'OrderRepository',
      useClass: OrderRepositoryImpl,
    },
    {
      provide: 'OrderOutboxRepository',
      useClass: OrderOutboxRepositoryImpl,
    },
    GetOrderDetailUseCase,
    {
      provide: 'OrderReadModelRepository',
      useClass: OrderReadModelRepositoryImpl,
    },
  ],
})
export class AppModule {}
