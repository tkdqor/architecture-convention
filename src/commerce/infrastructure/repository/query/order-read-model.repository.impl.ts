import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { OrderReadModelRepository } from '../../../domain/repository/query/order-read-model.repository';
import { OrderReadModel } from '../../../domain/entity/query/order.read-model';
import { OrderItemReadModel } from '../../../domain/entity/query/order-item.read-model';
import { Order } from '../../../domain/entity/command/order.entity';
import { OrderItem } from '../../../domain/entity/command/order-item.entity';
import { NotFoundOrderApplicationException } from '../../../../common/exception/not-found-order-application-exception';

@Injectable()
export class OrderReadModelRepositoryImpl implements OrderReadModelRepository {
  async getById(
    entityManager: EntityManager,
    id: string,
  ): Promise<OrderReadModel> {
    // Order만 먼저 조회
    const orderEntity = await entityManager
      .createQueryBuilder(Order, 'order')
      .where('order.id = :id', { id })
      .getOne();

    if (!orderEntity) {
      throw new NotFoundOrderApplicationException(id);
    }

    // 2. 해당 Order의 OrderItem들을 별도로 조회
    const orderItemEntities = await entityManager
      .createQueryBuilder(OrderItem, 'orderItem')
      .where('orderItem.order_id = :orderId', { orderId: id })
      .getMany();

    // Entity를 ReadModel로 변환
    return this.toOrderReadModel(orderEntity, orderItemEntities);
  }

  async findById(
    entityManager: EntityManager,
    id: string,
  ): Promise<OrderReadModel | null> {
    // Order만 먼저 조회
    const orderEntity = await entityManager
      .createQueryBuilder(Order, 'order')
      .where('order.id = :id', { id })
      .getOne();

    if (!orderEntity) {
      return null;
    }

    // 2. 해당 Order의 OrderItem들을 별도로 조회
    const orderItemEntities = await entityManager
      .createQueryBuilder(OrderItem, 'orderItem')
      .where('orderItem.order_id = :orderId', { orderId: id })
      .getMany();

    // Entity를 ReadModel로 변환
    return this.toOrderReadModel(orderEntity, orderItemEntities);
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
      this.toOrderItemReadModel(item, orderEntity.getId()),
    );

    // Order Entity를 OrderReadModel로 변환
    return new OrderReadModel(
      orderEntity.getId(),
      orderEntity.getCustomerId(),
      orderEntity.getStatus(),
      orderEntity.getTotalAmount(),
      items,
      items.length,
      orderEntity.getCreatedAt(),
      orderEntity.getUpdatedAt(),
    );
  }

  /**
   * OrderItem Entity를 OrderItemReadModel로 변환
   */
  private toOrderItemReadModel(
    orderItem: OrderItem,
    orderId: string,
  ): OrderItemReadModel {
    const totalAmount = orderItem.getPrice() * orderItem.getQuantity();
    return new OrderItemReadModel(
      orderItem.getId(),
      orderId,
      orderItem.getProductId(),
      orderItem.getPrice(),
      orderItem.getQuantity(),
      totalAmount,
      orderItem.getCreatedAt(),
      orderItem.getUpdatedAt(),
    );
  }
}
