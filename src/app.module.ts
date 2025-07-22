import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { OrderResolver } from './interface/commerce/order.resolver';
import { CreateOrderUseCase } from './application/commerce/use-case/create-order.use-case';
import { OrderRepositoryImpl } from './infrastructure/commerce/repository/command/order.repository.impl';
import { Order } from './domain/commerce/entity/command/order.entity';
import { OrderItem } from './domain/commerce/entity/command/order-item.entity';
import { CreateOrderItemUseCase } from './application/commerce/use-case/CreateOrderItemUseCase';

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
  ],
})
export class AppModule {}
