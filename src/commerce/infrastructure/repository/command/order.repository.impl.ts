import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../../domain/repository/order.repository';
import { Order } from 'src/commerce/domain/entity/order.entity';
import { OrderItem } from 'src/commerce/domain/entity/order-item.entity';
import { EntityManager } from 'typeorm';
import { NotFoundOrderApplicationException } from '../../../../common/exception/not-found-order-application-exception';

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
  async save(entityManager: EntityManager, order: Order): Promise<Order> {
    // 1. Order 저장
    const savedOrder = await entityManager.getRepository(Order).save(order);

    // 2. OrderItem들도 함께 저장 (DDD 원칙: 애그리거트 루트가 내부 엔티티 저장 책임)
    const orderItems = order.items;
    for (const item of orderItems) {
      await entityManager.getRepository(OrderItem).save(item);
    }

    return savedOrder;
  }

  async getById(entityManager: EntityManager, id: string): Promise<Order> {
    const order = await entityManager.getRepository(Order).findOne({
      where: { id: id },
    });
    if (!order) {
      throw new NotFoundOrderApplicationException(id);
    }
    return order;
  }

  async findById(
    entityManager: EntityManager,
    id: string,
  ): Promise<Order | null> {
    return await entityManager.getRepository(Order).findOne({
      where: { id: id },
    });
  }
}
