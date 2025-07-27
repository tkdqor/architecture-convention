import { EntityManager } from 'typeorm';
import { DomainEvent } from '../../common/event/domain-event';
import { OrderOutboxEntity } from '../../entity/command/order-outbox.entity';

export interface OrderOutboxRepository {
  save(entityManager: EntityManager, events: DomainEvent[]): Promise<void>;
  findPendingEvent(
    entityManager: EntityManager,
    eventType: string,
  ): Promise<OrderOutboxEntity | null>;
  markAsPublished(entityManager: EntityManager, eventId: string): Promise<void>;
  markAsFailed(entityManager: EntityManager, eventId: string): Promise<void>;
}
