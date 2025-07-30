import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrderRepository } from '../../../domain/repository/order.repository';
import { Order } from '../../../domain/entity/order.entity';
import { CreateOrderCommand } from '../dto/create-order.command';
import { CreateOrderCommandHandler } from './create-order-command-handler';

@Injectable()
export class CreateOrderCommandHandlerImpl
  implements CreateOrderCommandHandler
{
  constructor(
    private dataSource: DataSource,
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(command: CreateOrderCommand): Promise<Order> {
    const entityManager = this.dataSource.manager;
    const order = Order.createOrder({ customerId: command.customerId });
    return await this.orderRepository.save(entityManager, order);
  }
}
