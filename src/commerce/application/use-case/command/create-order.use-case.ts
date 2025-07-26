import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrderRepository } from '../../../domain/repository/command/order.repository';
import { Order } from '../../../domain/entity/command/order.entity';
import { CreateOrderUseCaseInput } from '../../use-case-input/create-order.use-case-input';
import { OrderCommandMapper } from '../../../domain/command/mapper/order-command.mapper';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private dataSource: DataSource,
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(ucInput: CreateOrderUseCaseInput): Promise<Order> {
    const command = OrderCommandMapper.toCreateOrderCommand(ucInput);
    const entityManager = this.dataSource.manager;
    // const order = new Order(); 불가능
    const order = Order.createOrder(command.customerId);
    return await this.orderRepository.save(entityManager, order);
  }
}
