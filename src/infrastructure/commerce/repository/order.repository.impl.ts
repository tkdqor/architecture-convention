import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../../domain/commerce/repository/order.repository';
import { Order } from 'src/domain/commerce/entity/order.entity';
import { EntityManager } from 'typeorm';
import { NotFoundOrderApplicationException } from '../../../common/exception/not-found-order-application-exception';

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
  async save(entityManager: EntityManager, order: Order): Promise<Order> {
    return await entityManager.getRepository(Order).save(order);
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
