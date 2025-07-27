import { OrderOutboxRepository } from '../../../domain/repository/command/order-outbox.repository';
import { EntityManager } from 'typeorm';
import { DomainEvent } from '../../../domain/common/event/domain-event';
import { OrderOutboxEntity } from '../../../domain/entity/command/order-outbox.entity';

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
}
