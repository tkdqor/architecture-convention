import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { OrderOutboxRepository } from '../../domain/repository/command/order-outbox.repository';

@Injectable()
export class OutboxEventPublisher {
  private readonly logger = new Logger(OutboxEventPublisher.name);

  constructor(
    private readonly dataSource: DataSource,
    @Inject('OrderOutboxRepository')
    private readonly orderOutboxRepository: OrderOutboxRepository,
  ) {}

  // 매 30초마다 polling 진행
  // TODO: 현재는 event가 발행 완료되어도 계속 polling 진행됨
  @Cron('*/10 * * * * *')
  async backupPolling(): Promise<void> {
    this.logger.log('Running backup polling for missed events');
    await this.publishEventsOfType('OrderPaidEvent');
  }

  private async publishEventsOfType(eventType: string): Promise<void> {
    try {
      await this.dataSource.transaction(async (entityManager) => {
        // 대기 중인 특정 타입의 이벤트 조회
        const pendingEvent = await this.orderOutboxRepository.findPendingEvent(
          entityManager,
          eventType, // eventType 으로 필터링
        );

        if (pendingEvent == null) {
          return; // 처리할 이벤트가 없으면 종료
        }

        this.logger.log(`Processing pending '${eventType}' events`);

        // outbox 이벤트 발행하기
        try {
          // TODO: 실제 이벤트 발행 로직
          this.logger.log(
            `Publishing event: ${pendingEvent.eventType} for ${pendingEvent.eventId}`,
          );

          // 3. 발행 성공 시 상태를 PUBLISHED로 변경
          await this.orderOutboxRepository.markAsPublished(
            entityManager,
            pendingEvent.eventId,
          );

          this.logger.log(
            `Successfully published event: ${pendingEvent.eventId}`,
          );
        } catch (error) {
          // 4. 발행 실패 시 상태를 FAILED로 변경
          await this.orderOutboxRepository.markAsFailed(
            entityManager,
            pendingEvent.eventId,
          );

          this.logger.error(
            `Failed to publish event: ${pendingEvent.eventId}`,
            error,
          );
        }
      });
    } catch (error) {
      this.logger.error('Error in publishEventsOfType:', error);
    }
  }
}
