import { Injectable, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrderRepository } from '../../../domain/repository/order.repository';
import { Order, OrderStatusEnum } from '../../../domain/entity/order.entity';
import { CreateOrderCommand } from '../dto/create-order.command';
import { Money } from '../../../domain/value-object/money';
import { OrderItem } from '../../../domain/entity/order-item.entity';
import { CreateOrderICommandHandler } from './create-order-i-command-handler';

@Injectable()
export class CreateOrderCommandHandlerImpl
  implements CreateOrderICommandHandler
{
  constructor(
    private dataSource: DataSource,
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(command: CreateOrderCommand): Promise<{
    id: string;
    customerId: string;
    status: OrderStatusEnum;
    totalAmount: Money;
    items: OrderItem[];
    createdAt: Date;
  }> {
    const entityManager = this.dataSource.manager;
    // const order = new Order(); 불가능
    const order = Order.createOrder({ customerId: command.customerId });
    const savedOrder = await this.orderRepository.save(entityManager, order);

    // 객체 리터럴로 필요한 필드만 반환
    return {
      // TODO: result객체만 응답(보수적)
      // TODO: (협의되었을 때) >>> command에선 성공/실패만 응답 + 아이디 정도? 왜냐면 그 아이디로 조회할 수 있으니까! > FE에서 필요하면 조회하는 것 > 물론 FE와의 협의가 필요함!
      // TODO: (협의 X) >>> result 객체로 감싸기 > 내부에서 사용되는 필드는 엔티티로...
      id: savedOrder.id,
      customerId: savedOrder.customerId,
      status: savedOrder.status,
      totalAmount: savedOrder.totalAmount,
      items: savedOrder.items,
      createdAt: savedOrder.createdAt,
    };
  }
}
