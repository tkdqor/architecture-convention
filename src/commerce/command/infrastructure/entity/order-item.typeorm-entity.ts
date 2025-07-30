import {
  Column, CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { OrderTypeOrmEntity } from './order.typeorm-entity';

/**
 * TypeORM 전용 OrderItem 엔티티
 * 순수하게 데이터 저장/조회를 위한 용도
 */
@Entity('convention_order_item')
export class OrderItemTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'product_name' })
  productName: string;

  @Column({ name: 'amount', type: 'bigint', comment: '상품 가격' })
  price: number;

  @Column({ name: 'quantity' })
  quantity: number;

  @ManyToOne(() => OrderTypeOrmEntity, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: OrderTypeOrmEntity;

  @Column({ name: 'order_id' })
  orderId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
