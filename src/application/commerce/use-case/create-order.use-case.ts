import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrderRepository } from '../../../domain/commerce/repository/order.repository';
import { Order } from '../../../domain/commerce/entity/order.entity';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private dataSource: DataSource,
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(): Promise<Order> {
    const entityManager = this.dataSource.manager;
    const customerId = 'test';
    const order = Order.createOrder(customerId);
    return await this.orderRepository.save(entityManager, order);
  }
}
