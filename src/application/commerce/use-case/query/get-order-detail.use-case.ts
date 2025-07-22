import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrderReadModel } from '../../../../domain/commerce/entity/query/order.read-model';
import { OrderReadModelRepository } from '../../../../domain/commerce/repository/query/order-read-model.repository';

@Injectable()
export class GetOrderDetailUseCase {
  constructor(
    private dataSource: DataSource,
    @Inject('OrderReadModelRepository')
    private readonly orderReadModelRepository: OrderReadModelRepository,
  ) {}

  async execute(): Promise<OrderReadModel> {
    const entityManager = this.dataSource.manager;
    const orderId = '61eebd15-a028-4220-a2b3-9885ca307060';
    return await this.orderReadModelRepository.getById(entityManager, orderId);
  }
}
