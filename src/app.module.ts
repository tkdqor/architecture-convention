import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ScheduleModule } from '@nestjs/schedule';
import { CreateOrderCommandHandlerImpl } from './commerce/application/command/handler/create-order-command-handler-impl';
import { OrderRepositoryImpl } from './commerce/infrastructure/repository/command/order.repository.impl';
import { Order } from './commerce/domain/entity/order.entity';
import { OrderItem } from './commerce/domain/entity/order-item.entity';
import { CreateOrderItemCommandHandlerImpl } from './commerce/application/command/handler/create-order-item-command-handler-impl';
import { OrderResolver } from './commerce/presentation/order.resolver';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'test',
      password: 'test',
      database: 'test',
      entities: [Order, OrderItem],
      logging: true, // 모든 SQL 쿼리 로깅
      logger: 'advanced-console', // 콘솔에 상세한 로그 출력
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    OrderResolver,
    {
      provide: 'CreateOrderICommandHandler',
      useClass: CreateOrderCommandHandlerImpl,
    },
    {
      provide: 'CreateOrderItemICommandHandler',
      useClass: CreateOrderItemCommandHandlerImpl,
    },
    {
      provide: 'OrderRepository',
      useClass: OrderRepositoryImpl,
    },
    {
      provide: 'OrderRepository',
      useClass: OrderRepositoryImpl,
    },
  ],
})
export class AppModule {}
