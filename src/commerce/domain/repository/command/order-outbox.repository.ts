import { EntityManager } from 'typeorm';
import { DomainEvent } from '../../common/event/domain-event';

export interface OrderOutboxRepository {
  save(entityManager: EntityManager, events: DomainEvent[]): Promise<void>;
}
