import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrderRepository } from '../../../domain/repository/order.repository';
import { Order } from '../../../domain/entity/order.entity';
import { CreateOrderItemCommand } from '../dto/create-order-item.command';
import { OrderOutboxRepository } from '../../../domain/repository/order-outbox.repository';
import { OutboxEventPublisher } from '../../../infrastructure/outbox/outbox-event-publisher';
import { CreateOrderItemICommandHandler } from './create-order-item-i-command-handler';

@Injectable()
export class CreateOrderItemCommandHandlerImpl
  implements CreateOrderItemICommandHandler
{
  constructor(
    private dataSource: DataSource,
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
    @Inject('OrderOutboxRepository')
    private readonly orderOutboxRepository: OrderOutboxRepository,
    private readonly outboxEventPublisher: OutboxEventPublisher,
  ) {}

  async execute(command: CreateOrderItemCommand): Promise<Order> {
    return await this.dataSource.transaction(async (entityManager) => {
      const order = await this.orderRepository.getById(
        entityManager,
        command.orderId,
      );

      // item 정보 및 카드 결제 정보 추가(request로 받았다고 가정)
      order.addItem({
        productId: 'test',
        productName: 'test',
        price: 1000,
        quantity: 2,
      });
      order.addPaymentCardInfo({
        cardNumber: '1111-1111-1111-1111',
        cardHolder: 'asdf',
        expiry: '27/03',
        cvc: '333',
      });
      return await this.orderRepository.save(entityManager, order);
    });
  }
}
