import { EntityManager } from 'typeorm';
import { PureOrder } from '../entity/pure-order';

export interface OrderRepository {
  save(entityManager: EntityManager, order: PureOrder): Promise<PureOrder>;
  getById(entityManager: EntityManager, id: string): Promise<PureOrder>;
  findById(entityManager: EntityManager, id: string): Promise<PureOrder | null>;
}
