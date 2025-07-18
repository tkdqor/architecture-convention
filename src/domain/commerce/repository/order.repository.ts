import { EntityManager } from 'typeorm';
import { Order } from '../entity/order.entity';

export interface OrderRepository {
  getById(entityManager: EntityManager, id: string): Promise<Order>;
  findById(entityManager: EntityManager, id: string): Promise<Order | null>;
}
