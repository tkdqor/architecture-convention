import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../domain/repository/order.repository';
import { PureOrder } from '../../domain/entity/pure-order';
import { EntityManager } from 'typeorm';
import { NotFoundOrderApplicationException } from '../../application/exception/not-found-order-application-exception';

import { OrderMapper } from '../mapper/order.mapper';
import { OrderTypeOrmEntity } from '../entity/order-typeorm-entity';

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
  async save(
    entityManager: EntityManager,
    order: PureOrder,
  ): Promise<PureOrder> {
    // 도메인 객체 → TypeORM 엔티티 변환
    const orderTypeOrmEntity = OrderMapper.toTypeOrmEntity(order);

    // TypeORM 엔티티 저장
    const savedOrderEntity = await entityManager
      .getRepository(OrderTypeOrmEntity)
      .save(orderTypeOrmEntity);

    // 저장된 TypeORM 엔티티 → 도메인 객체 변환하여 반환
    return OrderMapper.toDomain(savedOrderEntity);
  }

  async getById(entityManager: EntityManager, id: string): Promise<PureOrder> {
    const orderTypeOrmEntity = await entityManager
      .getRepository(OrderTypeOrmEntity)
      .findOne({
        where: { id: id },
        relations: ['items'], // OrderItem들도 함께 조회
      });

    if (!orderTypeOrmEntity) {
      throw new NotFoundOrderApplicationException(id);
    }

    // TypeORM 엔티티 → 도메인 객체 변환
    return OrderMapper.toDomain(orderTypeOrmEntity);
  }

  async findById(
    entityManager: EntityManager,
    id: string,
  ): Promise<PureOrder | null> {
    const orderEntity = await entityManager
      .getRepository(OrderTypeOrmEntity)
      .findOne({
        where: { id: id },
        relations: ['items'], // OrderItem들도 함께 조회
      });

    if (!orderEntity) {
      return null;
    }

    // TypeORM 엔티티 → 도메인 객체 변환
    return OrderMapper.toDomain(orderEntity);
  }
}
