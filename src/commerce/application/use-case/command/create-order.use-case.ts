import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrderRepository } from '../../../domain/repository/command/order.repository';
import { Order, OrderStatusEnum } from '../../../domain/entity/order.entity';
import { CreateOrderUseCaseInput } from '../../use-case-input/create-order.use-case-input';
import { OrderCommandMapper } from '../../../domain/command/mapper/order-command.mapper';
import { Money } from '../../../domain/value-object/money';
import { OrderItem } from '../../../domain/entity/order-item.entity';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private dataSource: DataSource,
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(ucInput: CreateOrderUseCaseInput): Promise<{
    id: string;
    customerId: string;
    status: OrderStatusEnum;
    totalAmount: Money;
    items: OrderItem[];
    createdAt: Date;
  }> {
    const command = OrderCommandMapper.toCreateOrderCommand(ucInput);
    const entityManager = this.dataSource.manager;
    // const order = new Order(); 불가능
    const order = Order.createOrder(command.customerId);
    const savedOrder = await this.orderRepository.save(entityManager, order);

    // 객체 리터럴로 필요한 필드만 반환
    return {
      id: savedOrder.id,
      customerId: savedOrder.customerId,
      status: savedOrder.status,
      totalAmount: savedOrder.totalAmount,
      items: savedOrder.items,
      createdAt: savedOrder.createdAt,
    };
  }
}
