import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { OrderReadModelRepository } from './order-read-model.repository';
import { OrderReadModel } from '../../readmodel/order.read-model';
import { OrderItemReadModel } from '../../readmodel/order-item.read-model';
import { Order } from '../../../domain/entity/order.entity';
import { OrderItem } from '../../../domain/entity/order-item.entity';
import { NotFoundOrderApplicationException } from '../../../../common/exception/not-found-order-application-exception';

@Injectable()
export class OrderReadModelRepositoryImpl implements OrderReadModelRepository {
  async getById(
    entityManager: EntityManager,
    id: string,
  ): Promise<OrderReadModel> {
    // eager: true 설정이 실제로 어떻게 동작하는지 확인
    const orderEntity = await entityManager.findOne(Order, {
      where: { id },
    });

    if (!orderEntity) {
      throw new NotFoundOrderApplicationException(id);
    }

    // Entity를 ReadModel로 변환 (eager: true로 인해 orderEntity.items가 자동으로 로드됨)
    return this.toOrderReadModel(orderEntity, orderEntity.items);
  }

  async findById(
    entityManager: EntityManager,
    id: string,
  ): Promise<OrderReadModel | null> {
    // eager: true 설정으로 Order와 OrderItem을 한 번에 조회
    const orderEntity = await entityManager
      .createQueryBuilder(Order, 'order')
      .leftJoinAndSelect('order.items', 'orderItem') // eager 관계를 명시적으로 조인
      .where('order.id = :id', { id })
      .getOne();

    if (!orderEntity) {
      return null;
    }

    // Entity를 ReadModel로 변환 (OrderItem은 order.items에 이미 포함됨)
    return this.toOrderReadModel(orderEntity, orderEntity.items);
  }

  /**
   * Order Entity와 OrderItem Entity들을 OrderReadModel로 변환
   */
  private toOrderReadModel(
    orderEntity: Order,
    orderItemEntities: OrderItem[],
  ): OrderReadModel {
    // OrderItem Entity들을 OrderItemReadModel로 변환
    const items = orderItemEntities.map((item) =>
      this.toOrderItemReadModel(item, orderEntity.id),
    );

    // Order Entity를 OrderReadModel로 변환
    return new OrderReadModel(
      orderEntity.id,
      orderEntity.customerId,
      orderEntity.status,
      orderEntity.totalAmount.value,
      items,
      items.length,
      orderEntity.createdAt,
      orderEntity.updatedAt,
    );
  }

  /**
   * OrderItem Entity를 OrderItemReadModel로 변환
   */
  private toOrderItemReadModel(
    orderItem: OrderItem,
    orderId: string,
  ): OrderItemReadModel {
    const totalAmount = orderItem.price.value * orderItem.quantity;
    return new OrderItemReadModel(
      orderItem.id,
      orderId,
      orderItem.productId,
      orderItem.price.value,
      orderItem.quantity,
      totalAmount,
      orderItem.createdAt,
      orderItem.updatedAt,
    );
  }
}
