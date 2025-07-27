import { v4 as uuidv4 } from 'uuid';

export abstract class DomainEvent {
  eventId: string;
  entityId: string;
  eventType: string;
  occurredAt: Date;

  protected constructor(aggregateId: string, eventType: string) {
    this.eventId = uuidv4();
    this.entityId = aggregateId;
    this.eventType = eventType;
    this.occurredAt = new Date();
  }
}
