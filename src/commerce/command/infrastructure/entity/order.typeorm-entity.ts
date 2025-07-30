import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItemTypeOrmEntity } from './order-item.typeorm-entity';
import { OrderStatusEnum } from '../../domain/entity/pure-order';

/**
 * TypeORM 전용 Order 엔티티
 * 순수하게 데이터 저장/조회를 위한 용도
 */
@Entity('convention_order')
export class OrderTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @OneToMany(() => OrderItemTypeOrmEntity, (orderItem) => orderItem.order, {
    eager: true,
    cascade: true,
  })
  items: OrderItemTypeOrmEntity[];

  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PLACED,
  })
  status: OrderStatusEnum;

  // Money Value Object를 플랫하게 저장
  @Column({ name: 'amount', type: 'bigint', comment: '총 금액' })
  totalAmount: number;

  // PaymentCardInfo Value Object를 플랫하게 저장
  @Column({ name: 'card_number', nullable: true })
  cardNumber?: string;

  @Column({ name: 'card_holder', nullable: true })
  cardHolder?: string;

  @Column({ name: 'expiry', nullable: true })
  cardExpiry?: string;

  @Column({ name: 'cvc', nullable: true })
  cardCvc?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
