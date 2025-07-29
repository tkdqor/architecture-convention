import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { DomainEvent } from '../common/event/domain-event';

export enum OutboxStatus {
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  FAILED = 'FAILED',
}

@Entity('order_outbox')
export class OrderOutboxEntity {
  @PrimaryColumn()
  eventId: string;

  @Column()
  entityId: string;

  @Column()
  eventType: string;

  @Column('text')
  eventData: string; // JSON 문자열로 저장

  @Column()
  occurredAt: Date;

  @Column({
    type: 'enum',
    enum: OutboxStatus,
    default: OutboxStatus.PENDING,
  })
  status: OutboxStatus;

  @Column({ nullable: true })
  errorMessage?: string;

  @Column()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column()
  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  static fromDomainEvent(event: DomainEvent): OrderOutboxEntity {
    const outbox = new OrderOutboxEntity();
    outbox.eventId = event.eventId;
    outbox.entityId = event.entityId;
    outbox.eventType = event.eventType;
    outbox.eventData = JSON.stringify(event);
    outbox.occurredAt = event.occurredAt;
    outbox.status = OutboxStatus.PENDING;
    outbox.createdAt = new Date();
    outbox.updatedAt = new Date();
    return outbox;
  }
}
