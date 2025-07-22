import { EntityManager } from 'typeorm';
import { OrderReadModel } from '../../entity/query/order.read-model';

export interface OrderReadModelRepository {
  getById(entityManager: EntityManager, id: string): Promise<OrderReadModel>;
  findById(
    entityManager: EntityManager,
    id: string,
  ): Promise<OrderReadModel | null>;
}
