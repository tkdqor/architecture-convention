import { OrderOutboxRepository } from '../../../domain/repository/order-outbox.repository';
import { EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { DomainEvent } from '../../../../common/domain/event/domain-event';
import {
  OrderOutboxEntity,
  OutboxStatus,
} from '../../../domain/entity/order-outbox.entity';

export class OrderOutboxRepositoryImpl implements OrderOutboxRepository {
  async save(
    entityManager: EntityManager,
    events: DomainEvent[],
  ): Promise<void> {
    const outboxEntities = events.map((event) =>
      OrderOutboxEntity.fromDomainEvent(event),
    );
    await entityManager.save(OrderOutboxEntity, outboxEntities);
  }

  async findPendingEvent(
    entityManager: EntityManager,
    eventType: string,
  ): Promise<OrderOutboxEntity | null> {
    const where: FindOptionsWhere<OrderOutboxEntity> = {
      status: OutboxStatus.PENDING,
    };
    if (eventType) {
      where.eventType = eventType;
    }
    return await entityManager.findOne(OrderOutboxEntity, {
      where,
      order: { createdAt: 'ASC' } as FindOptionsOrder<OrderOutboxEntity>,
    });
  }

  async markAsPublished(
    entityManager: EntityManager,
    eventId: string,
  ): Promise<void> {
    await entityManager.update(
      OrderOutboxEntity,
      { eventId },
      {
        status: OutboxStatus.PUBLISHED,
        updatedAt: new Date(),
      },
    );
  }

  async markAsFailed(
    entityManager: EntityManager,
    eventId: string,
  ): Promise<void> {
    await entityManager.update(
      OrderOutboxEntity,
      { eventId },
      {
        status: OutboxStatus.FAILED,
        updatedAt: new Date(),
      },
    );
  }
}
