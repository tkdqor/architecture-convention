import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrderRepository } from '../../../domain/commerce/repository/order.repository';
import { Order } from '../../../domain/commerce/entity/order.entity';

@Injectable()
export class CreateOrderItemUseCase {
  constructor(
    private dataSource: DataSource,
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(): Promise<Order> {
    const entityManager = this.dataSource.manager;
    const orderId = '61eebd15-a028-4220-a2b3-9885ca307060';
    const order = await this.orderRepository.getById(entityManager, orderId);
    order.addItem('test', 'test', 1000, 2);
    return await this.orderRepository.save(entityManager, order);
  }
}
