import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrderRepository } from '../../../domain/repository/command/order.repository';
import { Order } from '../../../domain/entity/order.entity';
import { CreateOrderItemUseCaseInput } from '../../use-case-input/create-order-item.use-case-input';
import { OrderCommandMapper } from '../../../domain/command/mapper/order-command.mapper';
import { OrderOutboxRepository } from '../../../domain/repository/command/order-outbox.repository';
import { OutboxEventPublisher } from '../../../infrastructure/outbox/outbox-event-publisher';

@Injectable()
export class CreateOrderItemUseCase {
  constructor(
    private dataSource: DataSource,
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
    @Inject('OrderOutboxRepository')
    private readonly orderOutboxRepository: OrderOutboxRepository,
    private readonly outboxEventPublisher: OutboxEventPublisher,
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

      // TODO: 공통로직? 인프라 레이어에서 진행? ex. orderReposiotry.save 진행할 때 진행? ex) AOP 어노테이션?
      // 도메인 이벤트를 Outbox에 저장
      if (domainEvents.length > 0) {
        await this.orderOutboxRepository.save(entityManager, domainEvents);
        // 이벤트 저장 후 엔티티에서 이벤트 목록 클리어
        order.clearEvents();
      }

      return savedOrder;

      // TODO: 로그 메시지를 MDException과 DomainException을 나눈 케이스
      // try {
      //   // ...
      // } catch (error) {
      //   // instanceof로 예외 타입 구분하여 로깅
      //   if (error instanceof ApplicationException) {
      //     this.logger.error(error.getLogMessage());
      //     // 출력: [DOMAIN-EXCEPTION] ORDER_ITEM_ALREADY_EXISTS | order item with id test already exists
      //   } else if (error instanceof MDException) {
      //     this.logger.warn(error.getLogMessage());
      //     // 출력: [MD-EXCEPTION] Some general error message
      //   } else {
      //     this.logger.error(`[UNEXPECTED-ERROR] ${error.message}`, error.stack);
      //   }
      // }
    });
  }
}
