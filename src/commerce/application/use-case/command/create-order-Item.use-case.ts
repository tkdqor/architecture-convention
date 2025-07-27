import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrderRepository } from '../../../domain/repository/command/order.repository';
import { Order } from '../../../domain/entity/command/order.entity';
import { CreateOrderItemUseCaseInput } from '../../use-case-input/create-order-item.use-case-input';
import { OrderCommandMapper } from '../../../domain/command/mapper/order-command.mapper';
import { OrderOutboxRepository } from '../../../domain/repository/command/order-outbox.repository';
import { OutboxEventPublisher } from '../../../infrastructure/outbox/outbox-event-publisher'; // 클래스 이름 변경 반영

@Injectable()
export class CreateOrderItemUseCase {
  constructor(
    private dataSource: DataSource,
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
    @Inject('OrderOutboxRepository')
    private readonly orderOutboxRepository: OrderOutboxRepository,
    private readonly outboxEventPublisher: OutboxEventPublisher, // 주입 이름 및 타입 변경
  ) {}

  async execute(ucInput: CreateOrderItemUseCaseInput): Promise<Order> {
    return await this.dataSource.transaction(async (entityManager) => {
      const command = OrderCommandMapper.toCreateOrderItemCommand(ucInput);
      const order = await this.orderRepository.getById(
        entityManager,
        command.orderId,
      );

      order.addItem('test', 'test', 1000, 2);
      // 카드 결제 정보 추가(request로 결제 정보 받았다고 가정)
      order.addPaymentCardInfo('1111-1111-1111-1111', 'asdf', '27/03', '333');

      // 발생한 도메인 이벤트 확인
      const domainEvents = order.getRaisedEventList();

      const savedOrder = await this.orderRepository.save(entityManager, order);

      // 도메인 이벤트를 Outbox에 저장
      if (domainEvents.length > 0) {
        await this.orderOutboxRepository.save(entityManager, domainEvents);
        // 이벤트 저장 후 엔티티에서 이벤트 목록 클리어
        order.clearEvents();
      }

      // Outbox에 저장된 걸 확인 후 트리거 진행
      // 트랜잭션이 커밋된 후에 실행되도록 setImmediate 사용
      setImmediate(() => {
        this.outboxEventPublisher.startPollingForOrderPaidEvents(); // 호출 클래스명 및 메서드 이름 변경 반영
      });

      return savedOrder;
    });
  }
}
