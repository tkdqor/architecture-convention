import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrderRepository } from '../../domain/repository/order.repository';
import { PureOrder } from '../../domain/entity/pure-order';
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

  async execute(command: CreateOrderCommand): Promise<PureOrder> {
    const entityManager = this.dataSource.manager;
    const order = PureOrder.createOrder({ customerId: command.customerId });
    return await this.orderRepository.save(entityManager, order);
  }
}
