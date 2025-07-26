import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrderRepository } from '../../../../domain/commerce/repository/command/order.repository';
import { Order } from '../../../../domain/commerce/entity/command/order.entity';
import { CreateOrderItemUseCaseInput } from '../../use-case-input/create-order-item.use-case-input';
import { OrderCommandMapper } from '../../../../domain/commerce/command/mapper/order-command.mapper';

@Injectable()
export class CreateOrderItemUseCase {
  constructor(
    private dataSource: DataSource,
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(ucInput: CreateOrderItemUseCaseInput): Promise<Order> {
    const command = OrderCommandMapper.toCreateOrderItemCommand(ucInput);
    const entityManager = this.dataSource.manager;
    const order = await this.orderRepository.getById(
      entityManager,
      command.orderId,
    );
    order.addItem('test', 'test', 1000, 2);
    // 카드 결제 정보 추가(request로 결제 정보 받았다고 가정)
    order.addPaymentCardInfo('1111-1111-1111-1111', 'asdf', '27/03', '333');
    return await this.orderRepository.save(entityManager, order);
  }
}
